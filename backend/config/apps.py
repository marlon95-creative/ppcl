from django.contrib.admin.apps import AdminConfig


class SafetyAdminConfig(AdminConfig):
    default_site = "config.admin.SafetyAdminSite"
