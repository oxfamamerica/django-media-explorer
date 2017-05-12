import json, traceback, re
from django import template
from django.template import Template, Context, RequestContext
from django.db.models import Q
from django.conf import settings

from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage
from django.template import Context
from django.template.loader import get_template
import traceback
from oxfam.core.logging.logger import logger

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


def get_media_gallery(id, template="media_explorer/gallery_slick.html"):
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
    content = html.encode('utf-8')
    #logger.error("content {0}".format(content))
    try:
        pattern_img = r'\[media-explorer-image-(?P<id>\d+)\]?'
        pattern_video = r'\[media-explorer-video-(?P<id>\d+)\]?'
        pattern_gallery = r'\[media-explorer-gallery-(?P<id>\d+)\]?'
        #logger.error("pattern_img {0}".format(pattern_img))
        #logger.error("pattern_video {0}".format(pattern_video))
        #logger.error("pattern_gallery {0}".format(pattern_gallery))
        match_img = re.findall(pattern_img, str(content), re.DOTALL)
        #logger.error("match_img {0}".format(match_img))
        match_video = re.findall(pattern_video, str(content), re.DOTALL)
        #logger.error("match_video {0}".format(match_video))
        match_gallery = re.findall(pattern_gallery, str(content), re.DOTALL)
        #logger.error("match_gallery {0}".format(match_gallery))
        if match_img:
            for id in match_img:
                html2 = get_inline_image(id)
                content = re.sub(pattern_img, html2, str(content))
        if match_video:
            for id in match_video:
                html2 = get_video(id)
                content = re.sub(pattern_video, html2, str(content))
        if match_gallery:
            for id in match_gallery:
                html2 = get_media_gallery(id)
                content = re.sub(pattern_gallery, html2, str(content))
        #return content
    except:
        print traceback.format_exc()

    return content

register.filter('show_short_code', show_short_code)
register.filter('has_size', has_size)
register.simple_tag()(get_media_gallery)
register.simple_tag()(get_video)
register.simple_tag()(get_inline_image)
register.simple_tag()(get_image_url_from_size)
