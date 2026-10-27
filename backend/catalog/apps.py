from django.apps import AppConfig
from django.db.models.signals import post_migrate


class CatalogConfig(AppConfig):
    name = "catalog"

    def ready(self):
        from .seed import seed_defaults
        post_migrate.connect(seed_defaults, sender=self, dispatch_uid="catalog_seed")
