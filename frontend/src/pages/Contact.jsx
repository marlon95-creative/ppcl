import { useState } from "react";
import { Link } from "react-router-dom";
import { submitContact } from "../api.js";
import { useCompany } from "../company.jsx";
import { usePageTitle } from "../hooks.js";
import { Field, ariaFor } from "../components/Field.jsx";
import { Icon } from "../components/Icons.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s\-().]{6,19}$/;
const blank = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export default function Contact() {
  const c = useCompany();
  usePageTitle("Contact Us", c.company_name);
  const [v, setV] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const set = (k) => (e) => { setV((x) => ({ ...x, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })); };

  async function onSubmit(ev) {
    ev.preventDefault();
    if (status === "sending") return;
    const e = {};
    if (!v.name.trim()) e.name = "Enter your name.";
    if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, for example name@example.com.";
    if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number, for example +255 700 000 000.";
    if (v.message.trim().length < 5) e.message = "Write your message (at least 5 characters).";
    if (Object.keys(e).length) { setErrors(e); setFormError("Some details need fixing. Check the highlighted fields."); return; }
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => val.trim() && fd.append(k, val.trim()));
    setStatus("sending"); setFormError("");
    try { await submitContact(fd); setStatus("done"); setV(blank); }
    catch (err) {
      setStatus("idle"); setFormError(err.message);
      const fe = {}; Object.entries(err.fieldErrors || {}).forEach(([k, m]) => (fe[k] = Array.isArray(m) ? m[0] : String(m))); setErrors(fe);
    }
  }

  const rows = [
    c.phone && ["phone", "Phone", <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>],
    c.email && ["mail", "Email", <a href={`mailto:${c.email}`}>{c.email}</a>],
    c.whatsapp && ["phone", "WhatsApp", <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>],
    c.address && ["pin", "Address", c.address],
    c.working_hours && ["clock", "Working hours", c.working_hours],
  ].filter(Boolean);

  return (
    <>
      <div className="page-head"><div className="container"><h1>Contact us</h1><p className="lead">Call, email or send us a message.</p></div></div>
      <section className="container section contact-grid">
        <div>
          <h2>Our details</h2>
          {rows.length === 0 && <p>Contact details are added by the company in the admin area.</p>}
          <dl className="contact-list">{rows.map(([ic, k, val]) => (<div key={k}><dt><Icon name={ic} size={18} />{k}</dt><dd>{val}</dd></div>))}</dl>
          {c.map_url && <p><a className="btn btn-outline" href={c.map_url} target="_blank" rel="noopener noreferrer">Open map</a></p>}
          <p>Looking for a price? <Link to="/request-quote">Request a Quote</Link>.</p>
        </div>

        <div>
          <h2>Send a message</h2>
          {status === "done" ? (
            <div className="notice success" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
              <strong>Message sent.</strong> Thank you. We will reply as soon as we can.
              <p><button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus("idle")}>Send another message</button></p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-busy={status === "sending"}>
              {formError && <div className="notice error-box" role="alert"><strong>{formError}</strong></div>}
              <Field id="name" label="Your name" required error={errors.name}><input type="text" autoComplete="name" {...ariaFor("name", errors)} value={v.name} onChange={set("name")} maxLength={120} /></Field>
              <div className="row">
                <Field id="email" label="Email address" required error={errors.email}><input type="email" inputMode="email" autoComplete="email" {...ariaFor("email", errors)} value={v.email} onChange={set("email")} /></Field>
                <Field id="phone" label="Phone number" error={errors.phone}><input type="tel" inputMode="tel" autoComplete="tel" {...ariaFor("phone", errors)} value={v.phone} onChange={set("phone")} maxLength={25} /></Field>
              </div>
              <Field id="subject" label="Subject" error={errors.subject}><input type="text" {...ariaFor("subject", errors)} value={v.subject} onChange={set("subject")} maxLength={150} /></Field>
              <Field id="message" label="Message" required error={errors.message}><textarea rows={5} {...ariaFor("message", errors)} value={v.message} onChange={set("message")} maxLength={3000} /></Field>
              <div className="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} /></label></div>
              <button className="btn btn-block" type="submit" disabled={status === "sending"}>{status === "sending" ? <><span className="spinner" aria-hidden="true" /> Sending…</> : "Send message"}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
