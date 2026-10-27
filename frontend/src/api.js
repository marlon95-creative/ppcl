const BASE = import.meta.env.VITE_API_URL || "";
const cache = new Map();

async function get(path, useCache = false) {
  if (useCache && cache.has(path)) return cache.get(path);
  let res;
  try { res = await fetch(BASE + path); } catch { const e = new Error("network"); e.network = true; throw e; }
  if (!res.ok) { const e = new Error("http"); e.status = res.status; throw e; }
  const data = await res.json();
  if (useCache) cache.set(path, data);
  return data;
}

export const getCategories = () => get("/api/categories/", true);
export const getCompany = () => get("/api/company/", true);
export const getServices = () => get("/api/services/", true);
export const getFaqs = () => get("/api/faqs/", true);
export const getProducts = (params = {}) => get(`/api/products/?${new URLSearchParams(params)}`);
export const getProduct = (slug) => get(`/api/products/${encodeURIComponent(slug)}/`);

async function post(path, body) {
  let res;
  try { res = await fetch(BASE + path, { method: "POST", body }); }
  catch { throw { message: "We could not reach the server. Check your internet connection and try again." }; }
  if (res.ok) return res.json();
  if (res.status === 429) throw { message: "Too many requests from this device. Please wait a while and try again." };
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}));
    throw { fieldErrors: data, message: "Some details need fixing. Check the highlighted fields." };
  }
  throw { message: "Something went wrong on our side. Your details are still here: try again in a moment." };
}
export const submitQuote = (fd) => post("/api/quotes/", fd);
export const submitContact = (fd) => post("/api/contact-messages/", fd);
