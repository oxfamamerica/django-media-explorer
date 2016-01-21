*********************
Django Media Explorer
*********************


Installation
************

Install
#######

::

    pip install django-media-explorer

Update settings
###############

Add these to your INSTALLED_APPS settings

::

    'rest_framework',
    'micawber.contrib.mcdjango',
    'media_explorer',
    'ckeditor',

Add these to your urls.py

::

    ("^ckeditor/", include("ckeditor.urls")),
    ("^", include("media_explorer.urls")),

Copy and paste this code into the bottom of your settings.py file.

::

    try:
        from media_explorer.settings import *
    except ImportError:
        pass

Create tables
#############

Run these migration commands to create your database tables.

::

    python manage.py makemigrations
    python manage.py migrate


How it works
************

Add the MediaField and RichTextField fields to your model.

::

    from django.db import models
    from media_explorer.fields import MediaField, RichTextField

    class Blog(models.Model):
        """
        Example Blog model
        """

        title = models.CharField(max_length=150)

        #If you do not provide a type then media can be image/video/gallery
        lead_media = MediaField()

        #Providing a type will restrict the element to this type
        video = MediaField(type="video")

        #You will see a CKEditor WYSIWYG with DME plugin
        #NOTE: You cannot use more than one RichText field in a model
        entry = RichTextField()

After you add media fields to your model you can add data via the admin page (`See screenshot <https://s3.amazonaws.com/media.oxfamamerica.org/images/github/add_blog.png>`_ - the red-circled button is the DME plugin button. It will allow you to insert media elements into your WYSIWYG)

Go to https://github.com/oxfamamerica/django-media-explorer for more documentation on how to add images, videos and galleries programatically via the API and how to display media in your templates.


Tests
*****

Run this command to run all the DME tests.

::

    python manage.py test media_explorer.tests

Or you can run the tests individually.

::

    python manage.py test media_explorer.tests.elements.tests
    python manage.py test media_explorer.tests.galleries.tests
    python manage.py test media_explorer.tests.customfields.tests


