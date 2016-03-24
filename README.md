# Django Media Explorer

A Django application to manage your images, video links, embeds and create slideshows.

**Table of Contents**

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Tests](#tests)
- [How it works](#how-it-works)
- [Changelog](#changelog)
- [TODO](#todo)
- [Contributing](#contributing)
- [Credits](#credits)

#Installation

##Install

Run this command:

```
pip install django-media-explorer
```

NOTE: If you want to use a virtual environment then run the following commands:

```
virtualenv dme
cd dme
source bin/activate
pip install django-media-explorer
```

##Update settings

Add these to your INSTALLED_APPS settings

```
    'rest_framework',
    'micawber.contrib.mcdjango',
    'media_explorer',
    'ckeditor',
```

Add these to your urls.py

```
    url("^ckeditor/", include("ckeditor.urls")),
    url("^", include("media_explorer.urls")),
```

Copy and paste this code into the bottom of your settings.py file.

```
try:
    from media_explorer.settings import *
except ImportError:
    pass

```

The DME application will try to resize your images during your upload. If you do not want to resize your images then set the setting **DME_RESIZE = False** somewhere in your settings.py file (after the "media_explorer.settings" import).

##Create tables

Run these migration commands to create your database tables.

```
python manage.py makemigrations
python manage.py migrate
```

#Dependencies

Pip should install all the dependencies for you but if you prefer to install DME manually then be aware of these dependencies.

This version (0.3.0) is for Django 1.7+ and 1.8+ (not yet tested on 1.9+)

Other dependencies are:
- [Django Rest Framework](http://www.django-rest-framework.org/) (version 3.0.0)
- [Micawber](https://github.com/coleifer/micawber) (version 0.3.2)
- [Pillow](https://github.com/python-pillow/Pillow) (version 2.6.1)
- [CKEditor](https://github.com/ckeditor) (version 4.4.8)

Additionally Pillow has some platform dependencies. For instance if you are on Centos then you may need to run these commands before you install.

```
sudo yum install "Development Tools"
sudo yum install python-devel
sudo yum install libjpeg-devel
sudo yum install zlib-devel
```


#Tests

Run this command to run all the DME tests.

```
python manage.py test media_explorer.tests
```

Or you can run the tests individually.

```
python manage.py test media_explorer.tests.elements.tests
python manage.py test media_explorer.tests.galleries.tests
python manage.py test media_explorer.tests.customfields.tests
```

#How it works

Go to https://github.com/oxfamamerica/media_explorer_example to download and run the example blog application.

Let's say you have a blog model that looks like this:
```
from django.db import models

class Blog(models.Model):
    """
    Example Blog model
    """
    title = models.CharField(max_length=150)
    entry = models.TextField(blank=True,null=True)


```

You can now add media to your blog by adding the MediaImageField, MediaField and RichTextField fields.

```
from django.db import models
from media_explorer.fields import MediaField, RichTextField

class Blog(models.Model):
    """
    Example Blog model
    """

    title = models.CharField(max_length=150)

    #Since v0.3.5
    #This is behaves exactly as Django's ImageField with following differences:
    #1) You can add an optional max_upload_size=xxx to limit upload size
    #2) After image is saved - an entry of the image will be added to Element table
    my_image = MediaImageField(max_upload_size=5242880,upload_to="my_dir")

    #Since v0.3.0
    #If you do not provide a type then media can be image/video/gallery
    lead_media = MediaField()

    #Since v0.3.0
    #Providing a type will restrict the element to this type
    video = MediaField(type="video")

    #Since v0.3.0
    #Entry is changed from TextField to RichTextField
    #You will see a CKEditor WYSIWYG with DME plugin
    #NOTE: You cannot use more than one RichText field in a model
    entry = RichTextField()
```

After you add media fields to your model you can add data via the admin page ([See screenshot](https://s3.amazonaws.com/media.oxfamamerica.org/images/github/add_blog.png) - the red-circled button is the DME plugin button. It will allow you to insert media elements into your WYSIWYG)

You can also add data programatically like this.

```

import os
from media_explorer.models import Element, Gallery, GalleryElement
from django.core.files import File

#Importing the Blog defined above
from blog.models import Blog

#Read your local image into my_file
my_file = open(path_to_local_image_file,"rb")

#Create an image element
image = Element()
image.name = "My image"
image.image.save(os.path.basename(my_file.name),File(my_file), save=True)

#Create a video element
video = Element()
video.video_url = "https://www.youtube.com/watch?v=nBupSKjSQM0"
video.save()

#Create a gallery
gallery = Gallery()
gallery.name = "My gallery"
gallery.save()

#Add gallery elements
ge = GalleryElement()
ge.gallery = gallery
ge.element = image
ge.credit = "My image credit"
ge.description = "My image caption"
ge.sort_by = 0
ge.save()

ge2 = GalleryElement()
ge2.gallery = gallery
ge2.element = video
ge2.sort_by = 1
ge2.save()

#NOTE: If you go to your http://example.com/media_explorer link - you should see all the media you added above on the Media Explorer page.


#Add media to blog
blog = Blog()
blog.title = "My first blog"
blog.lead_media = gallery
blog.video = video
blog.save()

#NOTE: This will fail because you set video field to type="video"
blog.video = image
blog.save()

```

If you provide the blog object (defined above) to your page - then your template may look like this.

```
{% load media_explorer_tags %}

{% if blog.lead_media.type == "video" %}
    {% get_video blog.lead_media.id %}
{% elif blog.lead_media.type == "gallery" %}
    {% get_media_gallery blog.lead_media.id %}
{% elif blog.lead_media.type == "image" %}
    <img src="{% get_image_url_from_size blog.lead_media.id "1220x763" "1220x762" "orig_c"|safe %}" alt="">
    {% if blog.lead_media.caption or blog.lead_media.credit %}
    <figcaption>
        {% if blog.lead_media.caption %}
            {{blog.lead_media.caption}}
        {% endif %}
        {% if blog.lead_media.credit %}
            {{blog.lead_media.credit}}
        {% endif %}
    </figcaption>
    {% endif %}
{% endif %}

{% get_video blog.video.id %}

{% if blog.entry %}{{ blog.entry | show_short_code | safe }}{% endif %}

```

#CHANGELOG

##v0.3.5

- Fix for issue: https://github.com/oxfamamerica/django-media-explorer/issues/5
- Fix for issue: https://github.com/oxfamamerica/django-media-explorer/issues/6
- Introduced DME_INCLUDE_JQUERY setting to fix issue #6 above. Set it to False if you are using your own version of JQuery and you do not want DME's version to conflict with yours.
- You can now use DME custom model field MediaImageField. The MediaField saves the image/video, caption and credits information into a JSON field. What if you already use Django's FileField/ImageField but you want your image to be listed in DME and you do not want to refactor your code so the ImageField is changed to A JSON field. For this use case you can replace your Django FileField/ImageField with DME's MediaImageField. 

##v0.3.4

Fix for issue: https://github.com/oxfamamerica/django-media-explorer/issues/4

##v0.3.3

Fix for issue: https://github.com/oxfamamerica/django-media-explorer/issues/3

##v0.3.2

- Documentation updated to include new example app that can be used to demo DME.

##v0.3.1

- The micawber module failed to the test for the latest version of Django (1.9.1) and the problem has to do with django.utils.importlib (used by micawber) being removed from Django 1.9+ - so support for Django 1.9 has been temporaily removed.

##v0.3.0

- You can now use DME custom model fields (MediaField and RichTextField) in your models.
- You could previously only use one media field on a page - now you can have as many media fields as you want.
- When you select an image to insert into a richtext field, via the admin page, a list of the current image sizes are listed - so you no longer have to guess which size is available.

##v0.2.0
You can now use DME with Django 1.7+

[Documentation](https://github.com/oxfamamerica/django-media-explorer/blob/master/README_v0.2.md)

##v0.1.0
[Documentation](https://github.com/oxfamamerica/django-media-explorer/blob/master/README_v0.1.md)

#TODO
- Add capability to save to AWS S3/Azzure etc.
- Upgrade to latest Django version (Currently works on 1.7+ and 1.8+) - Add support for 1.9+
- ~~Simplify form setup by implementing DME as Django fields.~~
- Make it possible to resize images dynamically the first time they are accessed in a templatetag.


#Contributing

Report a bug or request a feature by opening an issue here:
https://github.com/oxfamamerica/django-media-explorer/issues


You can contribute to the project by coding bug fixes and adding features. To do so first fork the project, add your code to the "develop" branch of your fork and then submit a pull request. Remember to add your name in your forked version of the AUTHORS file. Your name will show in the [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) list if your code gets pulled in.

#Credits

Thank you to all the code [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) and to the Oxfam America Creative, Content and Web teams for donating the initial code, assets, testing and fixing bugs.
 
