import traceback, csv, copy
from django.http import HttpResponse
from django.contrib import admin
from django.conf import settings
from django.contrib.auth.models import User
from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage

class ElementAdmin(admin.ModelAdmin):
    search_fields = ["name","description", "credit"]
    list_display = ('id','name',)
    list_filter = ('type',)

    def get_form(self, request, obj=None, **kwargs):
        self.exclude = ("type",)
        form = super(ElementAdmin, self).get_form(request, obj, **kwargs)
        return form


class GalleryAdmin(admin.ModelAdmin):
    search_fields = ["name","description"]
    list_display = ('id','name',)

class GalleryElementAdmin(admin.ModelAdmin):
    search_fields = ["gallery","element"]
    list_display = ('id','gallery','element','sort_by')

class ResizedImageAdmin(admin.ModelAdmin):
    search_fields = ["file_name"]
    list_display = ('id','file_name','image','size','image_width','image_height','html_img')
    #list_filter = ('image',)

admin.site.register(Element, ElementAdmin)
admin.site.register(Gallery, GalleryAdmin)
admin.site.register(GalleryElement, GalleryElementAdmin)
admin.site.register(ResizedImage, ResizedImageAdmin)
