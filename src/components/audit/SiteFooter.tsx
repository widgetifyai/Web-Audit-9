import { Link } from "@tanstack/react-router";
import { Gauge, Github, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Gauge className="size-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold">WebAudit</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered website audits that turn technical detail into decisions your business can
              act on.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-foreground">
                  Run an audit
                </Link>
              </li>
              <li>
                <Link
                  to="/report/$id"
                  params={{ id: "sample" }}
                  className="transition-colors hover:text-foreground"
                >
                  Sample report
                </Link>
              </li>
              <li>
                <Link to="/history" className="transition-colors hover:text-foreground">
                  Audit history
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  About WebAudit
                </Link>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-foreground">
                  Contact &amp; support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} WebAudit. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              The platform created by{" "}
              <a
                href="https://widgetifyai.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Widgetify
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="https://x.com" aria-label="WebAudit on X" className="transition-colors hover:text-foreground">
              <Twitter className="size-4" aria-hidden />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="WebAudit on LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <Linkedin className="size-4" aria-hidden />
            </a>
            <a
              href="https://github.com"
              aria-label="WebAudit on GitHub"
              className="transition-colors hover:text-foreground"
            >
              <Github className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}