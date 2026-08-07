import { useState } from "react";
import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HelpVideoProps {
  label?: string;
  variant?: "soft" | "ghost" | "outline" | "hero";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function HelpVideo({
  label = "Watch 23-second tutorial",
  variant = "soft",
  size = "sm",
  className,
}: HelpVideoProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <PlayCircle className="size-4" aria-hidden />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl border-border/70 bg-surface/95 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>How WebAudit works</DialogTitle>
          <DialogDescription>
            A quick walkthrough: paste a URL, scan eight categories, read your prioritised report,
            then save and share it.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
            {open ? (
              <video
                className="aspect-video w-full"
                src="/media/webaudit-tutorial.mp4"
                poster="/media/webaudit-tutorial-poster.jpg"
                controls
                autoPlay
                playsInline
                preload="metadata"
              >
                Your browser does not support embedded video.
              </video>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
