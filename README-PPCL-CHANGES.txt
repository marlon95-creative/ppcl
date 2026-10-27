PISGAH PINNACLE CO. LTD (PPCL) website update

What changed
- Rebranded the starter safety/medical supplier site for Pisgah Pinnacle Co. Ltd (PPCL).
- Added the supplied PPCL logo at frontend/public/images/ppcl-logo.jpg and used it in the header and footer.
- Replaced seeded categories with PPEs, Hospital Uniforms, Executive Uniforms and School Uniforms.
- Updated default products, services, FAQs and company profile seed content.
- Added category-specific product photo fallbacks to product cards. These photo URLs are loaded from Unsplash, so the browser needs internet access to display the fallback photos. Product images uploaded in Django Admin take precedence.
- Updated company profile, About and Services copy and the green colour theme to align with the logo.
- Updated footer with the full Dar es Salaam and Mwanza office addresses, phone numbers, email and website.
- Kept the existing React/Django APIs and quotation form workflow; category choices come from the active catalog API.

Product categories / seeded products
- PPEs: safety shoes, PVC safety boots, gloves, helmets, reflective hi-vis vests, safety goggles and glasses.
- Hospital Uniforms: hospital scrubs, medical tunics and trousers.
- Executive Uniforms: executive shirts, trousers and suits.
- School Uniforms: school shirts, blouses, trousers, skirts and dresses.

Important backend note
The catalog seed runs after Django migrations via the existing post_migrate signal. When the backend is next migrated, the seed synchronizes the PPCL categories, products, services, FAQs and company profile. Back up any existing catalog records before running against a production database because old starter products and FAQs are removed and old categories are deactivated/renamed.

Company details in footer
Dar es Salaam: P.O. Box 6520, Ali Maua B Street / Salma Kikwete Road, Block B, Plot No. 243, Kijitonyama, Dar es Salaam - Tanzania. Tel: +255 654 560 555 | +255 622 552 421.
Mwanza: P.O. Box 485, Isamilo, Nyamagana District, Plot No. 33 Block D, Mwanza - Tanzania. Tel: +255 756 217497 | +255 625 834 178. Email: bomani.barnabas@pisgah.co.tz.
General email: info@pisgah.co.tz. Website: www.pisgah.co.tz.

Build check
A frontend build was not confirmed in this environment because npm install did not finish before the execution timeout. Run `cd frontend && npm install && npm run build` on a machine with internet access to verify the production build.
