"use client";

import {
  FormEvent,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type LeadContext = {
  href: string;
  channel: "whatsapp" | "email";
  pageTitle: string;
  pageUrl: string;
  service?: string;
  originalMessage?: string;
};

type WhatsAppLeadRequest = {
  href: string;
  channel: "whatsapp" | "email";
};

const SERVICE_LABELS: Record<string, string> = {
  "/services/solution-architecture": "Solution Architecture",
  "/services/systems-engineering": "Systems Engineering",
  "/services/integration-automation": "Integration & Automation",
  "/services/search-visibility-ai-discovery":
    "Search Visibility & AI Discovery",
  "/services/technical-modernisation": "Technical Modernisation",
};

function getService(pathname: string) {
  return Object.entries(SERVICE_LABELS).find(
    ([path]) => pathname === path,
  )?.[1];
}

function buildMessage(
  context: LeadContext,
  name?: string,
  phone?: string,
  company?: string,
) {
  const lines = [
    context.originalMessage || "Hi Sparkline, I'd like to discuss a project",
    "",
  ];

  if (name) lines.push(`Name: ${name}`);
  if (phone) lines.push(`Phone: ${phone}`);
  if (company) lines.push(`Company: ${company}`);
  if (context.service) lines.push(`Service: ${context.service}`);
  lines.push(`Enquiry page: ${context.pageTitle}`, context.pageUrl);
  return lines.join("\n");
}

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-input bg-background px-3.5 py-3 text-base font-normal outline-none ring-offset-background placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring aria-invalid:border-destructive";

export function WhatsAppLeadCapture() {
  const [context, setContext] = useState<LeadContext | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const whatsappLinks =
      document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me/"]');
    whatsappLinks.forEach((link) => {
      link.dataset.whatsappHref = link.href;
      link.href = "#whatsapp";
    });

    const openLeadDialog = (href: string, channel: "whatsapp" | "email") => {
      const url = new URL(href, window.location.href);
      const originalMessage = url.searchParams.get("text") || undefined;
      setContext({
        href,
        channel,
        pageTitle: document.title.replace(/\s+\|\s+Sparkline Labs$/, ""),
        pageUrl: window.location.href,
        service: getService(window.location.pathname),
        originalMessage,
      });
      setError("");
      setShowErrors(false);
      setName("");
      setPhone("");
      setCompany("");
    };

    const handleLeadRequest = (event: Event) => {
      const { href, channel } = (event as CustomEvent<WhatsAppLeadRequest>)
        .detail;
      if (href) openLeadDialog(href, channel);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>(
        'a[data-whatsapp-href], a[href*="wa.me/"], a[href^="mailto:"]',
      );
      if (!link) return;

      event.preventDefault();
      const href = link.dataset.whatsappHref || link.href;
      openLeadDialog(
        href,
        link.matches('a[href^="mailto:"]') ? "email" : "whatsapp",
      );
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("whatsapp-lead-request", handleLeadRequest);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("whatsapp-lead-request", handleLeadRequest);
    };
  }, []);

  const close = () => {
    if (isSaving) return;
    setContext(null);
  };

  const openChat = (href: string, channel: LeadContext["channel"]) => {
    if (channel === "email") {
      window.location.href = href;
      return;
    }
    const chatWindow = window.open(
      "about:blank",
      "_blank",
      "noopener,noreferrer",
    );
    if (chatWindow) {
      chatWindow.location.href = href;
    } else {
      window.location.href = href;
    }
  };

  const logLead = async (captureStatus: "captured" | "skipped") => {
    if (!context) return false;
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        service: context.service,
        pageTitle: context.pageTitle,
        pageUrl: context.pageUrl,
        channel: context.channel,
        captureStatus,
      }),
    });
    return response.ok;
  };

  const skip = async () => {
    if (!context) return;
    setIsSaving(true);
    const href = new URL(context.href);
    if (context.channel === "whatsapp")
      href.searchParams.set("text", buildMessage(context));
    try {
      if (!(await logLead("skipped"))) throw new Error("Lead log failed");
    } catch {
      setError("We could not log this enquiry. Please try again.");
      setIsSaving(false);
      return;
    }
    setContext(null);
    openChat(href.toString(), context.channel);
  };

  const saveAndContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!context) return;
    if (!name.trim() || !phone.trim()) {
      setShowErrors(true);
      setError("Please enter your name and phone number to continue.");
      return;
    }

    setIsSaving(true);
    setError("");
    const href = new URL(context.href);
    if (context.channel === "whatsapp") {
      href.searchParams.set(
        "text",
        buildMessage(context, name.trim(), phone.trim(), company.trim()),
      );
    }

    try {
      if (!(await logLead("captured"))) throw new Error("Lead save failed");
      setContext(null);
      openChat(href.toString(), context.channel);
    } catch {
      setError(
        "We could not save your details. Please try again or continue without saving.",
      );
      setIsSaving(false);
    }
  };

  if (!context) return null;

  const channelName = context.channel === "email" ? "email" : "WhatsApp";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-foreground/50 px-4 py-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-capture-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close contact form"
          className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="mb-2 text-base uppercase tracking-widest text-muted-foreground">
          Before {channelName}
        </p>
        <h2
          id="lead-capture-title"
          className="pr-8 text-2xl font-semibold tracking-tight text-foreground"
        >
          How can we address you?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          So we know who we are speaking to when your message arrives.{" "}
          {context.channel === "email"
            ? "Your email app opens next."
            : "WhatsApp opens next with your message ready to send."}
        </p>

        <form onSubmit={saveAndContinue} noValidate className="mt-6 space-y-5">
          <label className="block text-base font-medium text-foreground">
            Your name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              aria-invalid={showErrors && !name.trim()}
              className={inputClass}
            />
          </label>
          <label className="block text-base font-medium text-foreground">
            Phone number
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              type="tel"
              inputMode="tel"
              placeholder="+263 77 123 4567"
              aria-invalid={showErrors && !phone.trim()}
              aria-describedby="lead-phone-hint"
              className={inputClass}
            />
            <span
              id="lead-phone-hint"
              className="mt-1.5 block text-base font-normal text-muted-foreground"
            >
              Include your country code so we can call back if needed.
            </span>
          </label>
          <label className="block text-base font-medium text-foreground">
            Company{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              autoComplete="organization"
              className={inputClass}
            />
          </label>
          {error && (
            <p role="alert" className="text-base text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={skip}
              disabled={isSaving}
              className="text-base text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
            >
              Skip and open {channelName}
            </button>
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="group w-full text-base bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              {isSaving ? `Opening ${channelName}...` : "Continue"}
              {!isSaving && (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </div>
          <p className="text-base text-muted-foreground">
            We use these details to follow up on your enquiry. See our{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              privacy policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

export function WhatsAppLeadTrigger({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "asChild" | "onClick"> & {
  href: string;
  children: ReactNode;
}) {
  const requestLeadCapture = () => {
    window.dispatchEvent(
      new CustomEvent<WhatsAppLeadRequest>("whatsapp-lead-request", {
        detail: { href, channel: "whatsapp" },
      }),
    );
  };

  return (
    <Button type="button" {...props} onClick={requestLeadCapture}>
      {children}
    </Button>
  );
}
