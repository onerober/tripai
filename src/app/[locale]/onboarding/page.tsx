import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingWelcomePage() {
  const t = useTranslations("Onboarding");

  return (
    <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/20">
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          TripAi
        </Link>
        <div className="text-xs font-medium text-muted-foreground">
          {t("step", { current: 0, total: 3 })}
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>

        <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {t("welcome.title")}
        </h1>

        <p className="mb-10 max-w-md text-balance text-muted-foreground md:text-lg">
          {t("welcome.description")}
        </p>

        <Link
          href="/onboarding/destination"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
        >
          {t("welcome.startButton")}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </section>
    </main>
  );
}

