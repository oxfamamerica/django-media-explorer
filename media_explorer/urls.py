from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView

from media_explorer.views import ElementStatsView, GalleryStatsView
from rest_framework import routers
from media_explorer.models import Element
from media_explorer.django_rest_framework import ElementList, ElementDetail, GalleryList, GalleryDetail, GalleryElementDetail, ResizedImageList

urlpatterns = patterns('',
    url(r'^api/stats/elements', ElementStatsView.as_view(), name='api-stats-elements'),
    url(r'^api/stats/galleries', GalleryStatsView.as_view(), name='api-stats-galleries'),
    url(r'^api/media/elements/(?P<pk>[0-9]+)$', ElementDetail.as_view()),
    url(r'^api/media/elements', ElementList.as_view(), name='api-media-elements'),
    url(r'^api/media/resizedimages', ResizedImageList.as_view(), name='api-media-resizedimages'),
    url(r'^api/media/galleries/(?P<pk>[0-9]+)$', GalleryDetail.as_view()),
    url(r'^api/media/galleries', GalleryList.as_view(), name='api-media-galleries'),
    url(r'^api/media/galleryelements/(?P<pk>[0-9]+)$', GalleryElementDetail.as_view()),
    url(r'^media_explorer/', staff_member_required(TemplateView.as_view(template_name='admin/media_explorer/base.html')), name='media_explorer')
)
