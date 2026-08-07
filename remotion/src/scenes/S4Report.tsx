import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { StepTag } from "../components/Layers";

const FIXES = [
  { p: "Critical", t: "Compress hero imagery", d: "−1.8s load time", c: C.danger },
  { p: "High", t: "Add meta description", d: "+CTR in search", c: C.warn },
  { p: "High", t: "Label form inputs", d: "Accessibility pass", c: C.warn },
  { p: "Medium", t: "Move CTA above the fold", d: "+conversion", c: C.accent },
];

export const S4Report: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringP = spring({ frame: frame - 10, fps, config: { damping: 200, stiffness: 55 } });
  const score = Math.round(84 * ringP);
  const R = 130;
  const circ = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ width: 1300 }}>
        <StepTag index="03" label="Read your report" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 80, width: 1300 }}>
        <div style={{ transform: `scale(${interpolate(ringP, [0, 1], [0.85, 1])})` }}>
          <svg width={320} height={320} viewBox="0 0 320 320">
            <defs>
              <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.primary} />
                <stop offset="100%" stopColor={C.accent} />
              </linearGradient>
            </defs>
            <circle cx={160} cy={160} r={R} stroke={C.line} strokeWidth={20} fill="none" />
            <circle
              cx={160}
              cy={160}
              r={R}
              stroke="url(#r)"
              strokeWidth={20}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - (score / 100))}
              transform="rotate(-90 160 160)"
            />
            <text x={160} y={178} textAnchor="middle" style={{ fontFamily: "var(--display)", fontSize: 92, fontWeight: 800, fill: C.text }}>
              {score}
            </text>
            <text x={160} y={218} textAnchor="middle" style={{ fontSize: 24, fill: C.muted }}>
              overall score
            </text>
          </svg>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
          {FIXES.map((f, i) => {
            const p = spring({ frame: frame - 34 - i * 12, fps, config: { damping: 18, stiffness: 110 } });
            return (
              <div
                key={f.t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "22px 28px",
                  borderRadius: 18,
                  border: `1px solid ${C.line}`,
                  background: `${C.surface}e6`,
                  opacity: p,
                  transform: `translateX(${interpolate(p, [0, 1], [90, 0])}px)`,
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, color: f.c, border: `1px solid ${f.c}66`, borderRadius: 999, padding: "6px 16px" }}>
                  {f.p}
                </span>
                <span style={{ fontSize: 30, color: C.text, flex: 1 }}>{f.t}</span>
                <span style={{ fontSize: 24, color: C.primary }}>{f.d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
