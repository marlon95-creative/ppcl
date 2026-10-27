from django.contrib import admin


class SafetyAdminSite(admin.AdminSite):
    """Admin with a small dashboard of website activity on the home screen."""

    site_header = "Safety Company Admin"
    site_title = "Safety Company Admin"
    index_title = "Dashboard"
    index_template = "admin/dashboard.html"

    def index(self, request, extra_context=None):
        from catalog.models import Product
        from quotes.models import ContactMessage, QuoteRequest

        by_status = {s: QuoteRequest.objects.filter(status=s).count() for s, _ in QuoteRequest.Status.choices}
        dash = {
            "new": by_status.get("new", 0),
            "in_review": by_status.get("in_review", 0),
            "responded": by_status.get("responded", 0),
            "products_live": Product.objects.filter(is_published=True).count(),
            "products_hidden": Product.objects.filter(is_published=False).count(),
            "messages": ContactMessage.objects.filter(is_handled=False).count(),
            "recent": QuoteRequest.objects.select_related("category")[:6],
        }
        return super().index(request, {**(extra_context or {}), "dash": dash})
