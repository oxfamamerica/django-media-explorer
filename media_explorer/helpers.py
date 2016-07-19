import os, re, traceback, mimetypes
from django.conf import settings
try:
    #For Django version 1.8.13 and below
    from django.db.models import get_model
except ImportError:
    #For Django version 1.9 and above
    from django.apps import apps
    get_model = apps.get_model

try:
	from PIL import Image, ImageOps
except ImportError:
	import Image
	import ImageOps


class S3Helper(object):
    """S3 helper functions"""
    def get_s3_headers(self, url, public=True):
        headers = {}
        if public:
            headers["ACL"] = "public-read"
        if mimetypes.guess_type(url)[0]:
            headers["ContentType"] = mimetypes.guess_type(url)[0]
        return headers

    def get_s3_path(self, path):
        s3_path = path.lstrip("/")
        if settings.DME_S3_FOLDER:
            s3_path = settings.DME_S3_FOLDER.strip("/")
            s3_path += "/"
            s3_path += path.lstrip("/")
        return s3_path

    def get_s3_url(self, url):
        s3_url = "https://s3.amazonaws.com/"
        s3_url += settings.DME_S3_BUCKET
        s3_url += "/"
        s3_url += self.get_s3_path(url)
        return s3_url

    def file_is_remote(self, url):
        if url.startswith("https:") or url.startswith("http:"):
            return True
        return False

    def upload_element_to_s3(self, instance):

        if not settings.DME_UPLOAD_TO_S3:
            return instance

        #If S3 upload is set and image is local then upload to S3 then delete local
        saved_to_s3 = False
        if instance.local_path and not self.file_is_remote(instance.image_url):
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

                s3_key = self.get_s3_path(instance.local_path)

                transfer.upload_file(
                        str(settings.PROJECT_ROOT + instance.local_path),
                        settings.DME_S3_BUCKET,
                        s3_key,
                        extra_args=self.get_s3_headers(s3_key)
                        )

                saved_to_s3 = True
                s3_url = self.get_s3_url(instance.local_path)

                instance.s3_path = instance.local_path
                instance.s3_bucket = settings.DME_S3_BUCKET
                instance.image_url = s3_url
                instance.save()
            except Exception as e:
                print traceback.format_exc()

        #If S3 upload is set and thumbnail image is local then upload to S3 then delete local
        thumbnail_saved_to_s3 = False
        if instance.thumbnail_local_path and not self.file_is_remote(instance.thumbnail_image_url):
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

                s3_key = self.get_s3_path(instance.local_path)

                transfer.upload_file(
                        str(settings.PROJECT_ROOT + instance.thumbnail_local_path),
                        settings.DME_S3_BUCKET,
                        s3_key,
                        extra_args=self.get_s3_headers(s3_key)
                        )

                saved_to_s3 = True
                s3_url = self.get_s3_url(instance.thumbnail_local_path)

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

class ImageHelper(object):
    """Image resize helper functions"""
    def resize(self, instance):
        rtn = {}
        rtn["success"] = False
        rtn["message"] = ""
        rtn["thumbnail_image_url"] = None

        url = instance.image_url
        full_path = settings.PROJECT_ROOT + "/" + url.strip("/")

        try:
            if os.path.exists(full_path):
                image = Image.open(full_path)
            else:
                rtn["message"] = "File path does not exist"
                return rtn
        except Exception as e:
            rtn["message"] = e.__str__()
            return rtn

        image_width, image_height = image.size
        instance.image_width = image_width
        instance.image_height = image_height
        instance.save()

        if not settings.DME_RESIZE:
            rtn["message"] = "The image was not resized since settings.DME_RESIZE is set to False"
            return rtn

        #create DME_RESIZE_DIRECTORY directory
        resize_dir = settings.PROJECT_ROOT + "/"
        resize_dir += settings.MEDIA_URL.strip("/") +  "/"
        resize_dir += settings.DME_RESIZE_DIRECTORY.strip("/")
        if not os.path.exists(resize_dir): os.makedirs(resize_dir)
        new_dir = "/" + settings.MEDIA_URL.strip("/") +  "/" + settings.DME_RESIZE_DIRECTORY.strip("/") + "/"

        #Clean file name
        file_name = os.path.basename(url)
        file_name = re.sub(r'\'|\"|\(|\)|\$','',file_name)
        file_name = re.sub(r'\s','-',file_name)

        extension = ""

        if "." in file_name:
            file_name_array = file_name.split(".")
            extension = file_name_array.pop()
            file_name = ".".join(file_name_array)

        if extension.lower() not in ["png","jpg","gif","bmp","jpeg","tiff"]:
            extension = image.format.lower()

        extension = extension.lower()

        url_orig_cropped = new_dir + file_name + "_orig_c." + extension
        orig_cropped_height = image_height
        orig_cropped_width = image_width

        #Aspect ratio for horizontal numerator
        ar_h_n = int(settings.DME_RESIZE_HORIZONTAL_ASPECT_RATIO.split(":")[0])
        #Aspect ratio for horizontal denominator
        ar_h_d = int(settings.DME_RESIZE_HORIZONTAL_ASPECT_RATIO.split(":")[1])
        #Aspect ratio for vertical numerator
        ar_v_n = int(settings.DME_RESIZE_VERTICAL_ASPECT_RATIO.split(":")[0])
        #Aspect ratio for vertical denominator
        ar_v_d = int(settings.DME_RESIZE_VERTICAL_ASPECT_RATIO.split(":")[1])

        if image_width > image_height:
            #Horizontal
            #orig_cropped_height = int(5/float(8)*image_width)
            orig_cropped_height = int(ar_h_d/float(ar_h_n)*image_width)

            if orig_cropped_height > image_height:
                orig_cropped_height = image_height
                #orig_cropped_width = int(8/float(5)*image_height)
                orig_cropped_width = int(ar_h_n/float(ar_h_d)*image_height)

        elif image_width < image_height:
            #Vertical
            #orig_cropped_width = int(320/float(414)*image_height)
            orig_cropped_width = int(ar_v_n/float(ar_v_d)*image_height)
            if orig_cropped_width > image_width:
                orig_cropped_width = image_width
                #orig_cropped_height = int(414/float(320)*image_width)
                orig_cropped_height = int(ar_v_d/float(ar_v_n)*image_width)
        else:
            #Square
            pass

        rtn_crop = self._crop_and_resize(image, orig_cropped_width, orig_cropped_height, url_orig_cropped)
        if not rtn_crop["success"]:
            return rtn_crop

        ResizedImage = get_model("media_explorer","ResizedImage")

        #We will work from the aspect-ratio cropped out version
        ri = ResizedImage()
        ri.image = instance
        ri.file_name = file_name + "_orig_c." + extension
        ri.image_url = url_orig_cropped
        ri.image_height = orig_cropped_height
        ri.image_width = orig_cropped_width
        ri.size = "orig_c"
        ri.save()

        image_cropped = Image.open(settings.PROJECT_ROOT + url_orig_cropped)

        ar_d = 0
        ar_n = 0
        if orig_cropped_width > orig_cropped_height:
            image_orientation = "horizontal"
            ar_d = ar_h_d
            ar_n = ar_h_n
        elif orig_cropped_width < orig_cropped_height:
            image_orientation = "vertical"
            ar_d = ar_v_d
            ar_n = ar_v_n
        else:
            image_orientation = "square"

		#Handle horizontal and vertical images
        if image_orientation in ["horizontal","vertical"]:
            for size_width in settings.DME_RESIZE_WIDTHS[image_orientation]:

                size_height = int(size_width*ar_d/ar_n)
                size = str(size_width) + "x" + str(size_height)

                if (orig_cropped_width >= size_width) and (orig_cropped_height >= size_height):
                    new_file_name = file_name + "_" + size + "." + extension
                    new_url = new_dir + new_file_name
                    rtn_resize = self._crop_and_resize(image_cropped, size_width, size_height, new_url)
                    if rtn_resize["success"]:
                        ri = ResizedImage()
                        ri.image = instance
                        ri.file_name = new_file_name
                        ri.image_url = new_url
                        ri.image_height = size_height
                        ri.image_width = size_width
                        ri.size = size
                        ri.save()

                    if size_width in settings.DME_RESIZE_WIDTHS["retina_2x"]:
                        retina_size_width = 2*size_width
                        retina_size_height = int(retina_size_width*ar_d/ar_n)
                        retina_size = str(retina_size_width) + "x" + str(retina_size_height)

                        if (orig_cropped_width >= retina_size_width) and (orig_cropped_height >= retina_size_height):
                            new_file_name = file_name + "_" + size + "@2x." + extension
                            new_url = new_dir + new_file_name
                            rtn_resize = self._crop_and_resize(image_cropped, retina_size_width, retina_size_height, new_url)
                            if rtn_resize["success"]:
                                ri = ResizedImage()
                                ri.image = instance
                                ri.file_name = new_file_name
                                ri.image_url = new_url
                                ri.image_height = retina_size_height
                                ri.image_width = retina_size_width
                                ri.size = size + "@2x"
                                ri.save()

		#Handle non-cropped images (vertical, horizontal, square)
        for size_width in settings.DME_RESIZE_WIDTHS["non_cropped"]:
            size_height = int(image_height/float(image_width)*size_width)
            size = str(size_width) + "nc"

            retina_size_width = 2*size_width
            retina_size_height = int(image_height/float(image_width)*retina_size_width)

            if (image_width >= size_width) and (image_height >= size_height):
                new_file_name = file_name + "_" + size + "." + extension
                new_url = new_dir + new_file_name
                rtn_resize = self._crop_and_resize(image, size_width, size_height, new_url)
                if rtn_resize["success"]:
                    ri = ResizedImage()
                    ri.image = instance
                    ri.file_name = new_file_name
                    ri.image_url = new_url
                    ri.image_height = size_height
                    ri.image_width = size_width
                    ri.size = size
                    ri.save()


            if (image_width >= retina_size_width) and (image_height >= retina_size_height):
                new_file_name = file_name + "_" + size + "@2x." + extension
                new_url = new_dir + new_file_name
                rtn_resize = self._crop_and_resize(image, retina_size_width, retina_size_height, new_url)
                if rtn_resize["success"]:
                    ri = ResizedImage()
                    ri.image = instance
                    ri.file_name = new_file_name
                    ri.image_url = new_url
                    ri.image_height = retina_size_height
                    ri.image_width = retina_size_width
                    ri.size = size + "@2x"
                    ri.save()

        #Now process thumbnail_image_url
        size_width = settings.DME_RESIZE_WIDTHS["thumbnail"]
        size_height = int(image_height/float(image_width)*size_width)
        size = str(size_width) + "x" + str(size_height) + ".thumbnail"

        new_file_name = file_name + "_" + size + "." + extension
        new_url = new_dir + new_file_name
        rtn_resize = self._crop_and_resize(image, size_width, size_height, new_url)
        if rtn_resize["success"]:
            rtn["thumbnail_image_url"] = new_url

        rtn["success"] = True
        return rtn


    def _crop_and_resize(self, image, width, height, new_path):
        rtn = {}
        rtn["success"] = False
        rtn["message"] = ""
        try:
            imagefit = ImageOps.fit(image, (width, height), Image.ANTIALIAS)
            imagefit.save(settings.PROJECT_ROOT + new_path, image.format, quality=100)
        except Exception as e:
            rtn["message"] = e.__str__()
            return rtn

        rtn["success"] = True
        return rtn

    def _resize(self, image, width, height, new_path):
        rtn = {}
        rtn["success"] = False
        rtn["message"] = ""
        try:
            resized = image.resize((width,height),Image.ANTIALIAS).save(settings.PROJECT_ROOT + new_path)
        except Exception as e:
            rtn["message"] = e.__str__()
            return rtn

        rtn["success"] = True
        return rtn

#EOF
