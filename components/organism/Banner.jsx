"use client"
import { useEffect, useState } from "react";
import DesktopBanner from "../atom/DesktopBanner";
import MobileBanner from "../atom/MobileBanner";

const Banner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px se chhota toh mobile
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <>{isMobile ? <MobileBanner /> : <DesktopBanner />}</>;
};

export default Banner;
