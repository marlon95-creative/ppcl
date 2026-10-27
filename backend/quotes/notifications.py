import logging

from django.conf import settings
from django.core.mail import send_mail

log = logging.getLogger(__name__)


def send_quote_emails(q):
    """An email problem must never fail the client's submission."""
    try:
        category = q.category.name if q.category else "Other / not sure"
        if settings.QUOTE_NOTIFY_EMAIL:
            send_mail(
                f"New quote request {q.reference}: {category}",
                f"From: {q.full_name} ({q.organization or 'no organization'}), {q.get_client_type_display()}\n"
                f"Phone: {q.phone}\nEmail: {q.email}\nPreferred contact: {q.preferred_contact_method or '-'}\n"
                f"Category: {category}\nItem: {q.requested_item}\n"
                f"Quantity: {q.quantity or '-'} {q.unit}\n\n{q.message or '(no message)'}\n\n"
                f"Attachment: {'yes, download it in the admin area' if q.attachment else 'none'}\n",
                settings.DEFAULT_FROM_EMAIL, [settings.QUOTE_NOTIFY_EMAIL],
            )
        send_mail(
            f"We received your request {q.reference}",
            f"Hello {q.full_name},\n\nThank you for your request. Your reference number is {q.reference}. "
            f"Our team will review it and reply with a quotation.\n",
            settings.DEFAULT_FROM_EMAIL, [q.email],
        )
    except Exception:  # noqa: BLE001
        log.exception("Quote notification failed for %s", q.pk)
