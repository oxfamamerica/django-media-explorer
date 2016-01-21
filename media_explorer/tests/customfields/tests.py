from __future__ import unicode_literals
import os
from django.contrib.auth.models import User
from django.db import connection
from django.core.urlresolvers import reverse
from django.test import TestCase, Client, modify_settings, override_settings
from django.core.management import call_command 
from media_explorer.models import Element, Gallery
from media_explorer.fields import MediaField, RichTextField
from django.core.exceptions import ValidationError

@modify_settings(INSTALLED_APPS={
    'append': 'media_explorer.tests.customfields',
})
class CustomFieldTests(TestCase):

    def setUp(self):
        #Create test users
        User.objects.create_user("testuser",password="password")
        User.objects.create_superuser("admin","admin@example.com","password")

    def test_media_field_type(self):
        f = MediaField()
        self.assertEqual(f.db_parameters(connection)['type'], 'text')

    @override_settings(DME_RESIZE=False)
    def test_mediafield_assign_image_to_video_field(self):
        """
        Test image assignment to MediaField with type=video
        Condition: Authorized user tries to assign image to video field
        Result: Model returns a validation error
        """
        from media_explorer.tests.customfields.models import Example

        #Upload an image
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="admin",password="password")

        test_path = os.path.dirname(os.path.abspath(__file__))
        with open(test_path + '/../elements/Oxfam-Cambodia.jpg') as fp:
            response = c.post(url, {'name':'test_mediafield_assign_image_to_video_field','image':fp},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        #Get the image we just uploaded
        image = Element.objects.get(type="image",name="test_mediafield_assign_image_to_video_field",image_url__icontains="Oxfam-Cambodia")

        #Now create Example object and assign image to video
        #NOTE: Do not save because the table is not created in test db
        error_message = ""
        example = Example()
        example.video = image
        try:
            example.clean_fields()
        except ValidationError as e:
            error_message = e.message_dict["video"][0]

        self.assertTrue("Invalid media type" in error_message)


    def test_mediafield_assign_video_to_image_field(self):
        """
        Test video assignment to MediaField with type=image
        Condition: Authorized user tries to assign video to image field
        Result: Model returns a validation error
        """
        from media_explorer.tests.customfields.models import Example

        #Save a video
        url = reverse("api-media-elements")

        c = Client()
        c.login(username="admin",password="password")

        response = c.post(url, {'name':'test_mediafield_assign_image_to_video_field','video_url':'https://www.youtube.com/watch?v=nBupSKjSQM0'},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        #Check the DB to make sure element is present
        video = Element.objects.get(type="video",name="test_mediafield_assign_image_to_video_field",video_embed__isnull=False)

        #Now create Example object and assign video to image
        #NOTE: Do not save because the table is not created in test db
        error_message = ""
        example = Example()
        example.image = video
        try:
            example.clean_fields()
        except ValidationError as e:
            error_message = e.message_dict["image"][0]

        self.assertTrue("Invalid media type" in error_message)

