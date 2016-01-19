# Django Media Explorer v0.3.0

A Django application to manage your images, video links, embeds and create slideshows.

**Table of Contents**

- [Installation](#installation)
- [How it works](#how-it-works)
- [Demo](#demo)
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

NOTE 2: Pillow has some platform requirements. For instance if you are on Centos then run these commands before you install.

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


#How it works

Read the examples to see how you can implement it in your apps. 


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

#Demo

Go to http://demos.oxfamamerica.org for a demo on this application.

#TODO
- Add capability to save to AWS S3/Azzure etc.
- ~~Upgrade to latest Django version~~
- ~~Simplify form setup by implementing DME as Django fields.~~
- Make it possible to resize images dynamically the first time they are accessed in a templatetag.

#CHANGELOG

##v0.3.0

- You can now use DME custom model fields (MediaField and RichTextField) in your models.

##v0.2.0
You can now use DME with Django 1.7+

[Documentation](https://github.com/oxfamamerica/django-media-explorer/blob/master/README_v0.2.md)

##v0.1.0
[Documentation](https://github.com/oxfamamerica/django-media-explorer/blob/master/README_v0.1.md)

#Contributing

Report a bug or request a feature by opening an issue here:
https://github.com/oxfamamerica/django-media-explorer/issues


You can contribute to the project by coding bug fixes and adding features. To do so first fork the project, add your code to the "develop" branch of your fork and then submit a pull request. Remember to add your name in your forked version of the AUTHORS file. Your name will show in the [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) list if your code gets pulled in.

#Credits

Thank you to all the code [authors](https://github.com/oxfamamerica/django-media-explorer/blob/master/AUTHORS) and to the Oxfam America Creative, Content and Web teams for donating the initial code, assets, testing and fixing bugs.
 
