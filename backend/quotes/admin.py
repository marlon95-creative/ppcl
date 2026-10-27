from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import ContactMessage, QuoteRequest


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ("reference", "full_name", "organization", "client_type", "category", "requested_item", "status", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "client_type", "category", "created_at")
    search_fields = ("full_name", "organization", "email", "phone", "requested_item", "message")
    date_hierarchy = "created_at"
    readonly_fields = ("reference", "consent", "created_at", "updated_at", "attachment_link")
    exclude = ("attachment",)
    actions = ["mark_in_review", "mark_responded", "mark_closed"]
    fieldsets = (
        ("Client", {"fields": ("reference", "full_name", "organization", "client_type", "email", "phone", "preferred_contact_method")}),
        ("Request", {"fields": ("category", "requested_item", "quantity", "unit", "message", "attachment_link", "consent")}),
        ("Management", {"fields": ("status", "response_notes", "created_at", "updated_at")}),
    )

    @admin.display(description="Attachment")
    def attachment_link(self, obj):
        if obj.pk and obj.attachment:
            return format_html('<a href="{}">Download</a>', reverse("quote-attachment", args=[obj.pk]))
        return "None"

    def has_add_permission(self, request):
        return False

    @admin.action(description="Mark as In Review")
    def mark_in_review(self, request, qs):
        qs.update(status="in_review")

    @admin.action(description="Mark as Responded")
    def mark_responded(self, request, qs):
        qs.update(status="responded")

    @admin.action(description="Mark as Closed")
    def mark_closed(self, request, qs):
        qs.update(status="closed")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "is_handled", "created_at")
    list_editable = ("is_handled",)
    list_filter = ("is_handled", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at")

    def has_add_permission(self, request):
        return False
