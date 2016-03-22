import json
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from media_explorer.models import Element, Gallery
from media_explorer.forms import MediaFormField, RichTextFormField

from django.db.models import signals, FileField
from django.forms import forms
from django.template.defaultfilters import filesizeformat


def parse_media(string_or_obj):
    """Takes a JSON string, converts it into a Media object."""
    data = {}
    kwargs = {}
    kwargs["id"] = None
    kwargs["type"] = None
    kwargs["caption"] = None
    kwargs["credit"] = None
    try:
        if type(string_or_obj) is dict:
            data = string_or_obj
        elif type(string_or_obj) is Element:
            data["id"] = string_or_obj.id
            data["type"] = string_or_obj.type
            data["caption"] = string_or_obj.description
            data["credit"] = string_or_obj.credit
        elif type(string_or_obj) is Gallery:
            data["id"] = string_or_obj.id
            data["type"] = "gallery"
        else:
            data = json.loads(string_or_obj)
    except Exception as e:
        raise ValidationError("Media parsing error: " + str(e))

    if data:
        kwargs.update(data)
    return Media(**kwargs)

def parse_richtext(text):
    """Takes a string, converts it into a RichText object."""
    return RichText(text)


class Media(object):
    """The corresponding Python object for the Django MediaField."""
    def __init__(self,id=None,type=None,caption=None,credit=None):
        self.id = id
        self.type = type
        self.caption = caption
        self.credit = credit

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["type"] = self.type
        _dict["caption"] = self.caption
        _dict["credit"] = self.credit
        return _dict

    def __repr__(self):
        #return "[MediaField object]: id=%s, type=%s" % (self.id, self.type)
        return json.dumps(self.to_dict())

class MediaField(models.TextField):
    """The Django MediaField."""

    description = _("A Media Explorer custom model field")

    def __init__(self, id=None, type=None, \
            credit=None, caption=None, *args, **kwargs):
        self.id = id
        self.type = type
        self.caption = caption
        self.credit = credit

        kwargs['null'] = True
        kwargs['blank'] = True

        super(MediaField, self).__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super(MediaField, self).deconstruct()
        del kwargs["null"]
        del kwargs["blank"]
        return name, path, args, kwargs

    def db_type(self, connection):
        return "longtext"

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value
        return parse_media(value)

    def do_validation(self, media):
        if self.type and media.type and self.type != media.type:
            raise ValidationError("Invalid media type selected for this MediaField instance. It expected a '%s' but got a '%s' instead." % (self.type, media.type))

        #Override id/credit/caption
        if self.id : media.id = self.id
        if self.type: media.type = self.type
        if self.caption : media.caption = self.caption
        if self.credit: media.credit = self.credit

        #Validate that the image/video is in the system
        if media.type in ["image","video"] and \
                not Element.objects.filter(id=media.id,type=media.type).exists():
            raise ValidationError("Invalid %s selected. The %s was not found." % (media.type, media.type))

        #Validate that the gallery is in the system
        if media.type == "gallery" and \
                not Gallery.objects.filter(id=media.id).exists():
            raise ValidationError("Invalid %s selected. The %s was not found." % (media.type, media.type))

        return media

    def to_python(self, value):
        if isinstance(value, Media):
            return value

        if value is None:
            return value

        return self.do_validation(parse_media(value))
    
    def get_prep_value(self, value):
        value_dict = {}

        try:
            value_dict["id"] = value.id
            value_dict["type"] = value.type
            value_dict["caption"] = value.caption
            value_dict["credit"] = value.credit
        except:
            pass

        if type(value) is Element:
            value_dict["id"] = value.id
            value_dict["type"] = value.type
            value_dict["caption"] = None
            value_dict["credit"] = None
            if value.description:
                value_dict["caption"] = value.description
            if value.credit:
                value_dict["credit"] = value.credit

        if value_dict:
            self.do_validation(parse_media(value_dict))
            return str(json.dumps(value_dict))

        if value: return str(value)
        return value

    def formfield(self, **kwargs):
        defaults = {}
        defaults["form_class"] = MediaFormField
        defaults.update(kwargs)
        return super(MediaField, self).formfield(**defaults)


class RichText(object):
    """The corresponding Python object for the Django RichTextField."""

    def __init__(self,text):
        self.text = text

    def __repr__(self):
        return self.text

class RichTextField(models.TextField):
    """The Django RichTextField."""

    description = _("A RichText Explorer custom model field")

    def __init__(self, *args, **kwargs):
        kwargs['null'] = True
        kwargs['blank'] = True
        super(RichTextField, self).__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super(RichTextField, self).deconstruct()
        del kwargs["null"]
        del kwargs["blank"]
        return name, path, args, kwargs

    def db_type(self, connection):
        return "longtext"

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value
        return parse_richtext(value)

    def do_validation(self, richtext):
        return richtext

    def to_python(self, value):
        if isinstance(value, RichText):
            return value

        if value is None:
            return value

        return self.do_validation(parse_richtext(value))
    

    def get_prep_value(self, value):
        if value: return str(value)
        return value

    def formfield(self, **kwargs):
        defaults = {}
        defaults["form_class"] = RichTextFormField
        defaults.update(kwargs)
        return super(RichTextField, self).formfield(**defaults)

class MediaImageField(FileField):
    """
    Forked from: https://djangosnippets.org/snippets/2206
    Same as FileField, but you can specify:
        * max_upload_size - a number indicating the maximum file size allowed for upload.
            2.5MB - 2621440
            5MB - 5242880
            10MB - 10485760
            20MB - 20971520
            50MB - 5242880
            100MB 104857600
            250MB - 214958080
            500MB - 429916160
    """
    def __init__(self, *args, **kwargs):
        self.content_types = []
        self.max_upload_size = 0
        self.new_upload = False

        #try:
        #    self.content_types = ["image/png","image/jpeg","image/jpg","image/bmp","image/gif","image/tiff","image/ief","image/g3fax"]
        #except Exception as e:
        #    pass

        try:
            self.max_upload_size = kwargs.pop("max_upload_size")
        except Exception as e:
            pass

        super(MediaImageField, self).__init__(*args, **kwargs)

    def clean(self, *args, **kwargs):
        data = super(MediaImageField, self).clean(*args, **kwargs)

        file = data.file
        #content_type = file.content_type
        content_type = getattr(file,"content_type",None)

        if "django.core.files.uploadedfile.InMemoryUploadedFile" in str(type(file)):
            self.new_upload = True

        if content_type and not content_type.lower().startswith("image/"):
            raise forms.ValidationError(_('The file you selected is not an image. Please select an image.'))

        if self.max_upload_size > 0 and \
                file._size > self.max_upload_size:
            raise forms.ValidationError(_('Please keep filesize under %s. Current filesize %s') % (filesizeformat(self.max_upload_size), filesizeformat(file._size)))

        return data

    def contribute_to_class(self, cls, name, **kwargs):
        super(MediaImageField, self).contribute_to_class( cls, name, **kwargs)
        signals.post_save.connect(self.on_post_save_callback, sender=cls)
        #signals.post_delete.connect(self.on_post_delete_callback, sender=cls)

    def on_post_save_callback(self, instance, force=False, *args, **kwargs):
        """
        Save image into Element model
        """
        if self.new_upload and \
                type(instance.__dict__[self.name]) in [str,unicode]:
            data = {}
            data["image"] = instance.__dict__[self.name]
            element = Element()
            element.__dict__.update(data)
            element.save()

    #def on_post_delete_callback(self, instance, force=False, *args, **kwargs):
    #    """
    #    TODO
    #    Delete file from Element model
    #    """
    #    pass
