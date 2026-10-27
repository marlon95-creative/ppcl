import uuid

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models

from catalog.models import Category
from .validators import phone_validator, validate_attachment

private_storage = FileSystemStorage(location=settings.PRIVATE_MEDIA_ROOT)


def attachment_path(instance, filename):
    ext = filename.rsplit(".", 1)[-1].lower()
    return f"quotes/{uuid.uuid4().hex}.{ext}"  # client filename never used on disk


class QuoteRequest(models.Model):
    class ClientType(models.TextChoices):
        HOSPITAL = "hospital", "Hospital"
        CLINIC = "clinic", "Clinic"
        MEDICAL_CENTRE = "medical_centre", "Medical Centre"
        PHARMACY = "pharmacy", "Pharmacy"
        PROFESSIONAL = "professional", "Doctor / Professional"
        ORGANIZATION = "organization", "Organization"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_REVIEW = "in_review", "In Review"
        RESPONDED = "responded", "Responded"
        CLOSED = "closed", "Closed"

    class ContactMethod(models.TextChoices):
        PHONE = "phone", "Phone"
        EMAIL = "email", "Email"
        WHATSAPP = "whatsapp", "WhatsApp"

    full_name = models.CharField("name", max_length=120)
    organization = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=25, validators=[phone_validator])
    client_type = models.CharField(max_length=20, choices=ClientType.choices)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL,
                                 help_text="Empty means 'Other / not sure'.")
    requested_item = models.CharField("product / service", max_length=200)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    unit = models.CharField(max_length=40, blank=True)
    message = models.TextField(max_length=3000, blank=True)
    preferred_contact_method = models.CharField(max_length=10, choices=ContactMethod.choices, blank=True)
    attachment = models.FileField(upload_to=attachment_path, storage=private_storage, blank=True,
                                  validators=[validate_attachment])
    consent = models.BooleanField(default=False)

    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW, db_index=True)
    response_notes = models.TextField(blank=True, help_text="Staff only: what was sent to the client.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def reference(self):
        return f"MQ-{self.created_at:%Y%m%d}-{self.pk:05d}"

    def __str__(self):
        return f"{self.reference} - {self.full_name}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=25, blank=True, validators=[phone_validator])
    subject = models.CharField(max_length=150, blank=True)
    message = models.TextField(max_length=3000)
    is_handled = models.BooleanField("handled", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}: {self.subject or 'message'}"
