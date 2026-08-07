import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { StepTag } from "../components/Layers";

const CARDS = [
  { t: "Saved forever", d: "Every audit is stored, so you can reopen it any time." },
  { t: "Share it", d: "One link, a score badge and ready-made social cards." },
  { t: "Track progress", d: "Re-audit later and watch your score climb." },
];

export const S5Saved: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 52 }}>
      <div style={{ width: 1400 }}>
        <StepTag index="04" label="Keep, share, improve" />
      </div>
      <div style={{ display: "flex", gap: 32, width: 1400 }}>
        {CARDS.map((c, i) => {
          const p = spring({ frame: frame - 14 - i * 14, fps, config: { damping: 16, stiffness: 120 } });
          const float = Math.sin((frame - i * 20) / 46) * 8;
          return (
            <div
              key={c.t}
              style={{
                flex: 1,
                padding: 40,
                borderRadius: 24,
                border: `1px solid ${C.line}`,
                background: `linear-gradient(160deg, ${C.surface}f2, ${C.bg2}f2)`,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [80, float])}px)`,
              }}
            >
              <div style={{ width: 56, height: 6, borderRadius: 4, background: `linear-gradient(90deg, ${C.primary}, ${C.accent})` }} />
              <div style={{ marginTop: 26, fontFamily: "var(--display)", fontSize: 42, fontWeight: 700, color: C.text }}>{c.t}</div>
              <div style={{ marginTop: 16, fontSize: 26, lineHeight: 1.45, color: C.muted }}>{c.d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
