# Django Media Explorer

A Django application to manage your images, video/multimedia links and embeds and create slideshows.

**Table of Contents**

- [Dependencies](#dependencies)
- [Installation](#installation)
- [TODO](#todo)
    
#Dependencies

This version is strictly limited to Django 1.6.11 and below.

#Installation

Run these commands:
- **[SSH Terminal]** pip install django-media-explorer

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

#Adding lead media (EXAMPLE 1)

For this example we want to show a lead image, lead video or a lead media gallery on our existing blog/article etc. (The term 'lead' means it's the first thing shown on the page).

##The Model

We will assume that you have a model called **MyBlog**

Add these fields to your model.

```
    LEAD_MEDIA_CHOICES = (('none','No lead'),('image','Image'),('video','Video'),('gallery','Gallery'))

    lead_media_type = models.CharField(null=True,blank=True,max_length=25,choices=LEAD_MEDIA_CHOICES,default="none")
    lead_media_id = models.IntegerField(blank=True,null=True)
    lead_media_caption = models.CharField(blank=True,null=True,max_length=255)
    lead_media_credit = models.CharField(blank=True,null=True,max_length=255)

```

#TODO
- Add capability to save to AWS S3/Azzure etc.
- Upgrade to latest Django version

