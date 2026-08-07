import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

import { Accents, Backdrop } from "./components/Layers";
import { S1Intro } from "./scenes/S1Intro";
import { S2Url } from "./scenes/S2Url";
import { S3Scan } from "./scenes/S3Scan";
import { S4Report } from "./scenes/S4Report";
import { S5Saved } from "./scenes/S5Saved";
import { S6Outro } from "./scenes/S6Outro";
import { C } from "./theme";

const sora = loadSora("normal", { weights: ["700", "800"], subsets: ["latin"] });
const manrope = loadManrope("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const MainVideo: React.FC = () => (
  <AbsoluteFill
    style={
      {
        fontFamily: manrope.fontFamily,
        color: C.text,
        "--display": sora.fontFamily,
      } as React.CSSProperties
    }
  >
    <Backdrop />
    <Accents />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120}>
        <S1Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 26 })}
      />
      <TransitionSeries.Sequence durationInFrames={150}>
        <S2Url />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
      />
      <TransitionSeries.Sequence durationInFrames={165}>
        <S3Scan />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 26 })}
      />
      <TransitionSeries.Sequence durationInFrames={165}>
        <S4Report />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
      />
      <TransitionSeries.Sequence durationInFrames={135}>
        <S5Saved />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })}
      />
      <TransitionSeries.Sequence durationInFrames={120}>
        <S6Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
