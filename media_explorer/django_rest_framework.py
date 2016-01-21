from django.http import Http404
import traceback
from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage
from rest_framework import generics, serializers, viewsets
from rest_framework import views, response, status, parsers
from django.conf import settings
from django.db.models import Q

class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Element
        fields = ('id','name','file_name','type','credit','description','thumbnail_image_url','image_url','video_url','video_embed','created_at')

    def update(self, instance, validated_data):
        for field in validated_data:
            if validated_data[field]:
                setattr(instance,field,validated_data[field])
        instance.save()
        return instance

class ElementList(views.APIView):
    """
    List all Elements or create a new element
    """
    queryset = Element.objects.none()

    def get_queryset(self):
        #NOTE: Code below must match ElementStatsView.get
        #TODO - move to helper so you don't maintain same code twice
        query = None
        and_query = None
        or_query = None
        type = self.request.QUERY_PARAMS.get('type', None)
        filter = self.request.QUERY_PARAMS.get('filter', None)
        sort = self.request.QUERY_PARAMS.get('sort', "created_at")
        direction = self.request.QUERY_PARAMS.get('direction', "desc")
        page = int(self.request.QUERY_PARAMS.get('page', 1))
        limit = settings.DME_PAGE_SIZE

        try:
            if type:
                and_query = Q(type=type)
        except Exception as e:
            pass

        if filter:
            try:
                filter_list = filter.split(" ")
                or_query = Q(name__icontains=filter_list[0]) | Q(description__icontains=filter_list[0]) | Q(credit__icontains=filter_list[0])
                for term in filter_list[1:]:
                    or_query.add((Q(name__icontains=term) | Q(description__icontains=term) | Q(credit__icontains=term)), or_query.connector)
            except Exception as e:
                pass

        if and_query:
            query = and_query

        if or_query:
            if query:
                query.add(or_query,Q.AND)
            else:
                query = or_query

        offset = (page-1)*limit
        next_offset = limit + offset

        order_by = "-"+sort
        if direction.lower() == "asc":
            order_by = sort

        if query:
            queryset = Element.objects.order_by(order_by).filter(query)[offset:next_offset]
        else:
            queryset = Element.objects.order_by(order_by).all()[offset:next_offset]

        return queryset

    def get(self, request, format=None):
        #Don't use self.queryset - it's cached
        #elements = self.queryset
        elements = self.get_queryset()
        serializer = ElementSerializer(elements, many=True)
        return response.Response(serializer.data)

    def post(self, request, format=None):

        #Validating here instead of serializer.validate
        #because I can't access FILES data in serializer.validate
        if "video_url" not in request.DATA \
                and ("image" not in request.FILES \
                or not request.FILES["image"]):
            return response.Response(
                "Provide an image or a video URL",
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ElementSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            element = Element.objects.get(id=serializer.data["id"])
            if request.FILES:
                if "image" in request.FILES:
                    element.image = request.FILES['image']

                if "thumbnail_image" in request.FILES:
                    element.thumbnail_image = request.FILES['thumbnail_image']

                element.save()

            serializer = ElementSerializer(element)
            return response.Response(serializer.data)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ElementDetail(views.APIView):
    """
    Retrieve, update or delete an element instance
    """
    queryset = Element.objects.none()

    def get_object(self, pk):
        try:
            return Element.objects.get(pk=pk)
        except Element.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        element = self.get_object(pk)
        serializer = ElementSerializer(element)
        return response.Response(serializer.data)

    def put(self, request, pk, format=None):

        try:

            element = self.get_object(pk)
            serializer = ElementSerializer(element, data=request.DATA)
            if serializer.is_valid():
                serializer.save()

                element = Element.objects.get(id=serializer.data["id"])
                if request.FILES:
                    if "image" in request.FILES:
                        element.image = request.FILES['image']

                    if "thumbnail_image" in request.FILES:
                        element.thumbnail_image = request.FILES['thumbnail_image']

                    element.save()

                serializer = ElementSerializer(element)
                return response.Response(serializer.data)

            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
          print traceback.format_exc()

    def delete(self, request, pk, format=None):
        element = self.get_object(pk)
        element.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

class ResizedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResizedImage
        fields = ('id','image','file_name','size','image_url','image_width','image_height','created_at')

class ResizedImageList(views.APIView):
    """
    List all Resized images when given an Element
    """
    queryset = ResizedImage.objects.none()

    def get_queryset(self):
        element_id = self.request.QUERY_PARAMS.get('element_id', None)
        queryset = ResizedImage.objects.none()
        if element_id is not None:
            queryset = ResizedImage.objects.filter(image_id=element_id)
        return queryset

    def get(self, request, format=None):
        #Don't use self.queryset - it's cached
        #elements = self.queryset
        images = self.get_queryset()
        serializer = ResizedImageSerializer(images, many=True)
        return response.Response(serializer.data)

class GalleryElementSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='element.id')
    type = serializers.ReadOnlyField(source='element.type')
    name = serializers.ReadOnlyField(source='element.name')
    thumbnail_image_url = serializers.ReadOnlyField(source='element.thumbnail_image_url')
    image_url = serializers.ReadOnlyField(source='element.image_url')
    video_url = serializers.ReadOnlyField(source='element.video_url')
    video_embed = serializers.ReadOnlyField(source='element.video_embed')
    created_at = serializers.ReadOnlyField(source='element.created_at')

    class Meta:
        model = GalleryElement
        fields = ('id','type','name','credit','description','thumbnail_image_url','image_url','video_url','video_embed','sort_by','created_at')

class GallerySerializer(serializers.ModelSerializer):
    elements = GalleryElementSerializer(source='galleryelement_set', many=True, required=False, read_only=True)
    class Meta:
        model = Gallery
        fields = ('id','name','description','thumbnail_image_url','elements','created_at')

    def validate_name(self, value):
        """
        Make sure name is provided
        """
        if not value:
            raise serializers.ValidationError("Provide a gallery name")
        return value

class GalleryList(views.APIView):
    """
    List all galleries and their elements or create a new one
    """
    queryset = Gallery.objects.all()

    def get_queryset(self, id=None):
        #NOTE: Code below must match GalleryStatsView.get
        #TODO - move to helper so you don't maintain same code twice
        query = None
        and_query = None
        or_query = None
        filter = self.request.QUERY_PARAMS.get('filter', None)
        sort = self.request.QUERY_PARAMS.get('sort', "created_at")
        direction = self.request.QUERY_PARAMS.get('direction', "desc")
        page = int(self.request.QUERY_PARAMS.get('page', 1))
        limit = settings.DME_PAGE_SIZE

        try:
            if id:
                and_query = Q(id=id)
        except Exception as e:
            pass

        if filter:
            try:
                filter_list = filter.split(" ")
                or_query = Q(name__icontains=filter_list[0]) | Q(description__icontains=filter_list[0])
                for term in filter_list[1:]:
                    or_query.add((Q(name__icontains=term) | Q(description__icontains=term)), or_query.connector)
            except Exception as e:
                pass

        if and_query:
            query = and_query

        if or_query:
            if query:
                query.add(or_query,Q.AND)
            else:
                query = or_query

        offset = (page-1)*limit
        next_offset = limit + offset

        order_by = "-"+sort
        if direction.lower() == "asc":
            order_by = sort

        if query:
            queryset = Gallery.objects.order_by(order_by).filter(query)[offset:next_offset]
        else:
            queryset = Gallery.objects.order_by(order_by).all()[offset:next_offset]

        return queryset

    def get(self, request, format=None):
        #Don't use self.queryset - it's cached
        #elements = self.queryset
        elements = self.get_queryset()
        serializer = GallerySerializer(elements, many=True)
        return response.Response(serializer.data)

    def post(self, request, format=None):
        serializer = GallerySerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            #Add the Gallery elements if element_id is present
            sort_by = 0
            if "element_id" in request.DATA and len(request.DATA.getlist("element_id"))>0:
                element_ids = request.DATA.getlist("element_id")
                credits = request.DATA.getlist("element_credit")
                descriptions = request.DATA.getlist("element_description")
                gallery = Gallery.objects.get(id=serializer.data["id"])
                count = 0
                for element_id in element_ids:
                    if not element_id:
                        count += 1
                        continue
                    if Element.objects.filter(id=element_id).exists():
                        element = Element.objects.get(id=element_id)
                        if GalleryElement.objects.filter(gallery=gallery,element=element).exists():
                            galleryelement = GalleryElement.objects.get(gallery=gallery,element=element)
                        else:
                            galleryelement = GalleryElement()
                            galleryelement.gallery = gallery
                            galleryelement.element = element

                        try:
                            galleryelement.credit = credits[count]
                        except Exception as e:
                            pass
                        try:
                            galleryelement.description = descriptions[count]
                        except Exception as e:
                            pass

                        galleryelement.sort_by = sort_by
                        galleryelement.save()
                        sort_by += 1
                    count += 1

                #Save the gallery again so the thumbnail_image_url is set
                gallery.save()

                serializer = GallerySerializer(self.get_queryset(gallery.id), many=True)

            return response.Response(serializer.data)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GalleryDetail(views.APIView):
    """
    Retrieve, update or delete a gallery instance
    """
    queryset = Gallery.objects.none()

    def get_object(self, pk):
        try:
            return Gallery.objects.get(pk=pk)
        except Gallery.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        gallery = self.get_object(pk)
        serializer = GallerySerializer(gallery)
        return response.Response(serializer.data)

    def put(self, request, pk, format=None):
        gallery = self.get_object(pk)
        serializer = GallerySerializer(gallery, data=request.DATA)
        if serializer.is_valid():
            serializer.save()

            sort_by = 0

            current_element_ids = GalleryElement.objects.filter(gallery=gallery).values_list("element__id",flat=True)
            delete_element_ids = []
            if "element_id" in request.DATA and len(request.DATA.getlist("element_id"))>0:
                element_ids = request.DATA.getlist("element_id")
                credits = request.DATA.getlist("element_credit")
                descriptions = request.DATA.getlist("element_description")

                for element_id in current_element_ids:
                    if str(element_id) not in element_ids:
                        delete_element_ids.append(element_id)

                #Delete elements
                for element_id in delete_element_ids:
                    element = Element.objects.get(id=element_id)
                    galleryelement = GalleryElement.objects.get(gallery=gallery,element=element)
                    galleryelement.delete()

                #Add elements
                gallery = Gallery.objects.get(id=serializer.data["id"])
                count = 0
                for element_id in element_ids:
                    if not element_id:
                        count += 1
                        continue
                    if Element.objects.filter(id=element_id).exists():
                        element = Element.objects.get(id=element_id)
                        if GalleryElement.objects.filter(gallery=gallery,element=element).exists():
                            galleryelement = GalleryElement.objects.get(gallery=gallery,element=element)
                        else:
                            galleryelement = GalleryElement()
                            galleryelement.gallery = gallery
                            galleryelement.element = element
                        galleryelement.credit = credits[count]
                        galleryelement.description = descriptions[count]
                        galleryelement.sort_by = sort_by
                        galleryelement.save()
                        sort_by += 1
                    count += 1

                #Save the gallery again so the thumbnail_image_url is set
                gallery.save()

                serializer = GallerySerializer(gallery)

            return response.Response(serializer.data)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        element = self.get_object(pk)
        element.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

class GalleryElementDetail(views.APIView):
    """
    Retrieve, update or delete an element instance
    """
    queryset = GalleryElement.objects.none()

    def get_object(self, pk):
        try:
            return GalleryElement.objects.get(pk=pk)
        except GalleryElement.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        element = self.get_object(pk)
        serializer = GalleryElementSerializer(element)
        return response.Response(serializer.data)

    def put(self, request, pk, format=None):
        element = self.get_object(pk)
        serializer = GalleryElementSerializer(element, data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        element = self.get_object(pk)
        element.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

