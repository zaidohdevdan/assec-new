import * as React from "react";
import { BeneficiosClient, BenefitItem } from "./BeneficiosClient";
import { getServerApiBase } from "@/lib/api";

async function getPublishedBenefits(): Promise<BenefitItem[]> {
  try {
    const res = await fetch(`${getServerApiBase()}/benefits`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data.filter((b: BenefitItem) => b.active) : [];
    }
  } catch {
    // Graceful fallback during build / offline
  }
  return [];
}

export default async function BeneficiosPage() {
  const initialBenefits = await getPublishedBenefits();

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <BeneficiosClient initialBenefits={initialBenefits} />
    </React.Suspense>
  );
}
