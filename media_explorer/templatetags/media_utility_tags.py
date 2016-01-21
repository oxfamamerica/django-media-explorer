import json, traceback, re
from django import template
from django.template import Template, Context, RequestContext
from django.conf import settings

from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage
from django.template import Context
from django.template.loader import get_template
import traceback

register = template.Library()

def get_media_from_json(json_string):
    data = {}
    try:
        data = json.loads(json_string)
    except:
        pass

    return data


register.assignment_tag()(get_media_from_json)
