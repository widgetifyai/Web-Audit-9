import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

export const S6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 200 } });
  const c = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const credit = interpolate(frame, [46, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame / 22), [-1, 1], [0.4, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            color: C.text,
            opacity: t,
            transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
          }}
        >
          Your first audit is free
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            padding: "24px 58px",
            borderRadius: 18,
            fontSize: 36,
            fontWeight: 700,
            color: C.bg2,
            background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            boxShadow: `0 30px 90px -30px ${C.primary}`,
            opacity: c,
            transform: `scale(${interpolate(c, [0, 1], [0.85, 1])})`,
            filter: `brightness(${0.9 + glow * 0.15})`,
          }}
        >
          webaudit — start your audit
        </div>
        <div style={{ marginTop: 46, fontSize: 24, color: C.muted, opacity: credit }}>
          The platform created by Widgetify · widgetifyai.vercel.app
        </div>
      </div>
    </AbsoluteFill>
  );
};
