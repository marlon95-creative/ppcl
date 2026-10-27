import { Link } from "react-router-dom";
import { getServices } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Icon, categoryIcon } from "../components/Icons.jsx";
import { State } from "../components/State.jsx";

export default function Services() {
  const c = useCompany();
  usePageTitle("Services", c.company_name);
  const { data, loading, error } = useFetch(getServices, []);
  return (
    <>
      <div className="page-head"><div className="container"><h1>Services</h1><p className="lead">PPE, hospital uniforms, executive uniforms and school uniforms, plus related safety and workwear supplies.</p></div></div>
      <section className="container section">
        <State loading={loading} error={error} empty={data && !data.length}>
          <div className="zig">
            {(data || []).map((s) => (
              <article className="zig-row" key={s.id}>
                <div className="zig-art" aria-hidden={!s.image}>
                  {s.image ? <img src={s.image} alt="" loading="lazy" /> : <Icon name={categoryIcon(s.category || "")} size={64} />}
                </div>
                <div>
                  <h2>{s.name}</h2>
                  <p>{s.description}</p>
                  <p className="actions">
                    <Link className="btn" to={`/request-quote${s.category ? `?category=${s.category}` : ""}`}>Request a Quote</Link>
                    {s.category && <Link className="btn btn-outline" to={`/products/category/${s.category}`}>View Products</Link>}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </State>
      </section>
    </>
  );
}
