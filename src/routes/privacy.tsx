import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";

const TITLE = "Privacy Policy — WebAudit";
const DESCRIPTION =
  "How WebAudit handles the websites you audit, what we store, and what stays on your device.";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page is maintained by WebAudit to describe how the audit tool handles data.
        </p>
        <div className="mt-8 space-y-8 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">What we access</h2>
            <p className="mt-2">
              When you submit a web address, we request that page over the public internet in the
              same way any visitor's browser would. We only read publicly available pages and never
              attempt to access content behind a login.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">What we store</h2>
            <p className="mt-2">
              Finished reports are saved in your own browser's local storage. They are not written
              to a WebAudit database and are not visible to us. Clearing your browser data removes
              them permanently.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Sharing</h2>
            <p className="mt-2">
              When you create a share link, the report content is encoded inside the link itself.
              Anyone with that link can read the report, so only share it with people you trust.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">AI processing</h2>
            <p className="mt-2">
              The measurements taken from your page are sent to OpenAI's GPT-5.6-Sol model so it
              can write the recommendations. Only the technical signals and page metadata are
              sent — never personal data you have not provided.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be sent to privacy@webaudit.app.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}