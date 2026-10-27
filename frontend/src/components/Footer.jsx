import { Link } from "react-router-dom";
import { getCategories } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch } from "../hooks.js";
import { Icon, Logo } from "./Icons.jsx";

export default function Footer() {
  const c = useCompany();
  const { data: cats } = useFetch(getCategories, []);
  const social = [["Facebook", c.facebook], ["Instagram", c.instagram], ["LinkedIn", c.linkedin]].filter(([, u]) => u);

  return (
    <footer className="site-footer">
      <div className="container foot">
        <div>
          <p className="brand"><Logo size={30} /><span>{c.company_name}</span></p>
          <p className="foot-desc">{c.short_description}</p>
          <Link className="btn btn-light btn-sm" to="/request-quote">Request a Quote</Link>
        </div>
        <nav aria-label="Quick links">
          <h2>Quick links</h2>
          <ul>
            {[["/", "Home"], ["/about", "About Us"], ["/services", "Services"], ["/products", "Products"], ["/faq", "FAQ"], ["/contact", "Contact Us"]]
              .map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Product categories">
          <h2>Products</h2>
          <ul>{(cats || []).map((k) => <li key={k.slug}><Link to={`/products/category/${k.slug}`}>{k.name}</Link></li>)}</ul>
        </nav>
        <div>
          <h2>Contact & office locations</h2>
          <ul className="contact-mini">
            {c.phone && <li><Icon name="phone" size={16} /><a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>}
            {c.email && <li><Icon name="mail" size={16} /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
            <li className="branch-address"><Icon name="pin" size={16} /><span><strong>Dar es Salaam Office</strong><br />P.O. Box 6520, Ali Maua B Street / Salma Kikwete Road,<br />Block B, Plot No. 243, Kijitonyama, Dar es Salaam, Tanzania.<br />Tel: +255 654 560 555 | +255 622 552 421</span></li>
            <li className="branch-address"><Icon name="pin" size={16} /><span><strong>Mwanza Office</strong><br />P.O. Box 485, Isamilo, Nyamagana District,<br />Plot No. 33 Block D, Mwanza, Tanzania.<br />Tel: +255 756 217497 | +255 625 834 178<br /><a href="mailto:bomani.barnabas@pisgah.co.tz">bomani.barnabas@pisgah.co.tz</a></span></li>
            <li><Icon name="globe" size={16} /><a href="https://www.pisgah.co.tz" target="_blank" rel="noopener noreferrer">www.pisgah.co.tz</a></li>
            {c.working_hours && <li><Icon name="clock" size={16} />{c.working_hours}</li>}
            {social.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="container copy">&copy; {new Date().getFullYear()} {c.company_name}. All rights reserved.</p>
      <div className="dock-space" aria-hidden="true" />
    </footer>
  );
}
