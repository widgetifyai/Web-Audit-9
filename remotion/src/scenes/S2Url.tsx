import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { StepTag, Window } from "../components/Layers";

const TARGET = "yourwebsite.com";

export const S2Url: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const typed = TARGET.slice(0, Math.max(0, Math.min(TARGET.length, Math.floor((frame - 26) / 2.6))));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const press = spring({ frame: frame - 108, fps, config: { damping: 9, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
      <div style={{ width: 1080 }}>
        <StepTag index="01" label="Paste your URL" />
      </div>
      <div style={{ opacity: rise, transform: `translateY(${interpolate(rise, [0, 1], [60, 0])}px)` }}>
        <Window url="webaudit.app">
          <div style={{ fontFamily: "var(--display)", fontSize: 46, fontWeight: 700, color: C.text }}>
            Free instant website audit
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: C.muted }}>
            Eight categories. One prioritised action list.
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
            <div
              style={{
                flex: 1,
                background: C.bg2,
                border: `1px solid ${typed ? C.primary : C.line}`,
                borderRadius: 14,
                padding: "22px 24px",
                fontSize: 30,
                color: typed ? C.text : C.muted,
              }}
            >
              {typed || "yourwebsite.com"}
              {caret && typed.length < TARGET.length ? (
                <span style={{ color: C.primary }}>|</span>
              ) : null}
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
                color: C.bg2,
                borderRadius: 14,
                padding: "22px 40px",
                fontSize: 30,
                fontWeight: 700,
                transform: `scale(${1 - press * 0.06})`,
                boxShadow: `0 18px 50px -20px ${C.primary}`,
              }}
            >
              Run audit
            </div>
          </div>
        </Window>
      </div>
    </AbsoluteFill>
  );
};
