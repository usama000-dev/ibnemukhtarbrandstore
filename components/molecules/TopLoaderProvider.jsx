"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const TopLoaderProvider = () => {
  const pathname = usePathname();
  const ref = useRef(null);

  // Prevent SSR → avoids hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    // Start loader (40%)
    ref.current?.staticStart(40);

    // Complete loader (100%)
    const timeout = setTimeout(() => {
      ref.current?.complete();
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname, mounted]);

  // Prevent server-side render
  if (!mounted) return null;

  return (
    <LoadingBar
      color="#DD8560"
      ref={ref}
      height={3}
      shadow={true}
      waitingTime={300}
    />
  );
};

export default TopLoaderProvider;
