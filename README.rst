Django Media Explorer
=====================

A Django application to manage your images, video links, embeds and
create slideshows.

**Table of Contents**

-  `Dependencies`_
-  `Installation`_
-  `How it works`_
-  `Demo`_
-  `Contributing`_

Dependencies
============

This version is strictly limited to Django 1.6.11 and below.

Installation
============

Run this command:

::

    pip install django-media-explorer

NOTE: If you do not use the above method to install this application
then you will need to install these additional dependencies.

::

    pip install micawber==0.3.2
    pip install djangorestframework==2.4.4
    pip install Pillow==2.6.1
    pip install django-ckeditor==4.4.8

Add these to your INSTALLED\_APPS settings

::

        'rest_framework',
        'micawber.contrib.mcdjango',
        'media_explorer',
        'ckeditor',

Add these to your urls.py

::

        ("^ckeditor/", include("ckeditor.urls")),
        ("^", include("media_explorer.urls")),

Run the syncdb command to create all the database tables.

::

    python manage.py syncdb

Create a file in the same folder as your **settings.py** file and name
it **media\_explorer\_settings.py** and then copy and paste the
following code into **media\_explorer\_settings.py**.

\`\`\`

import os

Comment this if you have already set it
=======================================

PROJECT\_ROOT = os.path.dirname(os.path.abspath(\ **file**))

Comment this if you have already set it
=======================================

STATIC\_URL = ./static/.

Comment this if you have already set it
=======================================

STATIC\_ROOT = os.path.join(PROJECT\_ROOT, STATIC\_URL.strip(./.))

Comment this if you have already set it
=======================================

MEDIA\_URL = STATIC\_URL + .media/.

Comment this if you have already set it
=======================================

MEDIA\_ROOT = os.path.join(PROJECT\_ROOT,
\*MEDIA\_URL.strip(./.).split(./.))

DME\_RESIZE = True

DME\_VIDEO\_THUMBNAIL\_DEFAULT\_URL = ./static/img/default\_video.gif.
DME\_GALLERY\_THUMBNAIL\_DEFAULT\_URL =
./static/img/default\_gallery.gif.

This will be appended to settings.MEDIA\_URL
============================================

DME\_RESIZE\_DIRECTORY = .resized.

DME\_RESIZE\_HORIZONTAL\_ASPECT\_RATIO = .8:5.
DME\_RESIZE\_VERTICAL\_ASPECT\_RATIO = .320:414.

DME\_RESIZE\_WIDTHS = { .horizontal.: [2440,1220,840,800,610,420,160],
.vertical.: [556,320,278,160], .non\_cropped.: [2440,1220,610,160],
.retina\_2x.: [1220,610,420,278,160], .thumbnail.: 200, }

DME\_PAGE\_SIZE = 50

REST\_FRAMEWORK = { # Use Django.s standard ``django.contrib.auth``
permissions, # or allow read-only access for unauthenticated users.
.DEFAULT\_PERMISSION\_CLASSES.: [
.rest\_framework.permissions.DjangoModelPermissionsOrAnonReadOnly., ],
.DATETIME\_FORMAT.: .%Y-%m-%d %T., }

CKEDITOR\_JQUERY\_URL = .http://code.jquery.com/jquery-1.11.2.min.js.

CKEDITOR\_UPLOAD\_PATH = .uploads/.

CKEDITOR\_CONFIGS = { .default.: { .extraPlugins.: .media\_explorer.,
.toolbar.: .Custom., .toolbar\_Custom.: [ [.Bold., .Italic.,
.Underline.], [.NumberedList., .BulletedList., .-., .Outdent., .Indent.,
.-., .JustifyLeft., .JustifyCenter., .Justify

.. _Dependencies: #dependencies
.. _Installation: #installation
.. _How it works: #how-it-works
.. _Demo: #demo
