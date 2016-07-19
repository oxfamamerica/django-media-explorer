import os
from django.db import models
import traceback
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.db.models import signals
from django.conf import settings

def __get_s3_url(url):
    s3_url = "https://s3.amazonaws.com/"
    s3_url += settings.BOTO_S3_BUCKET
    s3_url += url
    return s3_url

def __file_is_remote(url):
    if url.startswith("https:") or url.startswith("http:"):
        return True
    return False

def __upload_element_to_s3(instance):

    if not settings.DME_UPLOAD_TO_S3:
        return instance

    #If S3 upload is set and image is local then upload to S3 then delete local
    saved_to_s3 = False
    if instance.local_path and not __file_is_remote(instance.image_url):
        try:
            from boto3 import client as boto3Client
            from boto3.s3.transfer import S3Transfer
            client = boto3Client(
                    's3', 
                    settings.DME_S3_REGION,
                    aws_access_key_id=settings.DME_S3_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.DME_S3_SECRET_ACCESS_KEY
                    )
            transfer = S3Transfer(client)
            # Upload /tmp/myfile to s3://bucket/key
            s3_key = instance.local_path.lstrip("/")
            if settings.DME_S3_FOLDER:
                s3_key = settings.DME_S3_FOLDER.strip("/")
                s3_key += "/"
                s3_key += instance.local_path.lstrip("/")

            transfer.upload_file(
                    str(settings.PROJECT_ROOT + instance.local_path),
                    settings.DME_S3_BUCKET,
                    s3_key
                    )

            saved_to_s3 = True
            s3_url = __get_s3_url(instance.local_path)

            instance.s3_path = instance.local_path
            instance.s3_bucket = settings.DME_S3_BUCKET
            instance.image_url = s3_url
            instance.save()
        except Exception as e:
            print traceback.format_exc()

    #If S3 upload is set and thumbnail image is local then upload to S3 then delete local
    thumbnail_saved_to_s3 = False
    if instance.thumbnail_local_path and not __file_is_remote(instance.thumbnail_image_url):
        try:
            from boto3 import client as boto3Client
            from boto3.s3.transfer import S3Transfer
            client = boto3Client(
                    's3', 
                    settings.DME_S3_REGION,
                    aws_access_key_id=settings.DME_S3_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.DME_S3_SECRET_ACCESS_KEY
                    )
            transfer = S3Transfer(client)
            # Upload /tmp/myfile to s3://bucket/key
            s3_key = instance.thumbnail_local_path.lstrip("/")
            if settings.DME_S3_FOLDER:
                s3_key = settings.DME_S3_FOLDER.strip("/")
                s3_key += "/"
                s3_key += instance.thumbnail_local_path.lstrip("/")

            transfer.upload_file(
                    str(settings.PROJECT_ROOT + instance.thumbnail_local_path),
                    settings.DME_S3_BUCKET,
                    s3_key
                    )

            saved_to_s3 = True
            s3_url = __get_s3_url(instance.thumbnail_local_path)

            instance.thumbnail_s3_path = instance.thumbnail_local_path
            instance.thumbnail_s3_bucket = settings.DME_S3_BUCKET
            instance.thumbnail_image_url = s3_url
            instance.save()

        except Exception as e:
            print traceback.format_exc()


    if saved_to_s3:
        try:
            if os.path.isfile(settings.PROJECT_ROOT + instance.local_path):
                os.remove(settings.PROJECT_ROOT + instance.local_path)
                instance.image = s3_url
                instance.local_path = None
                instance.save()

        except:
            print traceback.format_exc()

    if thumbnail_saved_to_s3:
        try:
            if os.path.isfile(settings.PROJECT_ROOT + instance.thumbnail_local_path):
                os.remove(settings.PROJECT_ROOT + instance.thumbnail_local_path)
                instance.thumbnail_image = thumbnail_s3_url
                instance.thumbnail_local_path = None
                instance.save()

        except:
            print traceback.format_exc()

    return instance


class Element(models.Model):
    """
    The Element model will contain images and videos
    NOTE: if type=video you can still have a thumbnail_image
    """

    TYPE_CHOICES = (('image','Image'),('video','Video'))

    name = models.CharField(max_length=150,blank=True,null=True)
    file_name = models.CharField(max_length=150,blank=True,null=True)
    original_file_name = models.CharField(max_length=150,blank=True,null=True)
    credit = models.CharField(max_length=255,blank=True,null=True)
    description = models.TextField(blank=True,null=True)
    image = models.ImageField(blank=True,null=True,max_length=255,upload_to="images/")
    s3_bucket = models.CharField(max_length=255,blank=True,null=True)
    s3_path = models.CharField(max_length=255,blank=True,null=True)
    local_path = models.CharField(max_length=255,blank=True,null=True)
    image_url = models.CharField(max_length=255,blank=True,null=True)
    image_width = models.IntegerField(blank=True,null=True,default='0')
    image_height = models.IntegerField(blank=True,null=True,default='0')
    video_url = models.CharField(max_length=255,blank=True,null=True)
    video_embed = models.TextField(blank=True,null=True)
    manual_embed_code = models.BooleanField(_("Manually enter video embed code"), default=False)
    thumbnail_image = models.ImageField(blank=True,null=True,max_length=255,upload_to="images/")
    thumbnail_s3_bucket = models.CharField(max_length=255,blank=True,null=True)
    thumbnail_s3_path = models.CharField(max_length=255,blank=True,null=True)
    thumbnail_local_path = models.CharField(max_length=255,blank=True,null=True)
    thumbnail_image_url = models.CharField(max_length=255,blank=True,null=True)
    thumbnail_image_width = models.IntegerField(blank=True,null=True,default='0')
    thumbnail_image_height = models.IntegerField(blank=True,null=True,default='0')
    type = models.CharField(_("Type"), max_length=10, default="image",choices=TYPE_CHOICES)
    created_at = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    updated_at = models.DateTimeField(blank=True,null=True,auto_now=True)

    class Meta:
        verbose_name_plural = "Elements"

    def __unicode__(self):
        return u"%s" % (self.name)

    def save(self, *args, **kwargs):
        if not self.name:
            if self.type == "image":
                self.name = self.file_name
            elif self.type == "video":
                self.name = self.video_url
        super(Element, self).save(*args, **kwargs)


class Gallery(models.Model):
    """
    The Gallery model will contain info about our media gallery
    """

    name = models.CharField(max_length=100,blank=True,null=True)
    short_code = models.CharField(max_length=100,blank=True,null=True)
    description = models.TextField(blank=True,null=True)
    thumbnail_image = models.ImageField(blank=True,null=True,max_length=255,upload_to="images/")
    thumbnail_image_url = models.CharField(max_length=255,blank=True,null=True)
    elements = models.ManyToManyField(Element, through="GalleryElement")
    created_at = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    updated_at = models.DateTimeField(blank=True,null=True,auto_now=True)

    class Meta:
        verbose_name_plural = "Galleries"

    def __unicode__(self):
        return u"%s" % (self.name)

class GalleryElement(models.Model):
    """
    The Gallery Element model will contain list of elements
    """

    gallery = models.ForeignKey(Gallery)
    element = models.ForeignKey(Element)
    credit = models.CharField(max_length=255,blank=True,null=True)
    description = models.TextField(blank=True,null=True)
    sort_by = models.IntegerField(blank=True,null=True,default='0')
    created_at = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    updated_at = models.DateTimeField(blank=True,null=True,auto_now=True)

    class Meta:
        verbose_name = "Gallery element"
        verbose_name_plural = "Gallery elements"
        ordering = ["sort_by"]

class ResizedImage(models.Model):
    """
    The ResizedImage is a resized image version of Element.image
    """

    image = models.ForeignKey(Element)
    file_name = models.CharField(max_length=150,blank=True,null=True)
    size = models.CharField(max_length=25,blank=True,null=True)
    s3_bucket = models.CharField(max_length=255,blank=True,null=True)
    s3_path = models.CharField(max_length=255,blank=True,null=True)
    local_path = models.CharField(max_length=255,blank=True,null=True)
    image_url = models.CharField(max_length=255,blank=True,null=True)
    image_width = models.IntegerField(blank=True,null=True,default='0')
    image_height = models.IntegerField(blank=True,null=True,default='0')
    created_at = models.DateTimeField(blank=True,null=True,auto_now_add=True)
    updated_at = models.DateTimeField(blank=True,null=True,auto_now=True)

    class Meta:
        verbose_name = "Resized image"
        verbose_name_plural = "Resized images"

    def html_img(self):
        try:
            return "<a target='_blank' href='" + self.image_url + "'><img style='width:100px' src='" + self.image_url + "'></a>"
        except:
            pass

    html_img.allow_tags = True

def resizedimage_post_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem when corresponding `ResizedImage` object is deleted.
    """

    if settings.DME_DELETE_FROM_LOCAL:
        try:
            if instance.local_path:
                if os.path.isfile(settings.PROJECT_ROOT + instance.local_path):
                    os.remove(settings.PROJECT_ROOT + instance.local_path)
        except:
            print traceback.format_exc()

    if settings.DME_DELETE_FROM_S3:
        from boto.s3.connection import S3Connection
        try:
            aws_connection = S3Connection(
                    settings.AWS_ACCESS_KEY_ID, 
                    settings.AWS_SECRET_ACCESS_KEY
                )
            bucket = aws_connection.get_bucket(instance.s3_bucket)

            if instance.s3_path:
                bucket.delete_key(instance.s3_path)
        except:
            print traceback.format_exc()


def element_pre_delete(sender, instance, **kwargs):
    """
    Deletes ResizedImages before it is deleted
    """
    
    for ri in ResizedImage.objects.filter(image=instance):
        try:
            ri.delete()
        except:
            print traceback.format_exc()

def element_post_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem when corresponding `Element` object is deleted.
    """

    if settings.DME_DELETE_FROM_LOCAL:
        try:
            if instance.local_path:
                if os.path.isfile(settings.PROJECT_ROOT + instance.local_path):
                    os.remove(settings.PROJECT_ROOT + instance.local_path)
        except:
            print traceback.format_exc()

        try:
            if instance.thumbnail_local_path:
                if os.path.isfile(settings.PROJECT_ROOT + instance.thumbnail_local_path):
                    os.remove(settings.PROJECT_ROOT + instance.thumbnail_local_path)
        except:
            print traceback.format_exc()

    if settings.DME_DELETE_FROM_S3:
        from boto.s3.connection import S3Connection
        try:
            aws_connection = S3Connection(
                    settings.AWS_ACCESS_KEY_ID, 
                    settings.AWS_SECRET_ACCESS_KEY
                )
            bucket = aws_connection.get_bucket(instance.s3_bucket)

            if instance.s3_path:
                try:
                    bucket.delete_key(instance.s3_path)
                except:
                    print traceback.format_exc()

            if instance.thumbnail_s3_path:
                try:
                    bucket.delete_key(instance.thumbnail_s3_path)
                except:
                    print traceback.format_exc()

        except:
            print traceback.format_exc()

    try:
        #Check to see if this thumbanil is used by gallery - if so resave the gallery to reset thumbnail
        for gallery in Gallery.objects.filter(thumbnail_image_url=instance.thumbnail_image_url):
            gallery.save()
    except:
        print traceback.format_exc()
 

def gallery_post_save(sender, instance, created, **kwargs):
    #Disconnect signal here so we don't recurse when we save
    signals.post_save.disconnect(gallery_post_save, sender=Gallery)

    #Grap the thumbnail URL from the first element - or use the default
    has_thumbnail = False
    try:
        #Get the first element and set the thumbnail
        if GalleryElement.objects.filter(gallery=instance).exists():
            ge = GalleryElement.objects.filter(gallery=instance).order_by("sort_by")[0]
            if ge.element.thumbnail_image_url:
                has_thumbnail = True
                instance.thumbnail_image_url = ge.element.thumbnail_image_url
                instance.save()
    except:
        print traceback.format_exc()

    if not has_thumbnail:
        instance.thumbnail_image_url = settings.DME_GALLERY_THUMBNAIL_DEFAULT_URL
        instance.save()

    #Reconnect signal
    signals.post_save.connect(gallery_post_save, sender=Gallery)

def element_post_save(sender, instance, created, **kwargs):

    #Disconnect signal here so we don't recurse when we save
    signals.post_save.disconnect(element_post_save, sender=Element)

    if instance.video_url or instance.video_embed:
        instance.type = "video"

    if instance.image and not __file_is_remote(instance.image.url):
        instance.image_url = instance.image.url
        instance.local_path = instance.image.url
      	instance.file_name = os.path.basename(str(instance.image_url))
      	if not instance.name:
            instance.name = instance.file_name

        instance.thumbnail_image = instance.image

    if instance.thumbnail_image and not __file_is_remote(instance.thumbnail_image.url):
        instance.thumbnail_image_url = instance.thumbnail_image.url
        instance.thumbnail_local_path = instance.thumbnail_image.url

    instance.save()

    if instance.video_url:
        try:
            import micawber
            providers = micawber.bootstrap_basic()
            oembed = providers.request(instance.video_url)
            if "html" in oembed:
                instance.video_embed = oembed["html"]

                if not instance.thumbnail_image:
                    if "thumbnail_url" in oembed:
                        instance.thumbnail_image_url = oembed["thumbnail_url"]
                    if "thumbnail_width" in oembed:
                        instance.thumbnail_image_height = oembed["thumbnail_width"]
                    if "thumbnail_height" in oembed:
                        instance.thumbnail_image_height = oembed["thumbnail_height"]
                
        except Exception as e:
            print traceback.format_exc()

    #Process images and thumbnails
    try:
        if instance.image and instance.file_name != instance.original_file_name:
            instance.original_file_name = instance.file_name
            instance.save()

            from .helpers import ImageHelper
            helper = ImageHelper()
            rtn = helper.resize(instance)
            if rtn["success"]: 
                if rtn["thumbnail_image_url"]:
                    instance.thumbnail_image = None
                    instance.thumbnail_image_url = rtn["thumbnail_image_url"]
                    if not __file_is_remote(instance.thumbnail_image_url):
                        instance.thumbnail_local_path = instance.thumbnail_image_url
                    instance.save()

                #Now go through ResizedImages and delete local files
                for r in ResizedImage.objects.filter(image=instance):
                    if r.local_path and __file_is_remote(r.image_url) \
                            and not Element.objects.filter(local_path=r.local_path).exists() \
                            and not Element.objects.filter(thumbnail_local_path=r.local_path).exists():
                        try:
                            if os.path.isfile(settings.PROJECT_ROOT + r.local_path):
                                os.remove(settings.PROJECT_ROOT + r.local_path)

                                r.local_path = None
                                r.save()

                        except:
                            print traceback.format_exc()


                #Now upload Element to S3
                instance = __upload_element_to_s3(instance)

            else:
                print rtn["message"]
    except Exception as e:
        print traceback.format_exc()

    #If there is still no thumbnail image then use the default
    if instance.type == "video" and not instance.thumbnail_image_url:
        instance.thumbnail_image_url = settings.DME_VIDEO_THUMBNAIL_DEFAULT_URL

    instance.save()

    #If S3 upload is set and image is local then upload to S3 then delete local
    if instance.image and settings.DME_UPLOAD_TO_S3 \
            and not settings.DME_RESIZE:
        instance = __upload_element_to_s3(instance)

    #Reconnect signal
    signals.post_save.connect(element_post_save, sender=Element)

def resizedimage_post_save(sender, instance, created, **kwargs):

    #Disconnect signal here so we don't recurse when we save
    signals.post_save.disconnect(resizedimage_post_save, sender=ResizedImage)

    #Set local path
    if instance.image_url and not __file_is_remote(instance.image_url):
        instance.local_path = instance.image_url
        instance.save()

    #If S3 upload is set and image is local then upload to S3 then delete local
    saved_to_s3 = False
    if instance.image_url and settings.DME_UPLOAD_TO_S3 \
            and not __file_is_remote(instance.image_url):
        try:
            from boto3 import client as boto3Client
            from boto3.s3.transfer import S3Transfer
            client = boto3Client(
                    's3', 
                    settings.DME_S3_REGION,
                    aws_access_key_id=settings.DME_S3_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.DME_S3_SECRET_ACCESS_KEY
                    )
            transfer = S3Transfer(client)
            s3_key = instance.image_url.lstrip("/")
            if settings.DME_S3_FOLDER:
                s3_key = settings.DME_S3_FOLDER.strip("/")
                s3_key += "/"
                s3_key += instance.image_url.lstrip("/")

            transfer.upload_file(
                    str(settings.PROJECT_ROOT + instance.image_url),
                    settings.DME_S3_BUCKET,
                    s3_key
                    )

            saved_to_s3 = True
            s3_url = __get_s3_url(instance.image_url)

            instance.s3_path = instance.image_url
            instance.s3_bucket = settings.DME_S3_BUCKET
            instance.image_url = s3_url
            #instance.local_path = None
            instance.save()

            #TODO - delete from resizedimage

        except Exception as e:
            print traceback.format_exc()

    if saved_to_s3:
        try:
            if os.path.isfile(settings.PROJECT_ROOT + instance.local_path):
                os.remove(settings.PROJECT_ROOT + instance.local_path)
                instance.local_path = None
                instance.save()
        except:
            print traceback.format_exc()

    #Reconnect signal
    signals.post_save.connect(resizedimage_post_save, sender=ResizedImage)

signals.post_save.connect(element_post_save, sender=Element)
signals.post_save.connect(gallery_post_save, sender=Gallery)
signals.pre_delete.connect(element_pre_delete, sender=Element)
signals.post_delete.connect(element_post_delete, sender=Element)
signals.post_delete.connect(resizedimage_post_delete, sender=ResizedImage)
signals.post_save.connect(resizedimage_post_save, sender=ResizedImage)
