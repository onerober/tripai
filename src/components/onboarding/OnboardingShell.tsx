"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

interface Props {
  step: number;
  total: number;
  backHref?: string;
  children: React.ReactNode;
}

export default function OnboardingShell({ step, total, backHref = "/onboarding", children }: Props) {
  const t = useTranslations("Onboarding");

  return (
    <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/20">
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
        <div className="text-xs font-medium text-muted-foreground">
          {t("step", { current: step, total })}
        </div>
      </header>

      {/* Progress bar */}
      <div className="mx-auto w-full max-w-xl px-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-12">
        {children}
      </section>
    </main>
  );
}

