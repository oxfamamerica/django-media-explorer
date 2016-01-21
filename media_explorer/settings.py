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


