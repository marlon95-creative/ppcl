from django.db import models
from django.utils.text import slugify


def unique_slug(model, value, instance):
    base = slugify(value)[:120] or "item"
    slug, n = base, 2
    while model.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
        slug, n = f"{base}-{n}", n + 1
    return slug


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=130, unique=True, blank=True)
    description = models.CharField(max_length=300, blank=True)
    is_active = models.BooleanField("active", default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "categories"

    def save(self, *a, **kw):
        if not self.slug:
            self.slug = unique_slug(Category, self.name, self)
        super().save(*a, **kw)

    def __str__(self):
        return self.name


class Product(models.Model):
    class Availability(models.TextChoices):
        IN_STOCK = "in_stock", "In stock"
        LIMITED = "limited", "Limited stock"
        ON_REQUEST = "on_request", "Available on request"
        UNAVAILABLE = "unavailable", "Currently unavailable"

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    description = models.TextField(help_text="Accurate and plain. No unsupported medical claims.")
    specifications = models.TextField(blank=True, help_text="One per line, as 'Label: value'. Confirmed specs only.")
    image = models.ImageField(upload_to="products/", blank=True)
    image_alt = models.CharField(max_length=150, blank=True)
    availability = models.CharField(max_length=12, choices=Availability.choices, default=Availability.ON_REQUEST)
    featured = models.BooleanField(default=False, help_text="Show on the Home page")
    is_published = models.BooleanField("published", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *a, **kw):
        if not self.slug:
            self.slug = unique_slug(Product, self.name, self)
        super().save(*a, **kw)

    def __str__(self):
        return self.name


class Service(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL,
                                 help_text="Links the 'Request a Quote' button to this category.")
    image = models.ImageField(upload_to="services/", blank=True)
    is_active = models.BooleanField("active", default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    is_published = models.BooleanField("published", default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "FAQ"

    def __str__(self):
        return self.question


class CompanyContact(models.Model):
    """Single record: basic company information shown across the site."""

    company_name = models.CharField(max_length=120, default="Safety Company")
    short_description = models.CharField(max_length=250, blank=True)
    about_text = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    values = models.TextField(blank=True, help_text="One value per line")
    phone = models.CharField(max_length=40, blank=True, help_text="With country code, e.g. +255700000000")
    email = models.EmailField(blank=True)
    whatsapp = models.CharField(max_length=40, blank=True, help_text="Digits with country code, no + or spaces")
    address = models.CharField(max_length=250, blank=True)
    working_hours = models.CharField(max_length=200, blank=True)
    map_url = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    class Meta:
        verbose_name = "company information"
        verbose_name_plural = "company information"

    def save(self, *a, **kw):
        self.pk = 1
        super().save(*a, **kw)

    @classmethod
    def load(cls):
        return cls.objects.get_or_create(pk=1)[0]

    def __str__(self):
        return self.company_name
