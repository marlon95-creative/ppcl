import { Link } from "react-router-dom";
import { useCompany } from "../company.jsx";
import { usePageTitle } from "../hooks.js";
import { Icon } from "../components/Icons.jsx";

export default function About() {
  const c = useCompany();
  usePageTitle("About Us", c.company_name);
  return (
    <>
      <div className="page-head"><div className="container"><h1>About {c.company_name}</h1><p className="lead">Tanzanian-owned supplier of safety equipment, uniforms and workwear.</p></div></div>
      <section className="container section about">
        <div className="prose">
          <h2>Who we are</h2>
          <p>{c.about_text}</p>
          <h2>Our product range</h2>
          <p>Our key business line is Personal Protective Equipment (PPE), including safety shoes, PVC boots, hand gloves, overalls, masks, ear plugs, ear muffs, safety glasses, safety goggles, helmets, hairnets and bump caps. We also supply reflective vests, chemical aprons, rain suits, rain coats, trousers, shirts, suits, T-shirts and polo shirts. Other areas include safety harnesses, safety belts, fire suits, face shields, riot gear, breathing apparatus, printing services, office equipment and stationery.</p>
        </div>
        <aside className="facts">
          {c.mission && <div><h2>Mission</h2><p>{c.mission}</p></div>}
          {c.vision && <div><h2>Vision</h2><p>{c.vision}</p></div>}
          {c.values.length > 0 && <div><h2>Values</h2><ul className="ticks">{c.values.map((v) => <li key={v}><Icon name="check" size={18} />{v}</li>)}</ul></div>}
        </aside>
      </section>
      <section className="container section"><p className="actions"><Link className="btn" to="/request-quote">Request a Quote</Link><Link className="btn btn-outline" to="/products">Browse Products</Link></p></section>
    </>
  );
}
