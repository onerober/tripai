"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import {
  getDraft,
  draftToTrip,
  saveTrip,
  setActiveTripId,
} from "@/lib/trip-store";
import type { Trip, TripDraft } from "@/types/trip";
import { Sparkles, Loader2 } from "lucide-react";

export default function OnboardingReviewPage() {
  const t = useTranslations("Onboarding.review");
  const router = useRouter();
  const locale = useLocale();

  const [draft, setDraft] = useState<TripDraft>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("");

  useEffect(() => {
    setDraft(getDraft());
  }, []);

  const destFull = draft.destination
    ? `${draft.destination.city}${draft.destination.country ? ", " + draft.destination.country : ""}`
    : "—";

  const datesFull =
    draft.dates?.arrival && draft.dates?.departure
      ? `${draft.dates.arrival} → ${draft.dates.departure}`
      : "—";

  const progressMessages =
    locale === "en"
      ? [
          "Analyzing your destination...",
          "Searching events for your dates...",
          "Building itineraries...",
          "Calculating transport times...",
          "Tailoring to your preferences...",
        ]
      : [
          "Analizando tu destino...",
          "Buscando eventos para tus fechas...",
          "Armando itinerarios...",
          "Calculando tiempos de transporte...",
          "Personalizando a tus preferencias...",
        ];

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    // Rotar mensajes de progreso
    let msgIdx = 0;
    setProgressMsg(progressMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % progressMessages.length;
      setProgressMsg(progressMessages[msgIdx]);
    }, 4000);

    try {
      const trip: Trip = draftToTrip(draft);

      const res = await fetch("/api/generate-master-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip, locale }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { masterDoc: string };
      trip.masterDoc = data.masterDoc;
      saveTrip(trip);
      setActiveTripId(trip.id);

      clearInterval(interval);
      router.push(`/trips/${trip.id}`);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setProgressMsg("");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (loading) {
    return (
      <OnboardingShell step={3} total={3} backHref="/onboarding">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="mb-3 text-2xl font-semibold">{t("generating")}</h2>
          <p className="text-muted-foreground">{progressMsg}</p>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell step={3} total={3} backHref="/onboarding/dates">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>

      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">{t("title")}</h1>

      <div className="space-y-3">
        <SummaryRow label={t("destinationLabel")} value={destFull} />
        <SummaryRow label={t("datesLabel")} value={datesFull} />
        <SummaryRow
          label={t("travelersLabel")}
          value={String(draft.travelers?.count ?? "—")}
        />
        <SummaryRow
          label={t("accommodationLabel")}
          value={draft.accommodation?.address ?? "—"}
        />
        <SummaryRow
          label={t("preferencesLabel")}
          value={
            draft.preferences?.chips && draft.preferences.chips.length > 0
              ? draft.preferences.chips.join(", ")
              : "—"
          }
        />
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {t("errorPrefix")}: {error}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-8">
        <p className="text-center text-xs text-muted-foreground">{t("estimationInfo")}</p>
        <button
          onClick={handleGenerate}
          disabled={!draft.destination?.city || !draft.dates?.arrival}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <Sparkles className="h-4 w-4" />
          {t("generateButton")}
        </button>
      </div>
    </OnboardingShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

