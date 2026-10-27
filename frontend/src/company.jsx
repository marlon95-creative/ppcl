import { createContext, useContext, useEffect, useState } from "react";
import { getCompany } from "./api.js";

const fallback = { company_name: "PISGAH PINNACLE CO. LTD", short_description: "Tanzanian-owned supplier of PPE, safety gear, uniforms and workwear.", about_text: "Pisgah Pinnacle Co. Ltd (PPCL) is a registered Tanzanian-owned private company supplying safety gear and workwear.", mission: "To supply safety gear and practical workwear that support safer workplaces.", vision: "To be a trusted Tanzanian supplier of safety equipment, uniforms and workwear.", values: ["Safety-conscious supply", "Professional service", "Clear quotations and communication"],
  phone: "+255 654 560 555", email: "info@pisgah.co.tz", whatsapp: "255654560555", address: "Kijitonyama, Dar es Salaam, Tanzania", working_hours: "Dar es Salaam and Mwanza offices", map_url: "", facebook: "", instagram: "", linkedin: "" };
const Ctx = createContext(fallback);
export const useCompany = () => useContext(Ctx);

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(fallback);
  useEffect(() => { getCompany().then((c) => setCompany({ ...fallback, ...c })).catch(() => {}); }, []);
  return <Ctx.Provider value={company}>{children}</Ctx.Provider>;
}
