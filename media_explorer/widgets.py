from django import forms
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string
from ckeditor.widgets import CKEditorWidget
from django.conf import settings

class MediaWidget(forms.Widget):
    template_name = 'admin/media_field.html'

    class Media:
        if getattr(settings,"DME_INCLUDE_JQUERY",True):
            js1 = (
                'js/vendor/jquery/jquery-1.11.2.min.js',
            )
        else:
            js1 = ()

        js2 = (
            'js/media_explorer/media_explorer.js',
            'js/media_field_admin.js',
        )

        js = js1 + js2

        css = {
            'all': (
                'css/hide_media_fields.css',
            )
        }

    def render(self, name, value, attrs=None):
        context = {"name":name,"value":value}
        return mark_safe(render_to_string(self.template_name, context))


class RichTextWidget(CKEditorWidget):

    class Media:
        if getattr(settings,"DME_INCLUDE_JQUERY",True):
            js1 = (
                'js/vendor/jquery/jquery-1.11.2.min.js',
            )
        else:
            js1 = ()

        js2 = (
            'js/vendor/jQuery-Impromptu-6.1.0/jquery-impromptu.min.js',
            'js/media_explorer/media_explorer.js',
            'ckeditor/ckeditor/plugins/media_explorer/callback.js',
        )

        js = js1 + js2

        css = {
            'all': (
                'js/vendor/jQuery-Impromptu-6.1.0/jquery-impromptu.min.css',
            )
        }

