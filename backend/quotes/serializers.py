from rest_framework import serializers

from catalog.models import Category
from .models import ContactMessage, QuoteRequest


class QuoteRequestSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", queryset=Category.objects.filter(is_active=True),
                                            required=False, allow_null=True)
    consent = serializers.BooleanField()
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)  # honeypot

    class Meta:
        model = QuoteRequest
        fields = ["full_name", "organization", "email", "phone", "client_type", "category", "requested_item",
                  "quantity", "unit", "message", "preferred_contact_method", "attachment", "consent", "website"]
        extra_kwargs = {"quantity": {"min_value": 1, "max_value": 1000000}}

    def validate_consent(self, v):
        if not v:
            raise serializers.ValidationError("Tick the box to confirm before sending.")
        return v

    def validate(self, data):
        if data.pop("website", ""):
            raise serializers.ValidationError("Request rejected.")
        return data


class ContactMessageSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message", "website"]
        extra_kwargs = {"message": {"min_length": 5}}

    def validate(self, data):
        if data.pop("website", ""):
            raise serializers.ValidationError("Request rejected.")
        return data
