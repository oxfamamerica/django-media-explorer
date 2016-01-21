import json
from django.core.exceptions import ValidationError
from django import forms
from media_explorer.widgets import MediaWidget, RichTextWidget

class MediaFormField(forms.Field):
    def __init__(self, name=None, required=False, widget=MediaWidget, label=None, initial=None, help_text="", max_length=None, *args, **kwargs):
        super(MediaFormField, self).__init__(required=required, widget=MediaWidget, label=label, initial=initial, help_text=help_text, *args, **kwargs)

    def clean(self, value):
        if value:
            try:
                data = json.loads(value)
            except Exception as e:
                raise ValidationError("JSON parsing error: " + str(e))
            return value
        return None

class RichTextFormField(forms.Field):
    def __init__(self, name=None, required=False, widget=RichTextWidget, label=None, initial=None, help_text="", max_length=None, *args, **kwargs):
        super(RichTextFormField, self).__init__(required=required, widget=RichTextWidget, label=label, initial=initial, help_text=help_text, *args, **kwargs)

    def clean(self, value):
        if value:
            return value
        return None
