from django.db.models import Count, Q
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FAQ, Category, CompanyContact, Product, Service
from .serializers import (CategorySerializer, CompanySerializer, FAQSerializer,
                          ProductSerializer, ServiceSerializer)


class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 48


class CategoryList(ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).annotate(
            product_count=Count("products", filter=Q(products__is_published=True)))


class ProductList(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = ProductPagination

    def get_queryset(self):
        qs = Product.objects.filter(is_published=True, category__is_active=True).select_related("category")
        p = self.request.query_params
        if p.get("category"):
            qs = qs.filter(category__slug=p["category"])
        if p.get("featured") == "1":
            qs = qs.filter(featured=True)
        if p.get("q"):
            qs = qs.filter(Q(name__icontains=p["q"][:100]) | Q(description__icontains=p["q"][:100]))
        return qs


class ProductDetail(RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    queryset = Product.objects.filter(is_published=True, category__is_active=True).select_related("category")


class ServiceList(ListAPIView):
    serializer_class = ServiceSerializer
    pagination_class = None
    queryset = Service.objects.filter(is_active=True).select_related("category")


class FaqList(ListAPIView):
    serializer_class = FAQSerializer
    pagination_class = None
    queryset = FAQ.objects.filter(is_published=True)


class CompanyView(APIView):
    def get(self, request):
        return Response(CompanySerializer(CompanyContact.load()).data)
