import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { getCategories, getProducts } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Icon } from "../components/Icons.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { State } from "../components/State.jsx";

export default function Products() {
  const c = useCompany();
  const { category } = useParams();
  const cats = useFetch(getCategories, []);
  const current = cats.data?.find((k) => k.slug === category);
  usePageTitle(current ? current.name : "Products", c.company_name);

  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");
  const [s, setS] = useState({ items: [], count: 0, page: 1, hasMore: false, loading: true, error: false, moreLoading: false, moreError: false });

  useEffect(() => { const t = setTimeout(() => setQ(term.trim()), 350); return () => clearTimeout(t); }, [term]);

  const params = (page) => ({ ...(category && { category }), ...(q && { q }), ...(page > 1 && { page }) });

  useEffect(() => {
    let live = true;
    setS((x) => ({ ...x, loading: true, error: false, items: [] }));
    getProducts(params(1))
      .then((d) => live && setS({ items: d.results, count: d.count, page: 1, hasMore: !!d.next, loading: false, error: false, moreLoading: false, moreError: false }))
      .catch(() => live && setS((x) => ({ ...x, loading: false, error: true })));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, q]);

  async function loadMore() {
    setS((x) => ({ ...x, moreLoading: true, moreError: false }));
    try {
      const d = await getProducts(params(s.page + 1));
      setS((x) => ({ ...x, items: [...x.items, ...d.results], page: x.page + 1, hasMore: !!d.next, moreLoading: false }));
    } catch { setS((x) => ({ ...x, moreLoading: false, moreError: true })); }
  }

  const title = current ? current.name : "All products";
  return (
    <>
      <div className="page-head"><div className="container"><h1>{title}</h1><p className="lead">{current?.description || "Browse by category, then ask for a quotation."}</p></div></div>
      <div className="container section catalog">
        <aside className="filters" aria-label="Filter products">
          <div className="search">
            <label htmlFor="psearch">Search products</label>
            <div className="search-box"><Icon name="search" size={18} /><input id="psearch" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Name or keyword" maxLength={100} /></div>
          </div>
          <nav aria-label="Product categories">
            <h2>Categories</h2>
            <ul>
              <li><NavLink to="/products" end>All products</NavLink></li>
              {(cats.data || []).map((k) => (
                <li key={k.slug}><NavLink to={`/products/category/${k.slug}`}>{k.name} <span className="count">{k.product_count}</span></NavLink></li>
              ))}
            </ul>
          </nav>
        </aside>

        <div>
          <p className="result-count" role="status" aria-live="polite">{!s.loading && !s.error ? `${s.count} ${s.count === 1 ? "product" : "products"}${q ? ` matching "${q}"` : ""}` : ""}</p>
          <State loading={s.loading} error={s.error} empty={!s.items.length}
            emptyText={<>No products match. {q ? "Try a different word, " : ""}<Link to="/request-quote">or send a quote request</Link> and tell us what you need.</>}>
            <div className="grid">{s.items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            {s.moreError && <p className="error" role="alert"><Icon name="alert" size={16} />More products could not be loaded. Try again.</p>}
            {s.hasMore && (
              <p className="center"><button type="button" className="btn btn-outline" onClick={loadMore} disabled={s.moreLoading}>
                {s.moreLoading ? "Loading…" : "Show more products"}</button></p>
            )}
          </State>
        </div>
      </div>
    </>
  );
}
