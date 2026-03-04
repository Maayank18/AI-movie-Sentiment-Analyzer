import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    let t;
    const fn = () => { clearTimeout(t); t = setTimeout(() => setWidth(window.innerWidth), 150); };
    window.addEventListener("resize", fn);
    return () => { clearTimeout(t); window.removeEventListener("resize", fn); };
  }, []);
  return width;
};

export default useWindowWidth;