from django.contrib import admin

from .models import FAQ, Category, CompanyContact, Product, Service


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "availability", "featured", "is_published", "updated_at")
    list_editable = ("availability", "featured", "is_published")
    list_filter = ("category", "availability", "is_published", "featured")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    actions = ["publish", "unpublish"]

    @admin.action(description="Publish selected products")
    def publish(self, request, qs):
        qs.update(is_published=True)

    @admin.action(description="Unpublish selected products")
    def unpublish(self, request, qs):
        qs.update(is_published=False)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_published", "sort_order")
    list_editable = ("is_published", "sort_order")


@admin.register(CompanyContact)
class CompanyContactAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not CompanyContact.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
