import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { usePageTitle } from "./hooks.js";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import RequestQuote from "./pages/RequestQuote.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";

function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="container section">
      <h1>Page not found</h1>
      <p>The page you opened does not exist.</p>
      <p className="actions"><Link className="btn" to="/">Go to Home</Link><Link className="btn btn-outline" to="/products">Browse Products</Link></p>
    </section>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const main = useRef(null);
  useEffect(() => { window.scrollTo(0, 0); main.current?.focus({ preventScroll: true }); }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/category/:category" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {pathname !== "/request-quote" && (
        <div className="dock"><Link className="btn btn-block" to="/request-quote">Request a Quote</Link></div>
      )}
    </>
  );
}
