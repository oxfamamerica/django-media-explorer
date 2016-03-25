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

    url("^ckeditor/", include("ckeditor.urls")),
    url("^", include("media_explorer.urls")),

Copy and paste this code into the bottom of your settings.py file.

::

    try:
        from media_explorer.settings import *
    except ImportError:
        pass


The DME application will try to resize your images during your upload. If you do not want to resize your images then set the setting **DME_RESIZE = False** somewhere in your settings.py file (after the "media_explorer.settings" import).

If you use your own JQuery in your admin pages and you do not want the DME application JQuery to conflict with yours then set **DME_INCLUDE_JQUERY = False** (since v0.3.6).

Create tables
#############

Run these migration commands to create your database tables.

::

    python manage.py makemigrations
    python manage.py migrate


How it works
************

Add the MediaImageField, MediaField and RichTextField fields to your model.

::

    from django.db import models
    from media_explorer.fields import MediaImageField, MediaField, RichTextField

    class Blog(models.Model):
        """
        Example Blog model
        """

        title = models.CharField(max_length=150)

        #Since v0.3.6
        #This behaves exactly as Django's ImageField with following differences:
        #1) You can add an optional max_upload_size=xxx to limit upload size
        #2) After image is saved you can see it listed at http://YOUR-DJANGO-SITE-URL/media_explorer
        #3) If the setting DME_RESIZE = True then image will be resized
        my_image = MediaImageField(max_upload_size=5242880,upload_to="my_dir")

        #Since v0.3.0
        #If you do not provide a type then media can be image/video/gallery
        lead_media = MediaField()

        #Since v0.3.0
        #Providing a type will restrict the element to this type
        video = MediaField(type="video")

        #Since v0.3.0
        #You will see a CKEditor WYSIWYG with DME plugin
        #NOTE: You cannot use more than one RichText field in a model
        entry = RichTextField()

After you add media fields to your model you can add data via the admin page (`See screenshot <https://s3.amazonaws.com/media.oxfamamerica.org/images/github/add_blog.png>`_ - the red-circled button is the DME plugin button. It will allow you to insert media elements into your WYSIWYG)

After you add media you can access them by going to http://YOUR-DJANGO-SITE-URL/media_explorer/ (`See screenshot here <http://media.oxfamamerica.org.s3.amazonaws.com/images/github/dme-images.jpg>`_).

Go to https://github.com/oxfamamerica/django-media-explorer for more documentation on how to add images, videos and galleries programatically via the API and how to display media in your templates.

Go to https://github.com/oxfamamerica/media_explorer_example to download and run an example blog application.


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


