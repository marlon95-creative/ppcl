"""Default Pisgah Pinnacle Co. Ltd. catalog and company profile."""
from .models import FAQ, Category, CompanyContact, Product, Service

CATEGORIES = [
    ("PPEs", "Personal protective equipment including safety shoes, PVC boots, gloves, overalls, masks, ear protection, safety glasses, goggles, helmets, hairnets, bump caps, reflective vests, chemical aprons and rainwear."),
    ("Hospital Uniforms", "Professional uniforms and workwear for hospital, clinic and healthcare teams."),
    ("Executive Uniforms", "Smart professional uniforms, shirts, trousers, suits, polo shirts and branded workwear for offices and organizations."),
    ("School Uniforms", "School uniform clothing for students and educational institutions. Specify colours, sizes and quantities in your quotation request."),
]
SERVICES = [
    ("Personal Protective Equipment (PPE)", "Supply of safety shoes, PVC boots, hand gloves, overalls, masks, ear plugs and muffs, safety glasses and goggles, helmets, hairnets, bump caps, reflective vests, chemical aprons, rain suits and rain coats.", 0),
    ("Hospital Uniforms", "Workwear and uniforms for hospitals, clinics and healthcare teams. Include sizes, colours and quantities in your quotation request.", 1),
    ("Executive Uniforms and Workwear", "Professional shirts, trousers, suits, T-shirts, polo shirts and other workwear for companies and organizations.", 2),
    ("School Uniforms", "Uniform supply for schools and educational institutions. Share the design, colour, sizes and quantities required.", 3),
]
PRODUCTS = [
    ("Safety Shoes", 0, "Protective footwear for workplace environments. Contact PPCL to confirm sizes, specifications and availability.", True),
    ("PVC Safety Boots", 0, "PVC protective boots for work environments where this footwear is required. Confirm sizing and intended use when requesting a quote.", True),
    ("Protective Hand Gloves", 0, "Hand protection options for different work tasks. State the glove type and quantity required.", True),
    ("Safety Helmets", 0, "Protective headwear for workplace safety. Ask the team to confirm available colours and specifications.", True),
    ("Reflective Hi-Vis Vests", 0, "High-visibility workwear for teams that need to be more visible. Specify colour, sizes and quantities.", False),
    ("Safety Goggles and Glasses", 0, "Eye-protection products for work environments. Include the required type and quantity in your request.", False),
    ("Hospital Scrubs", 1, "Healthcare workwear for clinical and hospital teams. Confirm available sizes, colours and fabric options.", True),
    ("Medical Tunics and Trousers", 1, "Uniform separates for healthcare staff. Request a quotation with sizes and quantities.", False),
    ("Executive Shirts", 2, "Professional shirts for office and organizational uniforms. Specify colour, sizes and any branding requirements.", True),
    ("Executive Trousers and Suits", 2, "Formal workwear for professional teams. Confirm styles, sizes and quantities with PPCL.", False),
    ("School Shirts and Blouses", 3, "School uniform tops for educational institutions. Share school colours, sizes and quantity requirements.", True),
    ("School Trousers, Skirts and Dresses", 3, "School uniform clothing for students. Request a quotation with the required designs and size breakdown.", False),
]
FAQS = [
    ("How do I request a quotation?", "Open Request a Quote, choose PPEs, Hospital Uniforms, Executive Uniforms or School Uniforms, describe the products and quantities, and submit the form. PPCL will respond using your preferred contact method."),
    ("Which products does PPCL supply?", "PPCL supplies personal protective equipment, safety footwear, gloves, overalls, masks, ear protection, eye protection, helmets, reflective workwear, rainwear and uniforms. The company also lists printing services, office equipment and stationery among its areas of business."),
    ("Are prices listed on the website?", "Please request a quotation. Prices and availability can be confirmed by the PPCL team for the products, sizes and quantities you need."),
    ("Can I request custom sizes or branded uniforms?", "Include your preferred sizes, colours, design, branding or printing requirements, and quantities in the quotation form. The team will confirm what can be supplied."),
    ("Where is PPCL located?", "PPCL has offices in Kijitonyama, Dar es Salaam, and Isamilo, Mwanza. Full postal and contact details are available in the website footer and Contact page."),
    ("How can I contact PPCL?", "Call +255 654 560 555 or +255 622 552 421, email info@pisgah.co.tz, or use the Request a Quote form. Mwanza contacts are +255 756 217497 and +255 625 834 178."),
]


def seed_defaults(sender, **kwargs):
    # Synchronize defaults so an existing starter database is converted to PPCL too.
    cats = []
    for i, (name, desc) in enumerate(CATEGORIES):
        old_names = ["Pharmaceutical Products", "Doctor Equipment", "Medical Equipment", "Other Safety Products"]
        cat = Category.objects.filter(name=name).first()
        if cat is None and i < len(old_names):
            cat = Category.objects.filter(name=old_names[i]).first()
            if cat:
                cat.name = name
                cat.slug = ""
        if cat is None:
            cat = Category(name=name)
        cat.description, cat.sort_order, cat.is_active = desc, i, True
        cat.save()
        cats.append(cat)

    # Retire any old starter categories, keeping only the four PPCL catalog categories active.
    Category.objects.exclude(pk__in=[c.pk for c in cats]).update(is_active=False)

    for name, desc, i in SERVICES:
        Service.objects.update_or_create(name=name, defaults={"description": desc, "sort_order": i, "category": cats[i], "is_active": True})
    # Update old starter services so they no longer advertise medical/pharmacy inventory.
    old_services = ["Pharmaceutical Products and Services", "Doctor Equipment", "Medical Equipment", "Other Safety Products"]
    Service.objects.filter(name__in=old_services).delete()

    Product.objects.exclude(name__in=[name for name, *_ in PRODUCTS]).delete()
    for name, idx, desc, featured in PRODUCTS:
        Product.objects.update_or_create(name=name, defaults={"category": cats[idx], "description": desc, "image_alt": name, "availability": Product.Availability.ON_REQUEST, "featured": featured, "is_published": True})
    for i, (q, a) in enumerate(FAQS):
        FAQ.objects.update_or_create(question=q, defaults={"answer": a, "sort_order": i, "is_published": True})
    # Remove obsolete healthcare FAQs from the starter dataset.
    FAQ.objects.exclude(question__in=[q for q, _ in FAQS]).delete()

    CompanyContact.objects.update_or_create(pk=1, defaults={
        "company_name": "PISGAH PINNACLE CO. LTD (PPCL)",
        "short_description": "Tanzanian-owned supplier of Personal Protective Equipment (PPE), safety gear, workwear and uniforms, with printing services, office equipment and stationery.",
        "about_text": "Pisgah Pinnacle Co. Ltd (PPCL) is a registered Tanzanian-owned private company incorporated by the Tanzania Business Registration and Licensing Agency (BRELA). PPCL deals in the supply of Safety Gears (Personal Protective Equipment) and Work Wear. PPE is a key business line; products include safety shoes, PVC boots, hand gloves, overalls, masks, ear plugs, ear muffs, safety glasses, safety goggles, helmets, hairnets and bump caps. These products are sourced mainly from South Africa, China, Taiwan, Turkey, Thailand and Kenya. PPCL also supplies reflective vests, chemical aprons, rain suits, rain coats, trousers, shirts, suits, T-shirts and polo shirts. Other listed areas include safety harnesses, safety belts, fire suits, face shields, riot gear, breathing apparatus, printing services, office equipment and stationery.",
        "mission": "To supply safety gear and practical workwear that support safer workplaces, professional teams and institutions.",
        "vision": "To be a trusted Tanzanian supplier of safety equipment, uniforms and workwear.",
        "values": "Safety-conscious supply\nProfessional service\nClear quotations and communication\nServing businesses and institutions",
        "phone": "+255 654 560 555",
        "email": "info@pisgah.co.tz",
        "whatsapp": "255654560555",
        "address": "DAR ES SALAAM: P.O. Box 6520, Ali Maua B Street / Salma Kikwete Road, Block B, Plot No. 243, Kijitonyama, Dar es Salaam, Tanzania.\nMWANZA: P.O. Box 485, Isamilo, Nyamagana District, Plot No. 33 Block D, Mwanza, Tanzania.",
        "working_hours": "",
        "map_url": "",
        "facebook": "",
        "instagram": "",
        "linkedin": "",
    })
