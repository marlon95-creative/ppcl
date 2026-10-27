from rest_framework import serializers

from .models import FAQ, Category, CompanyContact, Product, Service


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "product_count"]


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    availability_label = serializers.CharField(source="get_availability_display", read_only=True)
    image = serializers.SerializerMethodField()
    specifications = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category", "category_name", "description", "specifications",
                  "image", "image_alt", "availability", "availability_label", "featured"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_specifications(self, obj):
        out = []
        for line in obj.specifications.splitlines():
            line = line.strip()
            if not line:
                continue
            label, sep, value = line.partition(":")
            out.append({"label": label.strip(), "value": value.strip()} if sep else {"label": "", "value": line})
        return out


class ServiceSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ["id", "name", "description", "category", "image"]

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class CompanySerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField()

    class Meta:
        model = CompanyContact
        exclude = ["id"]

    def get_values(self, obj):
        return [v.strip() for v in obj.values.splitlines() if v.strip()]
