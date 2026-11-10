import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page does not exist</h1>
      <p className="mt-3 max-w-md text-muted">The link may be out of date. The learning paths are a good place to pick up again.</p>
      <Button asChild className="mt-8">
        <Link href="/paths">Browse learning paths</Link>
      </Button>
    </div>
  );
}
