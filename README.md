# Django Media Explorer

A Django application to manage your images, video links, embeds and create slideshows.

**Table of Contents**

- [Dependencies](#dependencies)
- [Installation](#installation)
- [How it works](#how-it-works)
- [Demo](#demo)
- [Contributing](#contributing)
    
#Dependencies

This version is strictly limited to Django 1.6.11 and below.

#Installation

Run this command:

```
pip install django-media-explorer
```

NOTE: If you do not use the above method to install this application then you will need to install these additional dependencies.

```
pip install micawber==0.3.2
pip install djangorestframework==2.4.4
pip install Pillow==2.6.1
pip install django-ckeditor==4.4.8
```

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

Run the syncdb command to create all the database tables.

```
python manage.py syncdb
```

Create a file in the same folder as your **settings.py** file and name it **media_explorer_settings.py** and then copy and paste the following code into **media_explorer_settings.py**.

```

import os

# Comment this if you have already set it
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Comment this if you have already set it
STATIC_URL = "/static/"

# Comment this if you have already set it
STATIC_ROOT = os.path.join(PROJECT_ROOT, STATIC_URL.strip("/"))

# Comment this if you have already set it
MEDIA_URL = STATIC_URL + "media/"

# Comment this if you have already set it
MEDIA_ROOT = os.path.join(PROJECT_ROOT, *MEDIA_URL.strip("/").split("/"))

DME_RESIZE = True

DME_VIDEO_THUMBNAIL_DEFAULT_URL = "/static/img/default_video.gif"
DME_GALLERY_THUMBNAIL_DEFAULT_URL = "/static/img/default_gallery.gif"

#This will be appended to settings.MEDIA_URL
DME_RESIZE_DIRECTORY = "resized"

DME_RESIZE_HORIZONTAL_ASPECT_RATIO = "8:5"
DME_RESIZE_VERTICAL_ASPECT_RATIO = "320:414"

DME_RESIZE_WIDTHS = {
    "horizontal": [2440,1220,840,800,610,420,160],
    "vertical": [556,320,278,160],
    "non_cropped": [2440,1220,610,160],
    "retina_2x": [1220,610,420,278,160],
    "thumbnail": 200,
}

DME_PAGE_SIZE = 50

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ],
    'DATETIME_FORMAT': "%Y-%m-%d %T",
}

CKEDITOR_JQUERY_URL = "http://code.jquery.com/jquery-1.11.2.min.js"

CKEDITOR_UPLOAD_PATH = "uploads/"

CKEDITOR_CONFIGS = {
    'default': {
        'extraPlugins': 'media_explorer',
        'toolbar': 'Custom',
        'toolbar_Custom': [
            ['Bold', 'Italic', 'Underline'],
            ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
            ['Link', 'Unlink'],
            ['RemoveFormat', 'Source'],
            ['MediaExplorer']
        ]
    }
}


```

Set **DME_RESIZE = False** if you do not want your images resized. 

Now import the **media_explorer_settings.py** file into your **settings.py** file by adding this to the bottom of your **settings.py** file.

```
try:
    from media_explorer_settings import *
except ImportError:
    pass
```

Add the following javascript includes to your admin/base.html file.

```
```

#How it works

Read the examples to see how you can implement it in your apps. 

https://github.com/oxfamamerica/media_explorer_example/

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
- Upgrade to latest Django version

#Contributing

Report a bug or request a feature by opening an issue here:
https://github.com/oxfamamerica/django-media-explorer/issues


You can contribute to the project by coding bug fixes and adding features. To do so first fork the project, add your code to your project and then submit a pull request.

