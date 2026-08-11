import { createFileRoute } from "@tanstack/react-router";

import { GrowthQuiz } from "@/components/audit/GrowthQuiz";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";

const TITLE = "Website Growth Quiz — Personalised Fixes | WebAudit";
const DESCRIPTION =
  "Answer four quick questions and get a personalised website improvement plan covering SEO, speed, conversion and trust.";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Find your website's biggest win in 60 seconds
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Four questions, one personalised plan. We match your goal, stage and blocker to the audit
          categories that will move the needle first.
        </p>
        <GrowthQuiz className="mt-8" />
      </main>
      <SiteFooter />
    </div>
  );
}