import { useCallback, useEffect, useState } from "react";

export type QuizGoal = "traffic" | "conversions" | "speed" | "credibility";
export type QuizStage = "idea" | "launched" | "growing" | "established";
export type QuizTeam = "solo" | "small" | "agency" | "company";
export type QuizPain = "unsure" | "slow" | "no-leads" | "invisible";

export interface QuizAnswers {
  goal?: QuizGoal;
  stage?: QuizStage;
  team?: QuizTeam;
  pain?: QuizPain;
}

export interface QuizOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export interface QuizQuestion<K extends keyof QuizAnswers = keyof QuizAnswers> {
  key: K;
  title: string;
  helper: string;
  options: QuizOption<NonNullable<QuizAnswers[K]> & string>[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: "goal",
    title: "What matters most for your website right now?",
    helper: "We tune the audit priorities around this outcome.",
    options: [
      { value: "traffic", label: "More traffic", description: "Be found by more of the right people." },
      { value: "conversions", label: "More conversions", description: "Turn existing visitors into leads or sales." },
      { value: "speed", label: "Better speed", description: "The site feels slow or heavy today." },
      { value: "credibility", label: "More credibility", description: "Look and feel like a serious brand." },
    ],
  },
  {
    key: "stage",
    title: "Where is the website today?",
    helper: "Different stages need different first moves.",
    options: [
      { value: "idea", label: "Not live yet", description: "Still designing or building." },
      { value: "launched", label: "Just launched", description: "Live, but barely any visitors." },
      { value: "growing", label: "Growing", description: "Steady visitors, uneven results." },
      { value: "established", label: "Established", description: "Meaningful traffic and revenue." },
    ],
  },
  {
    key: "team",
    title: "Who will do the fixing?",
    helper: "So recommendations match the effort you can spend.",
    options: [
      { value: "solo", label: "Just me", description: "Founder or solo operator." },
      { value: "small", label: "Small team", description: "A couple of generalists." },
      { value: "agency", label: "An agency", description: "External partner handles delivery." },
      { value: "company", label: "In-house team", description: "Dedicated devs and marketers." },
    ],
  },
  {
    key: "pain",
    title: "What is the most frustrating part?",
    helper: "Your biggest blocker shapes the first action.",
    options: [
      { value: "unsure", label: "I don't know what's wrong", description: "No clear diagnosis." },
      { value: "slow", label: "Pages load slowly", description: "Visitors leave before it renders." },
      { value: "no-leads", label: "Visitors don't convert", description: "Traffic arrives, nothing happens." },
      { value: "invisible", label: "Nobody finds us", description: "Search brings almost no one." },
    ],
  },
];

export interface QuizRecommendation {
  profile: string;
  summary: string;
  focus: string[];
  actions: { title: string; detail: string }[];
  timeline: string;
}

const GOAL_FOCUS: Record<QuizGoal, string[]> = {
  traffic: ["SEO", "Best Practices", "Performance"],
  conversions: ["Conversion", "User Experience", "Mobile Experience"],
  speed: ["Performance", "Best Practices", "Mobile Experience"],
  credibility: ["Security", "Accessibility", "User Experience"],
};

const PAIN_ACTION: Record<QuizPain, { title: string; detail: string }> = {
  unsure: {
    title: "Run a full baseline audit",
    detail: "Get all eight category scores in one pass so you stop guessing which area is holding you back.",
  },
  slow: {
    title: "Cut render-blocking weight",
    detail: "Compress hero imagery, defer non-critical scripts and trim unused CSS before anything else.",
  },
  "no-leads": {
    title: "Rebuild the primary call to action",
    detail: "One dominant action above the fold, repeated after each proof section, with a short form.",
  },
  invisible: {
    title: "Fix the indexable basics",
    detail: "Unique titles and descriptions per page, one H1, clean internal links and a live sitemap.",
  },
};

const STAGE_TIMELINE: Record<QuizStage, string> = {
  idea: "Fix these before launch — roughly a day of focused work.",
  launched: "Two weeks of small weekly changes will move every score.",
  growing: "Ship the top three fixes this sprint, re-audit in 30 days.",
  established: "Run this as a quarterly programme with a re-audit each month.",
};

const TEAM_ACTION: Record<QuizTeam, { title: string; detail: string }> = {
  solo: {
    title: "Do the top three items only",
    detail: "Ignore everything below critical priority until the first three are shipped and re-measured.",
  },
  small: {
    title: "Split the report by owner",
    detail: "Assign performance and security to whoever touches code, SEO and conversion to whoever writes.",
  },
  agency: {
    title: "Share the report as your brief",
    detail: "Send the public report link so scope and success criteria are agreed before work starts.",
  },
  company: {
    title: "Track scores as a KPI",
    detail: "Re-audit monthly and chart the eight category scores next to your traffic and revenue numbers.",
  },
};

const GOAL_SUMMARY: Record<QuizGoal, string> = {
  traffic: "Your growth ceiling is discovery — search engines need clearer signals from your pages.",
  conversions: "You have attention but you're leaking it. The fix is clarity, not more traffic.",
  speed: "Speed is your tax on every other improvement. Fix it first and everything else compounds.",
  credibility: "Trust signals are doing the heavy lifting here — polish, proof and safety.",
};

export function buildRecommendation(answers: Required<QuizAnswers>): QuizRecommendation {
  const profileMap: Record<QuizStage, string> = {
    idea: "Pre-launch builder",
    launched: "Early-stage operator",
    growing: "Scaling website",
    established: "Established web presence",
  };

  return {
    profile: profileMap[answers.stage],
    summary: GOAL_SUMMARY[answers.goal],
    focus: GOAL_FOCUS[answers.goal],
    actions: [
      PAIN_ACTION[answers.pain],
      TEAM_ACTION[answers.team],
      {
        title: "Re-audit after you ship",
        detail: "A second report proves the change worked and unlocks your score trend in history.",
      },
    ],
    timeline: STAGE_TIMELINE[answers.stage],
  };
}

export interface QuizLead {
  name: string;
  email: string;
  website?: string;
  answers: Required<QuizAnswers>;
  createdAt: string;
}

const LEAD_KEY = "webaudit.quiz.lead";

export function saveQuizLead(lead: QuizLead): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  } catch {
    /* storage unavailable */
  }
}

export function readQuizLead(): QuizLead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as QuizLead) : null;
  } catch {
    return null;
  }
}

export function useQuizLead() {
  const [lead, setLead] = useState<QuizLead | null>(null);

  useEffect(() => {
    setLead(readQuizLead());
  }, []);

  const save = useCallback((next: QuizLead) => {
    saveQuizLead(next);
    setLead(next);
  }, []);

  return { lead, save };
}