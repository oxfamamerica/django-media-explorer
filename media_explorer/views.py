import math, json
from django.http import HttpResponse
from django.views.generic import View
from media_explorer.models import Element, Gallery, GalleryElement
from django.conf import settings
from django.db.models import Q

class ElementStatsView(View):

    def get(self, request, *args, **kwargs):
        #NOTE: Code below must match ElementList.get_queryset
        #TODO - move to helper so you don't maintain same code twice
        data = {}
        query = None
        and_query = None
        or_query = None
        type = request.GET.get('type', None)
        filter = request.GET.get('filter', None)

        data["page_size"] = settings.DME_PAGE_SIZE

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

        if query:
            data["total_entries"] = Element.objects.filter(query).count()
        else:
            data["total_entries"] = Element.objects.all().count()

        data["total_pages"] = int(math.ceil(float(data["total_entries"])/data["page_size"]))

        return HttpResponse(json.dumps(data),content_type="application/json")

class GalleryStatsView(View):
    def get(self, request, *args, **kwargs):
        #NOTE: Code below must match GalleryList.get_queryset
        #TODO - move to helper so you don't maintain same code twice
        data = {}
        query = None
        and_query = None
        or_query = None
        filter = request.GET.get('filter', None)

        data["page_size"] = settings.DME_PAGE_SIZE

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

        if query:
            data["total_entries"] = Gallery.objects.filter(query).count()
        else:
            data["total_entries"] = Gallery.objects.all().count()

        data["total_pages"] = int(math.ceil(float(data["total_entries"])/data["page_size"]))

        return HttpResponse(json.dumps(data),content_type="application/json")

