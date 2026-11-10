import type { Metadata } from "next";
import { PricingTable } from "@/components/pricing-table";

export const metadata: Metadata = {
  title: "Pricing",
  description: "DataQuest is free to start. See what the Free and Pro plans include.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="container py-14 sm:py-20">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Start free. Upgrade when Pro launches.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">Two plans, and no card needed to begin.</p>
      </header>
      <PricingTable />
    </div>
  );
}
