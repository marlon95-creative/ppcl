from django.contrib.admin.views.decorators import staff_member_required
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import QuoteRequest
from .notifications import send_quote_emails
from .serializers import ContactMessageSerializer, QuoteRequestSerializer


class QuoteThrottle(AnonRateThrottle):
    scope = "quote"


class ContactThrottle(AnonRateThrottle):
    scope = "contact"


class QuoteCreate(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    throttle_classes = [QuoteThrottle]

    def post(self, request):
        ser = QuoteRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        quote = ser.save()
        send_quote_emails(quote)
        return Response({"reference": quote.reference}, status=status.HTTP_201_CREATED)


class ContactCreate(APIView):
    throttle_classes = [ContactThrottle]

    def post(self, request):
        ser = ContactMessageSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response({"ok": True}, status=status.HTTP_201_CREATED)


@staff_member_required
def download_attachment(request, pk):
    quote = get_object_or_404(QuoteRequest, pk=pk)
    if not quote.attachment:
        raise Http404
    return FileResponse(quote.attachment.open("rb"), as_attachment=True)
