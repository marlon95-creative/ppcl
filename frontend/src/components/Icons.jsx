const P = {
  pill: <><rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" /><path d="M9 15l6-6" /></>,
  stethoscope: <><path d="M6 3v6a4 4 0 008 0V3" /><path d="M10 13v2a4 4 0 008 0v-1" /><circle cx="18" cy="12" r="2" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M6.5 11H10l1.5-3 2 6 1.5-3h2.5M9 21h6" /></>,
  shield: <><path d="M12 3l8 3v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  alert: <><circle cx="12" cy="12" r="10" /><path d="M12 7v6M12 17h.01" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{P[name] || P.cross}</svg>
  );
}

export function categoryIcon(slug = "") {
  if (slug.includes("ppe")) return "shield";
  if (slug.includes("hospital")) return "cross";
  if (slug.includes("executive")) return "check";
  if (slug.includes("school")) return "monitor";
  return "cross";
}

export function Logo({ size = 42 }) {
  return <img className="company-logo" src="/images/ppcl-logo.jpg" width={size} height={size} alt="Pisgah Pinnacle Co. Ltd logo" />;
}
