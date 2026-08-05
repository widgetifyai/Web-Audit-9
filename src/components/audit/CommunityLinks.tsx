import { COMMUNITY_STEPS } from "@/lib/community";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CommunityLinks({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <ul className={cn("flex flex-wrap items-center gap-2", className)}>
        {COMMUNITY_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Widgetify on ${step.name}`}
                    className="grid size-9 place-items-center rounded-lg border border-border/70 bg-surface/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </TooltipTrigger>
                <TooltipContent>{step.name}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
}
