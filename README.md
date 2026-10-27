# Safety Company (Medical & Healthcare): React + Django

Frontend: React (Vite) in `frontend/`. Backend: Django + Django REST Framework in `backend/`.

## Run it locally
**Backend** (Python 3.11+)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                    # edit values
python manage.py makemigrations catalog quotes
python manage.py migrate                                # also creates the 4 starter categories, services, FAQs
python manage.py createsuperuser                        # you choose the admin username and password
python manage.py runserver                              # http://localhost:8000/admin/
```
**Frontend** (Node 18+)
```bash
cd frontend
npm install
npm run dev                                             # http://localhost:5173
```

## Managing the site (`/admin/`)
- **Dashboard**: new / in-review / responded requests, unread messages, published vs unpublished products, latest requests.
- **Products and Categories**: add real products (image, description, `Label: value` specification lines, availability, featured, publish/unpublish). The website shows nothing that is not entered here.
- **Quote requests**: filter by status, client type, category and date; mark In Review / Responded / Closed; record the response; download attachments (staff only).
- **Company information**: name, description, About text, mission, vision, values, phone, email, WhatsApp, address, hours, map and social links. These feed the header, footer, Home, About and Contact pages.
- **Services, FAQs, Contact messages**.
- Use Django **Groups** to give staff limited roles (e.g. view/change quote requests only).

## Colours
Combat Green is set as `#4B6B2F` and the lighter variant as `#86A95B` at the top of `frontend/src/styles.css` (`--green`, `--green-light`, `--grad`). Change those tokens if the company has an exact brand value.

## Layout notes
Different from the purple site: utility top bar with contact details, sticky gradient header with a Request a Quote button, hero with a "Start a quote" panel, category tiles overlapping the hero, filter sidebar on the catalogue, product detail pages, zig-zag services, FAQ accordion, two-column quote page with a "What happens next" panel, and a Request a Quote bar fixed to the bottom of the screen on phones.

## Production notes
Set `DJANGO_DEBUG=0`, a long `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, PostgreSQL and SMTP variables. Run `npm run build`, serve `frontend/dist` on the same domain and proxy `/api`, `/admin`, `/media` to gunicorn (or set `VITE_API_URL` and `CORS_ALLOWED_ORIGINS`). Run `collectstatic`. `private_media/` (client attachments) must never be web-served.

## Not included
TypeScript (plain JavaScript is used), automated tests, cloud file storage, and API caching beyond the browser. Starter text (About, FAQs, "Why choose us") is generic: review it before launch.
