import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mark = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const ring = interpolate(frame, [8, 60], [0, 1], { extrapolateRight: "clamp" });
  const title = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const sub = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const line = interpolate(frame, [40, 78], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const R = 96;
  const circ = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 190 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 54 }}>
        <div style={{ transform: `scale(${mark}) rotate(${interpolate(mark, [0, 1], [-30, 0])}deg)` }}>
          <svg width={230} height={230} viewBox="0 0 230 230">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.primary} />
                <stop offset="100%" stopColor={C.accent} />
              </linearGradient>
            </defs>
            <circle cx={115} cy={115} r={R} stroke={C.line} strokeWidth={14} fill="none" />
            <circle
              cx={115}
              cy={115}
              r={R}
              stroke="url(#g)"
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ring * 0.87)}
              transform="rotate(-90 115 115)"
            />
            <text
              x={115}
              y={132}
              textAnchor="middle"
              style={{ fontFamily: "var(--display)", fontSize: 58, fontWeight: 800, fill: C.text }}
            >
              {Math.round(ring * 87)}
            </text>
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 118,
              fontWeight: 800,
              letterSpacing: -3,
              color: C.text,
              opacity: title,
              transform: `translateY(${interpolate(title, [0, 1], [40, 0])}px)`,
            }}
          >
            WebAudit
          </div>
          <div style={{ height: 4, width: line, marginTop: 10, background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, transparent)` }} />
          <div
            style={{
              marginTop: 22,
              fontSize: 36,
              color: C.muted,
              opacity: sub,
              transform: `translateY(${interpolate(sub, [0, 1], [24, 0])}px)`,
            }}
          >
            Audit any website in 60 seconds — powered by GPT-5.6-Sol
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
