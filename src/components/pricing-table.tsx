import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/lib/site";

const free = ["Five challenges per day", "Basic learning paths", "Limited hints", "Basic progress dashboard", "Community leaderboard"];
const pro = [
  "Unlimited challenges",
  "Complete explanations",
  "Advanced datasets",
  "Interview preparation",
  "Guided projects",
  "Advanced analytics",
  "Detailed progress reports",
];

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-sm">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-3">
          <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          {f}
        </li>
      ))}
    </ul>
  );
}

export function PricingTable() {
  return (
    <div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className="flex flex-col p-7">
          <h3 className="text-lg font-semibold">Free</h3>
          <p className="mt-1 text-sm text-muted">Learn the fundamentals and build a daily habit.</p>
          <p className="mt-6 text-4xl font-semibold tracking-tight">
            $0<span className="text-base font-normal text-muted"> / forever</span>
          </p>
          <Features items={free} />
          <div className="flex-1" />
          <Button asChild variant="secondary" className="mt-8 w-full">
            <Link href="/paths/sql/select">Start Practising Free</Link>
          </Button>
        </Card>

        <Card className="relative flex flex-col border-primary/50 bg-gradient-to-b from-primary/10 to-card p-7">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pro</h3>
            <Badge variant="violet">Not yet available</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">Everything you need to become job-ready.</p>
          <p className="mt-6 text-4xl font-semibold tracking-tight">
            {site.proPrice ? (
              <>
                {site.proPrice}
                <span className="text-base font-normal text-muted"> / month</span>
              </>
            ) : (
              <span className="text-2xl">Price announced at launch</span>
            )}
          </p>
          <Features items={pro} />
          <div className="flex-1" />
          <Button className="mt-8 w-full" disabled aria-describedby="pro-note">
            Pro checkout is not open yet
          </Button>
        </Card>
      </div>
      <p id="pro-note" className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted">
        Payments are not active, so nothing can be purchased today. Plan limits start when accounts launch; until then
        every published lesson is free to use without signing up.
      </p>
    </div>
  );
}
