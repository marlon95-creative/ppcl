import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

phone_validator = RegexValidator(
    r"^\+?[0-9][0-9\s\-().]{6,19}$",
    "Enter a valid phone number, for example +255 700 000 000.",
)

# File signatures so a renamed .exe cannot pass as a PDF or image
_SIGNATURES = {
    "pdf": [b"%PDF"],
    "jpg": [b"\xff\xd8\xff"], "jpeg": [b"\xff\xd8\xff"],
    "png": [b"\x89PNG\r\n\x1a\n"],
    "doc": [b"\xd0\xcf\x11\xe0"], "xls": [b"\xd0\xcf\x11\xe0"],
    "docx": [b"PK\x03\x04"], "xlsx": [b"PK\x03\x04"],
}


def validate_attachment(f):
    ext = os.path.splitext(f.name)[1].lower().lstrip(".")
    if ext not in settings.ATTACHMENT_ALLOWED_EXTENSIONS:
        raise ValidationError("Upload a PDF, image (JPG or PNG), Word or Excel file.")
    if f.size > settings.ATTACHMENT_MAX_BYTES:
        raise ValidationError("The file is larger than 5 MB. Upload a smaller file.")
    head = f.read(8)
    f.seek(0)
    if not any(head.startswith(sig) for sig in _SIGNATURES[ext]):
        raise ValidationError("The file content does not match its type. Upload a valid file.")
