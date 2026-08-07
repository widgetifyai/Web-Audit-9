import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CATEGORIES } from "../theme";
import { StepTag, Window } from "../components/Layers";

export const S3Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const sweep = interpolate(frame, [0, 150], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 42 }}>
      <div style={{ width: 1160 }}>
        <StepTag index="02" label="We scan 8 categories" />
      </div>
      <div style={{ opacity: rise, transform: `translateY(${interpolate(rise, [0, 1], [50, 0])}px)` }}>
        <Window width={1160}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 54px" }}>
            {CATEGORIES.map((cat, i) => {
              const delay = 18 + i * 9;
              const p = spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 60 } });
              const value = Math.round(cat.score * p);
              const tone = cat.score >= 85 ? C.primary : cat.score >= 75 ? C.accent : C.warn;
              return (
                <div key={cat.name} style={{ opacity: interpolate(p, [0, 0.2], [0, 1]) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: C.text }}>
                    <span>{cat.name}</span>
                    <span style={{ fontFamily: "var(--display)", fontWeight: 700, color: tone }}>{value}</span>
                  </div>
                  <div style={{ marginTop: 10, height: 10, borderRadius: 6, background: C.bg2, overflow: "hidden" }}>
                    <div style={{ width: `${value}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${tone}, ${C.accent})` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, height: 6, background: C.bg2, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${sweep}%`, height: "100%", background: `linear-gradient(90deg, ${C.primary}, ${C.accent})` }} />
            </div>
            <div style={{ fontSize: 22, color: C.muted }}>Analysing with GPT-5.6-Sol…</div>
          </div>
        </Window>
      </div>
    </AbsoluteFill>
  );
};
