from django.urls import path

from . import views

urlpatterns = [
    path("categories/", views.CategoryList.as_view()),
    path("products/", views.ProductList.as_view()),
    path("products/<slug:slug>/", views.ProductDetail.as_view()),
    path("services/", views.ServiceList.as_view()),
    path("faqs/", views.FaqList.as_view()),
    path("company/", views.CompanyView.as_view()),
]
