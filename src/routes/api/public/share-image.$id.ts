import { createFileRoute } from "@tanstack/react-router";

import { decodeReport } from "@/lib/audit-history";
import { generateImagePrompt } from "@/lib/share-kit";

export const Route = createFileRoute("/api/public/share-image/$id")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const encoded = searchParams.get("d") ?? "";
        const report = encoded ? decodeReport(encoded) : null;

        if (!report) {
          return new Response("Report not found", { status: 404 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("Missing AI gateway key", { status: 500 });
        }

        const prompt = generateImagePrompt(report);

        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3-pro-image",
              messages: [{ role: "user", content: prompt }],
              modalities: ["image", "text"],
              stream: false,
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            return new Response(`Image generation failed: ${text}`, { status: response.status });
          }

          const payload = (await response.json()) as {
            data?: { b64_json?: string }[];
          };
          const b64 = payload.data?.[0]?.b64_json;
          if (!b64) {
            return new Response("No image returned", { status: 502 });
          }

          const image = Buffer.from(b64, "base64");
          return new Response(image, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=3600",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return new Response(`Image generation error: ${message}`, { status: 500 });
        }
      },
    },
  },
});
