import { Suspense } from "react";
import UnsubscribeClient from "./component/UnsubscribeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  );
}
