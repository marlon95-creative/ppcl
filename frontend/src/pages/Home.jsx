import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, getProducts, getServices } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Icon, categoryIcon } from "../components/Icons.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { State } from "../components/State.jsx";

const sectors = ["Industrial and construction workplaces", "Hospitals and healthcare teams", "Businesses and offices", "Schools and educational institutions", "Organizations requiring branded workwear", "Public and private institutions"];
const reasons = [
  ["Safety-first supply", "PPE, safety footwear, protective clothing and workwear for different workplace needs."],
  ["Uniform solutions", "Hospital, executive and school uniform categories for teams and institutions."],
  ["Quotation-led service", "Tell us the product, size, specifications and quantity to receive a tailored quotation."],
  ["Tanzanian-owned company", "A registered Tanzanian-owned supplier serving organizations and businesses."],
];

function QuickQuote({ categories }) {
  const nav = useNavigate();
  const [cat, setCat] = useState("");
  return (
    <form className="quick" onSubmit={(e) => { e.preventDefault(); nav(`/request-quote${cat ? `?category=${cat}` : ""}`); }}>
      <h2>Start a quote</h2>
      <label htmlFor="quick-cat">What do you need?</label>
      <select id="quick-cat" value={cat} onChange={(e) => setCat(e.target.value)}>
        <option value="">Choose a category</option>
        {(categories || []).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        <option value="other">Other / not sure</option>
      </select>
      <button className="btn btn-block" type="submit">Continue to Request a Quote</button>
    </form>
  );
}

export default function Home() {
  const c = useCompany();
  usePageTitle("", c.company_name);
  const cats = useFetch(getCategories, []);
  const services = useFetch(getServices, []);
  const featured = useFetch(() => getProducts({ featured: "1", page_size: 4 }), []);
  const products = featured.data?.results || [];

  return (
    <>
      <section className="hero">
        <svg className="pulse" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70h250l30-45 40 90 35-70 25 25h420" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
        <div className="container hero-grid">
          <div>
            <h1>Safety gear, PPE and uniforms for work and institutions</h1>
            <p className="lead">{c.short_description || "Safety gear, PPE, hospital uniforms, executive uniforms and school uniforms."}</p>
            <p className="actions">
              <Link className="btn btn-light" to="/request-quote">Request a Quote</Link>
              <Link className="btn btn-ghost" to="/products">Browse Products</Link>
            </p>
          </div>
          <QuickQuote categories={cats.data} />
        </div>
      </section>

      <section className="container tiles-wrap" aria-labelledby="cat-h">
        <h2 id="cat-h" className="sr-only">Product categories</h2>
        <State loading={cats.loading} error={cats.error} empty={cats.data && !cats.data.length}>
          <ul className="tiles">
            {(cats.data || []).map((k) => (
              <li key={k.slug}>
                <Link to={`/products/category/${k.slug}`} className="tile">
                  <span className="tile-icon"><Icon name={categoryIcon(k.slug)} size={26} /></span>
                  <strong>{k.name}</strong>
                  <span>{k.description}</span>
                  <span className="tile-go">{k.product_count} {k.product_count === 1 ? "product" : "products"} <Icon name="arrow" size={16} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </State>
      </section>

      <section className="container section intro">
        <h2>Who we are</h2>
        <p className="measure">{c.about_text}</p>
        <p><Link to="/about">About {c.company_name}</Link></p>
      </section>

      <section className="band">
        <div className="container section">
          <h2>Our services</h2>
          <State loading={services.loading} error={services.error} empty={services.data && !services.data.length}>
            <div className="grid g2">
              {(services.data || []).map((s) => (
                <article className="card row-card" key={s.id}>
                  <span className="tile-icon"><Icon name={categoryIcon(s.category || "")} size={26} /></span>
                  <div>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <Link to={`/request-quote${s.category ? `?category=${s.category}` : ""}`}>Request a Quote for this</Link>
                  </div>
                </article>
              ))}
            </div>
          </State>
        </div>
      </section>

      {(featured.loading || featured.error || products.length > 0) && (
        <section className="container section">
          <h2>Selected products</h2>
          <State loading={featured.loading} error={featured.error}>
            <div className="grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </State>
          <p><Link className="btn btn-outline" to="/products">View all products</Link></p>
        </section>
      )}

      <section className="band">
        <div className="container section">
          <h2>Why choose us</h2>
          <div className="grid g4">
            {reasons.map(([t, d]) => (<div className="reason" key={t}><h3>{t}</h3><p>{d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Who we serve</h2>
        <ul className="chips-static">{sectors.map((s) => <li key={s}><Icon name="check" size={16} />{s}</li>)}</ul>
      </section>

      <section className="cta">
        <div className="container cta-in">
          <div><h2>Need a quotation?</h2><p>Tell us the products, sizes and quantities you need. Our team will respond with a quotation.</p></div>
          <Link className="btn btn-light" to="/request-quote">Request a Quote</Link>
        </div>
      </section>

      <section className="container section contact-sum" aria-labelledby="cs-h">
        <h2 id="cs-h">Contact us</h2>
        <ul className="sum-list">
          {c.phone && <li><Icon name="phone" /><a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>}
          {c.email && <li><Icon name="mail" /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
          {c.address && <li><Icon name="pin" />{c.address}</li>}
          {c.working_hours && <li><Icon name="clock" />{c.working_hours}</li>}
          {!c.phone && !c.email && !c.address && <li>Contact details are added by the company in the admin area.</li>}
        </ul>
        <Link className="btn btn-outline" to="/contact">Contact Us</Link>
      </section>
    </>
  );
}
