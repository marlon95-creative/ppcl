import { useRef, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, submitQuote } from "../api.js";
import { useCompany } from "../company.jsx";
import { useFetch, usePageTitle } from "../hooks.js";
import { Field, ariaFor } from "../components/Field.jsx";
import { Icon } from "../components/Icons.jsx";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s\-().]{6,19}$/;
const OK_EXT = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"];
const MAX_BYTES = 5 * 1024 * 1024;
const CLIENT_TYPES = [["hospital", "Hospital"], ["clinic", "Clinic"], ["medical_centre", "Medical Centre"], ["pharmacy", "Pharmacy"],
  ["professional", "Doctor / Professional"], ["organization", "Organization"], ["other", "Other"]];
const UNITS = ["Pieces", "Boxes", "Packs", "Cartons", "Sets", "Units"];
const blank = { full_name: "", organization: "", email: "", phone: "", client_type: "", category: "", requested_item: "", quantity: "",
  unit: "", message: "", preferred_contact_method: "", consent: false, website: "" };

function validate(v, file) {
  const e = {};
  if (!v.full_name.trim()) e.full_name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address, for example name@example.com.";
  if (!v.phone.trim()) e.phone = "Enter a phone number we can call.";
  else if (!PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number, for example +255 700 000 000.";
  if (!v.client_type) e.client_type = "Choose the type that describes you.";
  if (!v.category) e.category = "Choose a category, or 'Other / not sure'.";
  if (!v.requested_item.trim()) e.requested_item = "Enter the product or service you need.";
  if (v.quantity && (!/^\d+$/.test(v.quantity) || +v.quantity < 1)) e.quantity = "Enter a whole number of 1 or more.";
  if (!v.consent) e.consent = "Tick the box to confirm before sending.";
  if (file) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!OK_EXT.includes(ext)) e.attachment = "Upload a PDF, image (JPG or PNG), Word or Excel file.";
    else if (file.size > MAX_BYTES) e.attachment = "The file is larger than 5 MB. Upload a smaller file.";
  }
  return e;
}

export default function RequestQuote() {
  const company = useCompany();
  usePageTitle("Request a Quote", company.company_name);
  const [params] = useSearchParams();
  const cats = useFetch(getCategories, []);
  const [v, setV] = useState(() => ({ ...blank, category: params.get("category") || "", requested_item: params.get("item") || "" }));
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [reference, setReference] = useState("");
  const summary = useRef(null);
  const fileInput = useRef(null);
  useEffect(() => { if (formError) summary.current?.focus(); }, [formError, errors]);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((x) => ({ ...x, [k]: val }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const a = (k, hint) => ariaFor(k, errors, !!hint);

  async function onSubmit(ev) {
    ev.preventDefault();
    if (status === "sending") return;
    const ce = validate(v, file);
    if (Object.keys(ce).length) {
      setErrors(ce); setFormError("Some details need fixing. Check the highlighted fields.");
      requestAnimationFrame(() => document.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus());
      return;
    }
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => {
      if (k === "consent") return fd.append("consent", val ? "true" : "false");
      if (k === "category" && val === "other") return;
      if (String(val).trim() !== "") fd.append(k, String(val).trim());
    });
    if (file) fd.append("attachment", file);
    setStatus("sending"); setFormError("");
    try { const r = await submitQuote(fd); setReference(r.reference); setStatus("done"); }
    catch (err) {
      setStatus("idle");
      const fe = {}; Object.entries(err.fieldErrors || {}).forEach(([k, m]) => (fe[k] = Array.isArray(m) ? m[0] : String(m)));
      setErrors(fe); setFormError(err.message);
    }
  }

  function reset() { setV(blank); setFile(null); setErrors({}); setFormError(""); setStatus("idle"); if (fileInput.current) fileInput.current.value = ""; }

  if (status === "done") {
    return (
      <section className="container section narrow">
        <div className="notice success" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
          <h1>Request received</h1>
          <p>Thank you, {v.full_name.split(" ")[0]}. We will review your request and reply with a quotation.</p>
          <p>Your reference number: <strong className="ref">{reference}</strong></p>
          <p className="hint">A confirmation was sent to {v.email}. Keep the reference number if you contact us.</p>
        </div>
        <p className="actions"><button type="button" className="btn" onClick={reset}>Send another request</button><Link className="btn btn-outline" to="/products">Browse Products</Link></p>
      </section>
    );
  }

  const sending = status === "sending";
  const list = Object.entries(errors).filter(([, m]) => m);
  const catOptions = cats.data || [];
  const known = !v.category || v.category === "other" || catOptions.some((k) => k.slug === v.category);

  return (
    <>
      <div className="page-head"><div className="container"><h1>Request a Quote</h1><p className="lead">Tell us what you need and how many. We reply with a quotation.</p></div></div>
      <div className="container section quote-grid">
        <div>
          {formError && (
            <div className="notice error-box" role="alert" tabIndex={-1} ref={summary}>
              <strong>{formError}</strong>
              {list.length > 0 && <ul>{list.map(([k, m]) => <li key={k}>{m}</li>)}</ul>}
            </div>
          )}
          <form onSubmit={onSubmit} noValidate aria-busy={sending}>
            <fieldset disabled={sending}>
              <legend>About you</legend>
              <div className="row">
                <Field id="full_name" label="Your full name" required error={errors.full_name}><input type="text" autoComplete="name" {...a("full_name")} value={v.full_name} onChange={set("full_name")} maxLength={120} /></Field>
                <Field id="organization" label="Organization name" error={errors.organization}><input type="text" autoComplete="organization" {...a("organization")} value={v.organization} onChange={set("organization")} maxLength={150} /></Field>
              </div>
              <div className="row">
                <Field id="email" label="Email address" required error={errors.email}><input type="email" inputMode="email" autoComplete="email" {...a("email")} value={v.email} onChange={set("email")} maxLength={254} /></Field>
                <Field id="phone" label="Phone number" required error={errors.phone}><input type="tel" inputMode="tel" autoComplete="tel" {...a("phone")} value={v.phone} onChange={set("phone")} maxLength={25} /></Field>
              </div>
              <div className="row">
                <Field id="client_type" label="Client type" required error={errors.client_type}>
                  <select {...a("client_type")} value={v.client_type} onChange={set("client_type")}>
                    <option value="">Choose one</option>{CLIENT_TYPES.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
                  </select>
                </Field>
                <Field id="preferred_contact_method" label="Preferred contact method" error={errors.preferred_contact_method}>
                  <select {...a("preferred_contact_method")} value={v.preferred_contact_method} onChange={set("preferred_contact_method")}>
                    <option value="">No preference</option><option value="phone">Phone</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option>
                  </select>
                </Field>
              </div>
            </fieldset>

            <fieldset disabled={sending}>
              <legend>What you need</legend>
              <Field id="category" label="Product or service category" required error={errors.category}>
                <select {...a("category")} value={v.category} onChange={set("category")}>
                  <option value="">Choose a category</option>
                  {!known && <option value={v.category}>{v.category}</option>}
                  {catOptions.map((k) => <option key={k.slug} value={k.slug}>{k.name}</option>)}
                  <option value="other">Other / not sure</option>
                </select>
              </Field>
              <Field id="requested_item" label="Product or service name, or description" required error={errors.requested_item}>
                <input type="text" {...a("requested_item")} value={v.requested_item} onChange={set("requested_item")} maxLength={200} />
              </Field>
              <div className="row">
                <Field id="quantity" label="Quantity required" error={errors.quantity}><input type="text" inputMode="numeric" {...a("quantity")} value={v.quantity} onChange={set("quantity")} maxLength={7} /></Field>
                <Field id="unit" label="Preferred unit" error={errors.unit}>
                  <input type="text" list="units" {...a("unit")} value={v.unit} onChange={set("unit")} maxLength={40} placeholder="For example: Boxes" />
                  <datalist id="units">{UNITS.map((u) => <option key={u} value={u} />)}</datalist>
                </Field>
              </div>
              <Field id="message" label="Additional requirements or message" error={errors.message} hint="Sizes, brands you prefer, delivery location, timing.">
                <textarea rows={5} {...a("message", true)} value={v.message} onChange={set("message")} maxLength={3000} />
              </Field>
              <Field id="attachment" label="Attachment" error={errors.attachment} hint="A specification list or purchase requirement. PDF, JPG, PNG, Word or Excel, up to 5 MB.">
                <input type="file" ref={fileInput} {...a("attachment", true)} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => { setFile(e.target.files[0] || null); setErrors((x) => ({ ...x, attachment: undefined })); }} />
              </Field>
            </fieldset>

            <div className={`field consent ${errors.consent ? "has-error" : ""}`}>
              <label className="check">
                <input type="checkbox" id="consent" name="consent" checked={v.consent} onChange={set("consent")} disabled={sending}
                  aria-invalid={errors.consent ? "true" : undefined} aria-describedby={errors.consent ? "consent-err" : undefined} />
                <span>I confirm the details are correct and agree that the company may contact me about this request. <span className="req">(required)</span></span>
              </label>
              {errors.consent && <p className="error" id="consent-err"><Icon name="alert" size={16} />{errors.consent}</p>}
            </div>

            <div className="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} /></label></div>
            <button type="submit" className="btn btn-block" disabled={sending}>{sending ? <><span className="spinner" aria-hidden="true" /> Sending your request…</> : "Send request"}</button>
            <p className="sr-only" role="status">{sending ? "Sending your request" : ""}</p>
          </form>
        </div>

        <aside className="side">
          <h2>What happens next</h2>
          <ol className="steps">
            <li>You send this form.</li>
            <li>You get a reference number and a confirmation email.</li>
            <li>The team reviews your request.</li>
            <li>We reply with a quotation through your preferred contact method.</li>
          </ol>
          {(company.phone || company.email) && (
            <>
              <h2>Prefer to talk?</h2>
              <ul className="sum-list">
                {company.phone && <li><Icon name="phone" size={18} /><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></li>}
                {company.email && <li><Icon name="mail" size={18} /><a href={`mailto:${company.email}`}>{company.email}</a></li>}
              </ul>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
