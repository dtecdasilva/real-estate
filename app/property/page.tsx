import PropertyDetails from "@/components/ui/PropertyDetails";
import { Suspense } from "react";

export default function PropertyPage() {
  return (
    <Suspense fallback={<div>Loading property details...</div>}>
      <PropertyDetails />
    </Suspense>
  );
}
