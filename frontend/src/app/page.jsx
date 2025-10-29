// app/page.jsx
import { Suspense } from "react";
import Home from "../app/Home";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <Home />
    </Suspense>
  );
}
