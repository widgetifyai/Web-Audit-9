import {
  Check,
  Copy,
  Facebook,
  ImageIcon,
  Linkedin,
  Loader2,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { encodeReport, getShareImageCache, setShareImageCache } from "@/lib/audit-history";
import type { AuditReport } from "@/lib/audit-types";
import { generateBadgeEmbed, generateShareHtml, generateShareText } from "@/lib/share-kit";
import { cn } from "@/lib/utils";

interface ShareKitProps {
  report: AuditReport;
}

export function ShareKit({ report }: ShareKitProps) {
  const [activeTab, setActiveTab] = useState<"social" | "embed" | "card">("social");
  const [copied, setCopied] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(getShareImageCache(report.id));

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/report/${report.id}?d=${encodeReport(report)}`;
  const badgeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/public/badge/${report.id}?d=${encodeReport(report)}`;
  const shareText = generateShareText(report, publicUrl);
  const embed = generateBadgeEmbed(report, badgeUrl);

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const shareTo = (platform: "twitter" | "linkedin" | "facebook" | "whatsapp") => {
    const text = shareText[platform];
    let url: string;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
    }
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const generateCard = async () => {
    if (imageUrl) return;
    setGenerating(true);
    try {
      const response = await fetch(`/api/public/share-image/${report.id}?d=${encodeReport(report)}`);
      if (!response.ok) throw new Error("Image generation failed");
      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      setImageUrl(dataUrl);
      setShareImageCache(report.id, dataUrl);
      toast.success("Share card ready");
    } catch {
      toast.error("Could not generate share card. Try the HTML version instead.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hero" size="sm">
          <Share2 className="mr-1.5 size-4" aria-hidden />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share this audit</DialogTitle>
          <DialogDescription>
            Spread the word and help more builders discover what to fix.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex gap-1 rounded-xl bg-surface-2 p-1">
          {(["social", "embed", "card"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab ? "bg-surface text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === "social" ? "Social" : tab === "embed" ? "Embed" : "Card"}
            </button>
          ))}
        </div>

        {activeTab === "social" && (
          <div className="mt-2 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="soft" onClick={() => shareTo("twitter")}>
                <Twitter className="mr-2 size-4" aria-hidden />
                X / Twitter
              </Button>
              <Button variant="soft" onClick={() => shareTo("linkedin")}>
                <Linkedin className="mr-2 size-4" aria-hidden />
                LinkedIn
              </Button>
              <Button variant="soft" onClick={() => shareTo("facebook")}>
                <Facebook className="mr-2 size-4" aria-hidden />
                Facebook
              </Button>
              <Button variant="soft" onClick={() => shareTo("whatsapp")}>
                <MessageCircle className="mr-2 size-4" aria-hidden />
                WhatsApp
              </Button>
            </div>
            <div className="surface-card p-3">
              <p className="text-xs text-muted-foreground">Or copy the link</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={publicUrl}
                  className="flex-1 rounded-lg bg-surface-2 px-3 py-2 text-xs text-foreground outline-none"
                />
                <Button
                  size="icon"
                  variant="soft"
                  onClick={() => copy("link", publicUrl)}
                  aria-label="Copy link"
                >
                  {copied === "link" ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "embed" && (
          <div className="mt-2 space-y-3">
            <div className="surface-card p-3">
              <p className="text-xs text-muted-foreground">HTML snippet</p>
              <pre className="mt-2 max-h-24 overflow-auto rounded-lg bg-surface-2 p-2 text-[10px] text-foreground">
                {embed.html}
              </pre>
              <Button
                variant="soft"
                size="sm"
                className="mt-2 w-full"
                onClick={() => copy("html", embed.html)}
              >
                {copied === "html" ? "Copied" : "Copy HTML"}
              </Button>
            </div>
            <div className="surface-card p-3">
              <p className="text-xs text-muted-foreground">Markdown</p>
              <pre className="mt-2 max-h-24 overflow-auto rounded-lg bg-surface-2 p-2 text-[10px] text-foreground">
                {embed.markdown}
              </pre>
              <Button
                variant="soft"
                size="sm"
                className="mt-2 w-full"
                onClick={() => copy("markdown", embed.markdown)}
              >
                {copied === "markdown" ? "Copied" : "Copy Markdown"}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "card" && (
          <div className="mt-2 space-y-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Share card for ${report.url}`}
                className="w-full rounded-xl border border-border"
              />
            ) : (
              <div
                className="w-full overflow-hidden rounded-xl border border-border"
                dangerouslySetInnerHTML={{ __html: generateShareHtml(report, publicUrl) }}
              />
            )}
            <Button
              variant="hero"
              className="w-full"
              onClick={generateCard}
              disabled={generating || !!imageUrl}
            >
              {generating ? (
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              ) : (
                <ImageIcon className="mr-2 size-4" aria-hidden />
              )}
              {imageUrl ? "Card generated" : "Generate AI share card"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
