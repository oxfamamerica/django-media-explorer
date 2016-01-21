from __future__ import unicode_literals
import os
from django.test import TestCase, Client, override_settings
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from media_explorer.models import Element, ResizedImage

class ElementTests(TestCase):

    def setUp(self):
        #Create test users
        User.objects.create_user("testuser",password="password")
        User.objects.create_superuser("admin","admin@example.com","password")

    def test_element_post_while_user_is_logged_out(self):
        """
        Test post while user is logged out
        Condition: User is logged out
        Result: Fail with 403 error since user is not authenticated
        """
        url = reverse("api-media-elements")
        c = Client()
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 403)

    def test_element_post_while_user_is_not_authorized(self):
        """
        Test post while user is not authorized
        Condition: User is logged in but not authorized
        Result: Fail with 403 error since user is not staff
        """
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="testuser",password="password")
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 403)


    def test_element_post_with_no_image_or_video(self):
        """
        Test post with no image file or video url
        Condition: User is logged in and authorized
        Condition: Post has no image file or video url
        Result: Fail with 400 error since no image or video_url is provided
        """
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="admin",password="password")
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 400)

    @override_settings(DME_RESIZE=False)
    def test_image_upload_with_no_resize(self):
        """
        Test image upload with no resize
        Condition: User is logged in and authorized
        Condition: Post has an image
        Condition: Do not resize image
        Result: Success
        Result: Element count should equal 1
        Result: ResizedImage count should equal 0
        """
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="admin",password="password")

        test_path = os.path.dirname(os.path.abspath(__file__))
        with open(test_path + '/Oxfam-Cambodia.jpg') as fp:
            response = c.post(url, {'name':'test_image_upload_with_no_resize','image':fp},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        #Check the DB to make sure element is present
        count1 = Element.objects.filter(type="image",name="test_image_upload_with_no_resize",image_url__icontains="Oxfam-Cambodia").count()
        self.assertEqual(count1, 1)

        #Check to make sure image was NOT resized
        count2 = ResizedImage.objects.filter(image__type="image",image__name="test_image_upload_with_no_resize",image__image_url__icontains="Oxfam-Cambodia").count()
        self.assertEqual(count2, 0)

    @override_settings(DME_RESIZE=True)
    def test_image_upload_with_resize(self):
        """
        Test image upload with resize
        Condition: User is logged in and authorized
        Condition: Post has an image
        Condition: Resize image
        Result: Success
        Result: Element count should equal 1
        Result: ResizedImage count should be more than 0
        """
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="admin",password="password")

        test_path = os.path.dirname(os.path.abspath(__file__))
        with open(test_path + '/Oxfam-Cambodia.jpg') as fp:
            response = c.post(url, {'name':'test_image_upload_with_resize','image':fp},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        #Check the DB to make sure element is present
        count1 = Element.objects.filter(type="image",name="test_image_upload_with_resize",image_url__icontains="Oxfam-Cambodia").count()
        self.assertEqual(count1, 1)

        #Check to make sure image was NOT resized
        count2 = ResizedImage.objects.filter(image__type="image",image__name="test_image_upload_with_resize",image__image_url__icontains="Oxfam-Cambodia").count()
        self.assertTrue(count2>0)


    def test_youtube_video_addition(self):
        """
        Test Youtube video addition
        Condition: User is logged in and authorized
        Condition: Post has a video url
        Result: Success
        Result: Element count (with non-empty video_embed) should equal 1
        """
        url = reverse("api-media-elements")

        c = Client()
        c.login(username="admin",password="password")

        response = c.post(url, {'name':'test_youtube_video_addition','video_url':'https://www.youtube.com/watch?v=nBupSKjSQM0'},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        #Check the DB to make sure element is present
        count = Element.objects.filter(type="video",name="test_youtube_video_addition",video_embed__isnull=False).count()
        self.assertEqual(count, 1)
