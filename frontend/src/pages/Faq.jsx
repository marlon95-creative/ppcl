import { Link } from "react-router-dom";
import { getFaqs } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Icon } from "../components/Icons.jsx";
import { State } from "../components/State.jsx";

export default function Faq() {
  const c = useCompany();
  usePageTitle("FAQ", c.company_name);
  const { data, loading, error } = useFetch(getFaqs, []);
  return (
    <>
      <div className="page-head"><div className="container"><h1>Frequently asked questions</h1><p className="lead">Quotations, products, delivery and how to reach us.</p></div></div>
      <section className="container section narrow">
        <State loading={loading} error={error} empty={data && !data.length} emptyText="Questions will appear here soon.">
          <div className="faq">
            {(data || []).map((f) => (
              <details key={f.id}>
                <summary>{f.question}<Icon name="chevron" size={20} /></summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </State>
        <p className="note">Can't find your answer? <Link to="/contact">Contact us</Link> or <Link to="/request-quote">request a quote</Link>.</p>
      </section>
    </>
  );
}
