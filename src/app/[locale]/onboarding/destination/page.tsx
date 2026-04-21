"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { getDraft, updateDraft } from "@/lib/trip-store";
import { ArrowRight, MapPin } from "lucide-react";

export default function OnboardingDestinationPage() {
  const t = useTranslations("Onboarding.destination");
  const router = useRouter();

  const [cityInput, setCityInput] = useState("");

  useEffect(() => {
    const draft = getDraft();
    if (draft.destination?.city) {
      const full = draft.destination.country
        ? `${draft.destination.city}, ${draft.destination.country}`
        : draft.destination.city;
      setCityInput(full);
    }
  }, []);

  const handleNext = () => {
    const trimmed = cityInput.trim();
    if (!trimmed) return;

    // Parseamos "City, Country" con coma opcional
    const parts = trimmed.split(",").map((s) => s.trim());
    const city = parts[0] ?? "";
    const country = parts.slice(1).join(", ");

    updateDraft({ destination: { city, country } });
    router.push("/onboarding/dates");
  };

  const tCommon = useTranslations("Onboarding");
  const isValid = cityInput.trim().length > 1;

  return (
    <OnboardingShell step={1} total={3} backHref="/onboarding">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MapPin className="h-6 w-6" />
      </div>

      <h1 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">{t("title")}</h1>

      <label className="mb-2 block text-sm font-medium text-foreground">{t("cityLabel")}</label>
      <input
        type="text"
        autoFocus
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        placeholder={t("cityPlaceholder")}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        onKeyDown={(e) => {
          if (e.key === "Enter" && isValid) handleNext();
        }}
      />

      <div className="mt-auto flex justify-end pt-8">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {tCommon("next")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </OnboardingShell>
  );
}

