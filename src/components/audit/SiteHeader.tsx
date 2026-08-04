import { Link } from "@tanstack/react-router";
import { Gauge } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Gauge className="size-5" aria-hidden />
          </span>
          <span className="truncate font-display text-lg font-bold">Widgetify</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/report/$id" params={{ id: "sample" }}>
              Sample report
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">History</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/">Start audit</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}