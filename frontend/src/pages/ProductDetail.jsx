import { Link, useParams } from "react-router-dom";
import { getProduct, getProducts } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Icon, categoryIcon } from "../components/Icons.jsx";
import ProductCard, { Availability } from "../components/ProductCard.jsx";
import { State } from "../components/State.jsx";

export default function ProductDetail() {
  const c = useCompany();
  const { slug } = useParams();
  const { data: p, loading, error } = useFetch(() => getProduct(slug), [slug]);
  const related = useFetch(() => (p ? getProducts({ category: p.category, page_size: 5 }) : Promise.resolve(null)), [p?.slug]);
  usePageTitle(p?.name || "Product", c.company_name);

  if (error?.status === 404)
    return (<section className="container section"><h1>Product not found</h1><p>This product is no longer listed.</p><p><Link className="btn" to="/products">Browse Products</Link></p></section>);

  const others = (related.data?.results || []).filter((x) => x.slug !== slug).slice(0, 4);
  const quote = p ? `/request-quote?${new URLSearchParams({ category: p.category, item: p.name })}` : "/request-quote";

  return (
    <section className="container section">
      <State loading={loading} error={error}>
        {p && (
          <>
            <nav className="crumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/products">Products</Link></li>
                <li><Link to={`/products/category/${p.category}`}>{p.category_name}</Link></li>
                <li aria-current="page">{p.name}</li>
              </ol>
            </nav>
            <div className="detail">
              <div className="detail-img">
                {p.image ? <img src={p.image} alt={p.image_alt || p.name} width="640" height="480" /> : <span className="ph"><Icon name={categoryIcon(p.category)} size={80} /></span>}
              </div>
              <div>
                <p className="meta">{p.category_name}</p>
                <h1>{p.name}</h1>
                <Availability product={p} />
                <p className="detail-desc">{p.description}</p>
                <p className="note">Price is provided in a quotation. Use the button below and we will reply.</p>
                <p className="actions"><Link className="btn" to={quote}>Request a Quote</Link><Link className="btn btn-outline" to="/contact">Ask a question</Link></p>
              </div>
            </div>
            {p.specifications.length > 0 && (
              <div className="specs-box">
                <h2>Specifications</h2>
                <dl className="specs">{p.specifications.map((s, i) => (<div key={i}>{s.label && <dt>{s.label}</dt>}<dd>{s.value}</dd></div>))}</dl>
              </div>
            )}
            {others.length > 0 && (
              <div className="related"><h2>More in {p.category_name}</h2><div className="grid">{others.map((x) => <ProductCard key={x.id} product={x} />)}</div></div>
            )}
          </>
        )}
      </State>
    </section>
  );
}
