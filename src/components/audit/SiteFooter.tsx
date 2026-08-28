import { Link } from "@tanstack/react-router";
import { Gauge } from "lucide-react";
import { useEffect, useState } from "react";

import { CommunityLinks } from "@/components/audit/CommunityLinks";

export function SiteFooter() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
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
              GPT-5.6-Sol powered website audits that turn technical detail into decisions your business can
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
                <Link to="/how-it-works" className="transition-colors hover:text-foreground">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="transition-colors hover:text-foreground">
                  Use cases
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="transition-colors hover:text-foreground">
                  Growth quiz
                </Link>
              </li>
              <li>
                <Link to="/referral" className="transition-colors hover:text-foreground">
                  Refer &amp; earn
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
              <li>
                <Link to="/community" className="transition-colors hover:text-foreground">
                  Community
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
                <Link to="/roadmap" className="transition-colors hover:text-foreground">
                  Product roadmap
                </Link>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-foreground">
                  Contact &amp; support
                </Link>
              </li>
            </ul>
          </div>


          <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="iamadnanvv" data-description="Support me on Buy me a coffee!" data-message="" data-color="#5F7FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script>

          
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

        <div className="mt-12 border-t border-border/60 pt-8">
          <h3 className="text-sm font-semibold">Community</h3>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Follow along and get help with your audit findings from other builders.
          </p>
          <CommunityLinks className="mt-4" />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              © {year} WebAudit. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              The platform created by{" "}
              <a
                href="https://www.linkedin.com/in/iamadnanvv/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                iamadnavv
              </a>
            </p>
          </div>
          <Link
            to="https://buymeacoffee.com/iamadnanvv"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
          BUY ME A COFFEE
          </Link>
        </div>
      </div>
    </footer>
  );
}
