import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { scoreLabel, scoreTone } from "@/lib/audit-types";

const TONE_CLASS = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function ScoreRing({
  score,
  size = 200,
  stroke = 14,
  showLabel = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const animated = useCountUp(score);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const tone = scoreTone(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-border"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          className={cn("transition-all duration-1000 ease-out", TONE_CLASS[tone])}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * animated) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn("font-display font-bold tabular-nums", TONE_CLASS[tone])}
          style={{ fontSize: size * 0.28 }}
        >
          {animated}
        </span>
        {showLabel ? (
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {scoreLabel(score)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const animated = useCountUp(score, 900);
  const tone = scoreTone(score);
  const bg = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all duration-700", bg)}
        style={{ width: `${animated}%` }}
      />
    </div>
  );
}