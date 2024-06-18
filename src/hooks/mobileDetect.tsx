import { useEffect, useState } from "react";

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    function handleResize(e: any) {
      setIsMobile(e?.target?.innerWidth <= 637);
    }
    // handleResize(window)
    setIsMobile(window.innerWidth <= 637);
    window.addEventListener("resize", handleResize); // Add listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up
    };
  }, []);

  return { isMobile };
};
