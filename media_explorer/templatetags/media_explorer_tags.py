import json, traceback, re
from django import template
from django.template import Template, Context, RequestContext
from django.db.models import Q
from django.conf import settings

from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage
from django.template import Context
from django.template.loader import get_template
import traceback

register = template.Library()

def get_inline_image(id):
    try:
        t = get_template("media_explorer/inline_image.html")
        image = Element.objects.get(id=id,type="image")
        c = Context({"image":image,"class":"img-inline-float-left"})
        return t.render(c)
    except:
        print traceback.format_exc()

    return ""


def get_video(id):
    try:
        t = get_template("media_explorer/video.html")
        video = Element.objects.get(id=id,type="video")
        c = Context({"video":video})
        return t.render(c)
    except:
        print traceback.format_exc()

    return ""

def get_media_gallery(id,template="media_explorer/gallery_slick.html"):
    try:
        t = get_template(template)
        gallery = Gallery.objects.get(id=id)
        galleryelements = GalleryElement.objects.filter(gallery=gallery)
        c = Context({"gallery":gallery,"galleryelements":galleryelements})
        return t.render(c)
    except:
        print traceback.format_exc()

    return ""

def has_size(element, comma_separated_sizes):
    try:
        args = comma_separated_sizes.split(",")
        if ResizedImage.objects.filter(image=element,size__in=args).exists():
            return True
        for size in args:
            if ResizedImage.objects.filter(image=element,size=size).exists():
                return True
    except:
        print traceback.format_exc()

    return False

def get_image_url_from_size(id, *args):
    """
    The command may be {% get_image_url_from_size 123 "image|video|gallery" "800x500" "420x230" %}
    Or it could be  {% get_image_url_from_size 123 "800x500" "420x230" %}
    """
    try:
        if args[0] == "gallery":
            gallery = Gallery.objects.get(id=id)
            return gallery.thumbnail_image_url
        elif args[0] == "video":
            video = Element.objects.get(id=id)
            return video.thumbnail_image_url
    except:
        print traceback.format_exc()

    try:
        #If we are here then this is an image
        element = Element.objects.get(id=id)
        try:
            if not ResizedImage.objects.filter(image=element,size__in=args).exists():
                return element.image_url
            for size in args:
                if ResizedImage.objects.filter(image=element,size=size).exists():
                    return ResizedImage.objects.get(image=element,size=size).image_url
        except:
            print traceback.format_exc()
        return element.image_url
    except:
        print traceback.format_exc()


def show_short_code(html):
    try:

        pattern_img = r'\[media-explorer-image-(?P<id>\d+)\]?'
        pattern_video = r'\[media-explorer-video-(?P<id>\d+)\]?'
        pattern_gallery = r'\[media-explorer-gallery-(?P<id>\d+)\]?'

        match_img = re.findall(pattern_img, str(html), re.DOTALL)
        match_video = re.findall(pattern_video, str(html), re.DOTALL)
        match_gallery = re.findall(pattern_gallery, str(html), re.DOTALL)

        if match_img:
            for id in match_img:
                html2 = get_inline_image(id)
                html = re.sub(pattern_img,html2,str(html))

        if match_video:
            for id in match_video:
                html2 = get_video(id)
                html = re.sub(pattern_video,html2,str(html))

        if match_gallery:
            for id in match_gallery:
                html2 = get_media_gallery(id)
                html = re.sub(pattern_gallery,html2,str(html))

        return html
    except:
        print traceback.format_exc()

    return ""

register.filter('show_short_code', show_short_code)
register.filter('has_size', has_size)
register.simple_tag()(get_media_gallery)
register.simple_tag()(get_video)
register.simple_tag()(get_inline_image)
register.simple_tag()(get_image_url_from_size)
