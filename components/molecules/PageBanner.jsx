"use client"
import { useEffect, useState } from "react";
import MobilePageBanner from "../atom/MobilePageBanner";
import DesktopPageBanner from "../atom/DesktopPageBanner";

const PageBanner = ({ slides1 = [], slides2 = [] }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(prev => {
                if (prev !== mobile) return mobile;
                return prev;
            });
        };

        handleResize(); // initial check
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!mounted) return null;

    return <>{isMobile ? <MobilePageBanner slides={slides1} /> : <DesktopPageBanner slides={slides2} />}</>;
};

export default PageBanner;
