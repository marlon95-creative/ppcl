import { Icon } from "./Icons.jsx";

export function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label} <span className="req">{required ? "(required)" : "(optional)"}</span></label>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && <p className="error" id={`${id}-err`}><Icon name="alert" size={16} />{error}</p>}
    </div>
  );
}

export const ariaFor = (name, errors, hasHint = false) => ({
  id: name, name,
  "aria-invalid": errors[name] ? "true" : undefined,
  "aria-describedby": [errors[name] && `${name}-err`, hasHint && `${name}-hint`].filter(Boolean).join(" ") || undefined,
});
