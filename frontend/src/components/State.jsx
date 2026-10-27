import { Link } from "react-router-dom";

/** One place for loading / error / empty states, used by every data-driven section. */
export function State({ loading, error, empty, emptyText, children }) {
  if (loading) return <div className="state" role="status"><span className="spinner dark" aria-hidden="true" /> Loading…</div>;
  if (error) return <div className="state" role="alert"><strong>This could not be loaded.</strong> Check your connection and refresh the page, or <Link to="/contact">contact us</Link>.</div>;
  if (empty) return <div className="state">{emptyText || "Nothing to show yet."}</div>;
  return children;
}
