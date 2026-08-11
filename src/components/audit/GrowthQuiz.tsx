import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  QUIZ_QUESTIONS,
  buildRecommendation,
  useQuizLead,
  type QuizAnswers,
} from "@/lib/quiz";
import { cn } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(200),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),
});

export function GrowthQuiz({ className }: { className?: string }) {
  const { lead, save } = useQuizLead();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [done, setDone] = useState(false);

  const total = QUIZ_QUESTIONS.length + 1;
  const answered = QUIZ_QUESTIONS.filter((q) => answers[q.key]).length;
  const progress = Math.round(((done ? total : step) / total) * 100);

  const recommendation = useMemo(() => {
    if (answered < QUIZ_QUESTIONS.length) return null;
    return buildRecommendation(answers as Required<QuizAnswers>);
  }, [answers, answered]);

  function choose(key: keyof QuizAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, QUIZ_QUESTIONS.length)), 160);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = leadSchema.safeParse({ name, email, website });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    if (!recommendation) {
      toast.error("Please answer every question first");
      return;
    }
    save({
      name: parsed.data.name,
      email: parsed.data.email,
      website: parsed.data.website || undefined,
      answers: answers as Required<QuizAnswers>,
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done && recommendation) {
    return (
      <div className={cn("surface-card p-6 sm:p-8", className)}>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" aria-hidden /> Your personalised plan
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
          {recommendation.profile}
          {lead?.name ? ` · ${lead.name}` : ""}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{recommendation.summary}</p>

        <div className="mt-6">
          <h3 className="text-sm font-semibold">Focus these audit categories first</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendation.focus.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <ol className="mt-6 space-y-3">
          {recommendation.actions.map((action, index) => (
            <li key={action.title} className="flex gap-3 rounded-xl border border-border/60 p-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{action.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          {recommendation.timeline}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/">Run my audit now</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/referral">Invite a friend</Link>
          </Button>
          <Button variant="ghost" onClick={restart}>
            Retake quiz
          </Button>
        </div>

        <p className="mt-6 border-t border-border/60 pt-5 text-xs text-muted-foreground">
          Recommendation engine built by{" "}
          <a
            href="https://widgetifyai.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Widgetify AI
          </a>
          .
        </p>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[step];

  return (
    <div className={cn("surface-card p-6 sm:p-8", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-muted-foreground">
          Step {Math.min(step + 1, total)} of {total}
        </p>
        <p className="text-xs text-muted-foreground">{progress}% complete</p>
      </div>
      <Progress value={progress} className="mt-3 h-2" />

      {question ? (
        <div className="mt-7">
          <h2 className="font-display text-xl font-bold sm:text-2xl">{question.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{question.helper}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const selected = answers[question.key] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => choose(question.key, option.value)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60",
                    selected ? "border-primary bg-primary/10" : "border-border bg-surface/40",
                  )}
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                    {option.label}
                    {selected ? <CheckCircle2 className="size-4 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <form className="mt-7" onSubmit={submit}>
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Where should we send your plan?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your answers are ready. Add your details to see the personalised recommendations.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quiz-name">Name</Label>
              <Input
                id="quiz-name"
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-email">Email</Label>
              <Input
                id="quiz-email"
                type="email"
                value={email}
                maxLength={200}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="quiz-site">Website (optional)</Label>
              <Input
                id="quiz-site"
                value={website}
                maxLength={200}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                autoComplete="url"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="hero">
              Show my recommendations
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
          </div>
        </form>
      )}

      {question && step > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-5"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
      ) : null}
    </div>
  );
}