from django.http import Http404
from media_explorer.models import Element, Gallery, GalleryElement, ResizedImage
from rest_framework import generics, serializers, viewsets
from rest_framework import views, response, status, parsers
from django.conf import settings
from django.db.models import Q

class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Element
        fields = ('id','name','file_name','type','credit','description','thumbnail_image_url','image_url','video_url','video_embed','created_at')

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

        #print queryset.query
        return queryset

    def get(self, request, format=None):
        #Don't use self.queryset - it's cached
        #elements = self.queryset
        elements = self.get_queryset()
        serializer = ElementSerializer(elements, many=True)
        return response.Response(serializer.data)

    def post(self, request, format=None):

        try:
            serializer = ElementSerializer(data=request.DATA)
            if not serializer.is_valid():
                return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            element = Element.objects.get(id=serializer.data["id"])
            if request.FILES:
                if "image" in request.FILES:
                    #element = Element(image=request.FILES['image'])
                    element.image = request.FILES['image']

                if "thumbnail_image" in request.FILES:
                    #element = Element(thumbnail_image=request.FILES['thumbnail_image'])
                    element.thumbnail_image = request.FILES['thumbnail_image']

                element.save()

            serializer = ElementSerializer(element)
            return response.Response(serializer.data)

        except Exception as e:
            pass

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
        element = self.get_object(pk)
        serializer = ElementSerializer(element, data=request.DATA)
        if serializer.is_valid():
            serializer.save()

            element = Element.objects.get(id=serializer.data["id"])
            if request.FILES:
                if "image" in request.FILES:
                    #element = Element(image=request.FILES['image'])
                    element.image = request.FILES['image']

                if "thumbnail_image" in request.FILES:
                    #element = Element(thumbnail_image=request.FILES['thumbnail_image'])
                    element.thumbnail_image = request.FILES['thumbnail_image']

                element.save()

            serializer = ElementSerializer(element)
            return response.Response(serializer.data)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        element = self.get_object(pk)
        element.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)

    #DEBUG WARNING - tried to use this to fix Mezzanine looking for response.content-type
    #def finalize_response(self, request, *args, **kwargs):
    #    response = super(ElementDetail, self).finalize_response(request, *args, **kwargs)
    #    response['content-type'] = 'not-your-business'
    #    response['Content-Type'] = 'not-your-business'
    #    return response

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
    id = serializers.Field(source='element.id')
    type = serializers.Field(source='element.type')
    name = serializers.Field(source='element.name')
    #credit = serializers.Field(source='element.credit')
    #description = serializers.Field(source='element.description')
    thumbnail_image_url = serializers.Field(source='element.thumbnail_image_url')
    image_url = serializers.Field(source='element.image_url')
    video_url = serializers.Field(source='element.video_url')
    video_embed = serializers.Field(source='element.video_embed')
    created_at = serializers.Field(source='element.created_at')

    class Meta:
        model = GalleryElement
        fields = ('id','type','name','credit','description','thumbnail_image_url','image_url','video_url','video_embed','sort_by','created_at')

class GallerySerializer(serializers.ModelSerializer):
    elements = GalleryElementSerializer(source='galleryelement_set', many=True, required=False)
    class Meta:
        model = Gallery
        fields = ('id','name','description','thumbnail_image_url','elements','created_at')

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
                        galleryelement.credit = credits[count]
                        galleryelement.description = descriptions[count]
                        galleryelement.sort_by = sort_by
                        galleryelement.save()
                        sort_by += 1
                    count += 1

                #Save the gallery again so the thumbnail_image_url is set
                gallery.save()

                serializer = GallerySerializer(self.get_queryset(gallery.id), many=True)

            return response.Response(serializer.data)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#kofi
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

    #DEBUG WARNING - tried to use this to fix Mezzanine looking for response.content-type
    #def finalize_response(self, request, *args, **kwargs):
    #    response = super(GalleryDetail, self).finalize_response(request, *args, **kwargs)
    #    response['content-type'] = 'not-your-business'
    #    response['Content-Type'] = 'not-your-business'
    #    return response

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

    #DEBUG WARNING - tried to use this to fix Mezzanine looking for response.content-type
    #def finalize_response(self, request, *args, **kwargs):
    #    response = super(GalleryElementDetail, self).finalize_response(request, *args, **kwargs)
    #    response['content-type'] = 'not-your-business'
    #    response['Content-Type'] = 'not-your-business'
    #    return response

