import { useEffect, useState } from "react";

export function useFetch(fn, deps = []) {
  const [s, setS] = useState({ loading: true, error: null, data: null });
  useEffect(() => {
    let live = true;
    setS({ loading: true, error: null, data: null });
    fn().then((data) => live && setS({ loading: false, error: null, data }))
        .catch((error) => live && setS({ loading: false, error, data: null }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return s;
}

export function usePageTitle(title, company = "PISGAH PINNACLE CO. LTD (PPCL)") {
  useEffect(() => { document.title = title ? `${title} | ${company}` : company; }, [title, company]);
}
