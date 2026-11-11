"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Reveal({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="secondary" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? <EyeOff /> : <Eye />} {open ? `Hide ${label}` : `Show ${label}`}
      </Button>
      {open && <div className="mt-3 animate-fade-up">{children}</div>}
    </div>
  );
}
