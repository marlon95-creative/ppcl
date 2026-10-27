import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCompany } from "../company.jsx";
import { useTheme } from "../theme.jsx";
import { Icon, Logo } from "./Icons.jsx";

const links = [["/", "Home"], ["/about", "About Us"], ["/services", "Services"], ["/products", "Products"], ["/faq", "FAQ"], ["/contact", "Contact Us"]];

export default function Header() {
  const c = useCompany();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  const dark = theme === "dark";

  return (
    <>
      <div className="topbar">
        <div className="container topbar-in">
          {c.phone && <a href={`tel:${c.phone.replace(/\s/g, "")}`}><Icon name="phone" size={16} />{c.phone}</a>}
          {c.email && <a href={`mailto:${c.email}`}><Icon name="mail" size={16} />{c.email}</a>}
          {c.working_hours && <span><Icon name="clock" size={16} />{c.working_hours}</span>}
        </div>
      </div>
      <header className="mainbar">
        <div className="container bar">
          <Link to="/" className="brand" aria-label={`${c.company_name} home`}><Logo size={52} /><span>{c.company_name}</span></Link>

          <nav id="primary-nav" className={`nav ${open ? "open" : ""}`} aria-label="Main">
            <ul>
              {links.map(([to, label]) => (
                <li key={to}><NavLink to={to} end={to === "/"}>{label}</NavLink></li>
              ))}
            </ul>
            <Link className="btn btn-light nav-quote" to="/request-quote">Request a Quote</Link>
          </nav>

          <div className="tools">
            <button type="button" className="icon-btn" onClick={toggle} aria-pressed={dark}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              <Icon name={dark ? "sun" : "moon"} size={20} />
            </button>
            <Link className="btn btn-light btn-sm head-quote" to="/request-quote">Request a Quote</Link>
            <button type="button" className="icon-btn menu-btn" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? "x" : "menu"} size={22} /><span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
