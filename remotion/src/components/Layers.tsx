import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  const drift2 = Math.cos(frame / 120) * 60;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.bg2} 0%, ${C.bg} 55%, #101a1a 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -260 + drift,
          top: -380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primary}26 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          right: -300 - drift2,
          bottom: -360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}22 0%, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line}22 1px, transparent 1px), linear-gradient(90deg, ${C.line}22 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 45%, black 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 20%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Accents: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = new Array(14).fill(0);
  return (
    <AbsoluteFill style={{ opacity: 0.5 }}>
      {dots.map((_, i) => {
        const seed = i * 137.5;
        const x = (seed % 1820) + 40;
        const y = ((seed * 2.3) % 980) + 40;
        const float = Math.sin(frame / (40 + (i % 5) * 9) + i) * 22;
        const o = interpolate(Math.sin(frame / 55 + i), [-1, 1], [0.15, 0.7]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + float,
              width: i % 3 === 0 ? 6 : 4,
              height: i % 3 === 0 ? 6 : 4,
              borderRadius: "50%",
              background: i % 2 ? C.primary : C.accent,
              opacity: o,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const StepTag: React.FC<{ index: string; label: string; delay?: number }> = ({
  index,
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame - delay, [0, 22], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: o, transform: `translateX(${x}px)` }}>
      <div
        style={{
          fontFamily: "var(--display)",
          fontSize: 26,
          fontWeight: 700,
          color: C.bg2,
          background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
          borderRadius: 12,
          padding: "6px 16px",
        }}
      >
        {index}
      </div>
      <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: C.muted }}>{label}</div>
    </div>
  );
};

export const Window: React.FC<{ children: React.ReactNode; url?: string; width?: number }> = ({
  children,
  url,
  width = 1080,
}) => (
  <div
    style={{
      width,
      borderRadius: 22,
      border: `1px solid ${C.line}`,
      background: `${C.surface}f2`,
      boxShadow: "0 40px 90px -40px rgba(0,0,0,0.8)",
      overflow: "hidden",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
      {[C.danger, C.warn, C.primary].map((c) => (
        <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.8 }} />
      ))}
      {url ? (
        <div
          style={{
            marginLeft: 16,
            flex: 1,
            background: C.bg2,
            border: `1px solid ${C.line}`,
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 20,
            color: C.muted,
          }}
        >
          {url}
        </div>
      ) : null}
    </div>
    <div style={{ padding: 34 }}>{children}</div>
  </div>
);
