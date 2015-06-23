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

Run these commands:
pip install django-media-explorer

Add these to your INSTALLED_APPS settings

```
    'rest_framework',
    'media_explorer',
    'micawber.contrib.mcdjango',
```

Next add these settings. They are required by the Media Explorer.

```

TODO - GET THE RECENT SETTINGS

DME_RESIZE = True

#This will be appended to settings.MEDIA_URL
DME_RESIZE_DIRECTORY = "resized"

DME_VIDEO_THUMBNAIL_DEFAULT_URL = "http://placehold.it/800x500/ff8800/ffffff"
DME_GALLERY_THUMBNAIL_DEFAULT_URL = "http://placehold.it/800x500/ff8800/ffffff"

DME_RESIZE_HORIZONTAL_ASPECT_RATIO = "8:5"
DME_RESIZE_VERTICAL_ASPECT_RATIO = "320:414"

DME_RESIZE_WIDTHS = {
    "horizontal": [2440,1220,840,800,610,420,160],
    "vertical": [556,320,278,160],
    "non_cropped": [2440,1220,610,160],
    "retina_2x": [1220,610,420,278,160],
    "thumbnail": 200,
}

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ],
    'DATETIME_FORMAT': "%Y-%m-%d %T"
}

```

Set **DME_RESIZE = False** if you do not want your images resized. 

#How it works

Read the examples to see how it works. 

https://github.com/oxfamamerica/media_explorer_example/

#Demo

Go to http://demos.oxfamamerica.org for a demo on this application.

#TODO
- Add capability to save to AWS S3/Azzure etc.
- Upgrade to latest Django version

#Contributing

Report a bug or request a feature by opening an issue here:
https://github.com/oxfamamerica/django-media-explorer/issues


You can contribute to the project by coding bug fixes and adding features. To do so first fork the project, add your code to your project and then submit a pull request.

