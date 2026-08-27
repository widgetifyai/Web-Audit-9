import { Link } from "@tanstack/react-router";
import { Gauge, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/use-cases", label: "Use cases" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/quiz", label: "Growth quiz" },
  { to: "/referral", label: "Refer & earn" },
  { to: "/directory", label: "Directory" },
  { to: "/achievements", label: "Achievements" },
  { to: "/history", label: "History" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <meta
        name="monetag"
        content="a81e4557046623482b8f55c1f7398779"
      />

    <header className="no-print sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Gauge className="size-5" aria-hidden />
          </span>
          <span className="truncate font-display text-lg font-bold">WebAudit</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="/how-it-works">How it works</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="/use-cases">Use cases</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link to="/roadmap">Roadmap</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/quiz">Growth quiz</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/directory">Directory</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/referral">Refer</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/">Start audit</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-display">WebAudit</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((item) => (
                  <Button
                    key={item.to}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <Link to={item.to}>{item.label}</Link>
                  </Button>
                ))}
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link to="https://buymeacoffee.com/iamadnanvv" params={{ id: "sample" }}>
                    Buy me a Coffee
                  </Link>
                </Button>
                <Button asChild variant="hero" className="mt-3" onClick={() => setOpen(false)}>
                  <Link to="/">Start free audit</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
