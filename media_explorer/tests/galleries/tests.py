from __future__ import unicode_literals
import os
from django.test import TestCase, Client, override_settings
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from media_explorer.models import Element, Gallery, GalleryElement

class GalleryTests(TestCase):

    def setUp(self):
        #Create test users
        User.objects.create_user("testuser",password="password")
        User.objects.create_superuser("admin","admin@example.com","password")

    def test_gallery_post_while_user_is_logged_out(self):
        """
        Test post while user is logged out
        Condition: User is logged out
        Result: Fail with 403 error since user is not authenticated
        """
        url = reverse("api-media-galleries")
        c = Client()
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 403)

    def test_gallery_post_while_user_is_not_authorized(self):
        """
        Test post while user is not authorized
        Condition: User is logged in but not authorized
        Result: Fail with 403 error since user is not staff
        """
        url = reverse("api-media-galleries")
        c = Client()
        c.login(username="testuser",password="password")
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 403)


    def test_gallery_post_with_no_data(self):
        """
        Test post with data
        Condition: User is logged in and authorized
        Condition: Post has no data
        Result: Fail with 400 error since at least name is required
        """
        url = reverse("api-media-galleries")
        c = Client()
        c.login(username="admin",password="password")
        response = c.post(url, {},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 400)

    def test_gallery_post_with_at_least_name_provided(self):
        """
        Test post with data
        Condition: User is logged in and authorized
        Condition: Post has only name field
        Result: Success
        """
        url = reverse("api-media-galleries")
        c = Client()
        c.login(username="admin",password="password")
        response = c.post(
            url, 
            {'name':'test_post_with_at_least_name'},
            HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

    @override_settings(DME_RESIZE=False)
    def test_add_image_with_credit_and_video_during_gallery_creation(self):
        """
        Test image upload with no resize
        Condition: User is logged in and authorized
        Condition: Post has an image
        Condition: Do not resize image
        Result: Success
        Result: GalleryElement count should be equal 2
        Result: GalleryElement is associated with correct gallery, image and video elements
        Result: GalleryElement image has the correct credit
        """
        url = reverse("api-media-elements")
        c = Client()
        c.login(username="admin",password="password")

        test_path = os.path.dirname(os.path.abspath(__file__))

        #Add an image element
        with open(test_path + '/../elements/Oxfam-Cambodia.jpg') as fp:
            response = c.post(url, {'name':'test_add_image_with_credit_and_video_during_gallery_creation-image','image':fp},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        image = Element.objects.get(type="image",name="test_add_image_with_credit_and_video_during_gallery_creation-image",image_url__icontains="Oxfam-Cambodia")

        #Add a video element
        response = c.post(url, {'name':'test_add_image_with_credit_and_video_during_gallery_creation-video','video_url':'https://www.youtube.com/watch?v=nBupSKjSQM0'},HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        video = Element.objects.get(type="video",name="test_add_image_with_credit_and_video_during_gallery_creation-video",video_embed__isnull=False)

        #Add a gallery with the image and video created 
        url = reverse("api-media-galleries")
        params = {}
        params["name"] = "test_add_image_with_credit_and_video_during_gallery_creation-gallery"
        params["element_id"] = [image.id,video.id]
        #Note element_credit, element_description should be in same order as element_id
        params["element_credit"] = ["Image by Oxfam"]
        #Note we are not even going to provide a list of element_description
        #params["element_description"] = []

        response = c.post(url, params,HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, 200)

        count1 = Gallery.objects.filter(name="test_add_image_with_credit_and_video_during_gallery_creation-gallery").count()
        self.assertEqual(count1, 1)

        gallery = Gallery.objects.get(name="test_add_image_with_credit_and_video_during_gallery_creation-gallery")

        count2 = GalleryElement.objects.count()
        self.assertEqual(count2, 2)

        for ge in GalleryElement.objects.all():
            self.assertEqual(ge.gallery, gallery)
            if ge.element.id == image.id:
                self.assertEqual(ge.element, image)
                self.assertEqual(ge.credit, "Image by Oxfam")
            if ge.element.id == video.id:
                self.assertEqual(ge.element, video)



