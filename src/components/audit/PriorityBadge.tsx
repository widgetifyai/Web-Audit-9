import { cn } from "@/lib/utils";
import type { Difficulty, Priority } from "@/lib/audit-types";

const PRIORITY_CLASS: Record<Priority, string> = {
  Critical: "bg-danger/15 text-danger border-danger/30",
  High: "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-accent/15 text-accent border-accent/30",
  Low: "bg-muted text-muted-foreground border-border",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        PRIORITY_CLASS[priority] ?? PRIORITY_CLASS.Low,
        className,
      )}
    >
      {priority}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {difficulty} to fix
    </span>
  );
}