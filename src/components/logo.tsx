import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="dq-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#dq-g)" />
      <rect x="8" y="17" width="4" height="7" rx="1.5" fill="#fff" opacity=".75" />
      <rect x="14" y="12" width="4" height="12" rx="1.5" fill="#fff" opacity=".9" />
      <rect x="20" y="8" width="4" height="16" rx="1.5" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)} aria-label="DataQuest home">
      <LogoMark />
      <span className="text-lg">
        Data<span className="text-primary">Quest</span>
      </span>
    </Link>
  );
}
