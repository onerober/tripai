import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Sparkles, Compass, MousePointerClick, ArrowRight } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-accent/30">
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TripAi</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-12 text-center md:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Beta — powered by Claude
        </div>

        <h1 className="mb-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>

        <p className="mb-10 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          {t("subtitle")}
        </p>

        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
        >
          {t("cta")}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto grid max-w-5xl gap-4 px-6 pb-24 md:grid-cols-3 md:gap-6">
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title={t("features.smart.title")}
          description={t("features.smart.description")}
        />
        <FeatureCard
          icon={<Compass className="h-5 w-5" />}
          title={t("features.adaptive.title")}
          description={t("features.adaptive.description")}
        />
        <FeatureCard
          icon={<MousePointerClick className="h-5 w-5" />}
          title={t("features.simple.title")}
          description={t("features.simple.description")}
        />
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition hover:border-primary/40 hover:shadow-lg">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

