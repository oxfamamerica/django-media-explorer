from __future__ import unicode_literals

import os, datetime

#from django.db import connection

from media_explorer.fields import MediaField, RichTextField

from django.db import models

class Example(models.Model):
    """
    Example model that uses MediaField and RichTextField
    """

    name = models.CharField(null=True,blank=True)
    lead_media = MediaField()
    image = MediaField(type="image")
    video = MediaField(type="video")
    body = RichTextField()

    class Meta:
        verbose_name_plural = "Example"

    def __unicode__(self):
        return u"%s" % (self.name)

