from django.urls import path

from .views import ContactCreate, QuoteCreate

urlpatterns = [
    path("quotes/", QuoteCreate.as_view(), name="quote-create"),
    path("contact-messages/", ContactCreate.as_view(), name="contact-create"),
]
