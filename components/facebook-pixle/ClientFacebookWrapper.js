// app/ClientFacebookWrapper.js
"use client";

import { Suspense } from "react";
import FacebookPixel from "./FacebookPixel";
import LoadingComponent from "../atom/LoadingComponent";

export default function ClientFacebookWrapper() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <FacebookPixel />
    </Suspense>
  );
}
