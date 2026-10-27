import { Link } from "react-router-dom";
import { Icon, categoryIcon } from "./Icons.jsx";

const CATEGORY_PHOTOS = {
  ppes: "https://images.unsplash.com/photo-1584467735871-bf9f7c4a4b75?auto=format&fit=crop&w=900&q=80",
  "hospital-uniforms": "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=80",
  "executive-uniforms": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80",
  "school-uniforms": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
};
const AV_ICON = { in_stock: "check", limited: "alert", on_request: "clock", unavailable: "x" };

export function Availability({ product }) {
  return <span className={`badge av-${product.availability}`}><Icon name={AV_ICON[product.availability] || "clock"} size={14} />{product.availability_label}</span>;
}

export default function ProductCard({ product }) {
  const quote = `/request-quote?${new URLSearchParams({ category: product.category, item: product.name })}`;
  return (
    <article className="card product">
      <Link to={`/products/${product.slug}`} className="thumb" tabIndex={-1} aria-hidden="true">
        {product.image || CATEGORY_PHOTOS[product.category]
          ? <img src={product.image || CATEGORY_PHOTOS[product.category]} alt={product.image_alt || `${product.category_name} product`} loading="lazy" width="400" height="300" />
          : <span className="ph"><Icon name={categoryIcon(product.category)} size={44} /></span>}
      </Link>
      <div className="card-body">
        <p className="meta">{product.category_name}</p>
        <h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
        <p className="clamp">{product.description}</p>
        <Availability product={product} />
        <div className="actions">
          <Link className="btn btn-sm" to={quote} aria-label={`Request a quote for ${product.name}`}>Request a Quote</Link>
          <Link className="btn btn-sm btn-outline" to={`/products/${product.slug}`} aria-label={`View details of ${product.name}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}
