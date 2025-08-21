"use client";

import { Suspense } from "react";
import PropertiesContent from "./PropertiesContent";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
