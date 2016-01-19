# Django Media Explorer v0.3.0

A Django application to manage your images, video links, embeds and create slideshows.

**Table of Contents**

- [Installation](#installation)
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

NOTE 2: DME is dependant on Pillow and Pillow in turn has some platform dependencies. For instance if you are on Centos then you may need to run these commands before you install.

```
sudo yum install "Development Tools"
sudo yum install python-devel
sudo yum install libjpeg-devel
sudo yum install zlib-devel
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
    ("^ckeditor/", include("ckeditor.urls")),
    ("^", include("media_explorer.urls")),
```

Copy and paste this code into the bottom of your setting.py file.

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

You can now add media to your blogs by adding the MediaField and RichTextField fields.

```
from django.db import models
from media_explorer.fields import MediaField, RichTextField

class Blog(models.Model):
    """
    Example Blog model
    """

    title = models.CharField(max_length=150)

    #If you do not provide a type then 
    #lead media can take image/video/gallery
    lead_media = MediaField()

    #Provide a specific type if you want to 
    video = MediaField(type="video")

    #Entry is changed from TextField to RichTextField
    #You will see a CKEditor WYSIWYG with DME plugin
    entry = RichTextField()
```

NOTE: You still cannot have many RichText fields on a page - you can still only have one RichText field.


##Template tags

After you implement it in your apps you can display the media in your templates by using the following templatetags.

```
{% get_video element_id %}
```

```
{% get_media_gallery element_id %}
```

```
{% get_image_url_from_size element_id element_typ "1220x763" "orig_c"|safe %}
```

```
{% if story.content %}{{ story.content | show_short_code | safe }}{% endif %}
```



#CHANGELOG

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
- ~~Upgrade to latest Django version~~
- ~~Simplify form setup by implementing DME as Django fields.~~
- Make it possible to resize images dynamically the first time they are accessed in a templatetag.


#Contributing

Report a bug or request a feature by opening an issue here:
https://github.com/oxfamamerica/django-media-explorer/issues


You can contribute to the project by coding bug fixes and adding features. To do so first fork the project, add your code to the "develop" branch of your fork and then submit a pull request. Remember to add your name in your forked version of the AUTHORS file. Your name will show in the [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) list if your code gets pulled in.

#Credits

Thank you to all the code [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) and to the Oxfam America Creative, Content and Web teams for donating the initial code, assets, testing and fixing bugs.
 
