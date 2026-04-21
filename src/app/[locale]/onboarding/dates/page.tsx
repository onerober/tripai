"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import { getDraft, updateDraft } from "@/lib/trip-store";
import { ArrowRight, Calendar } from "lucide-react";

function diffInDays(a: string, b: string): number {
  if (!a || !b) return 0;
  const start = new Date(a);
  const end = new Date(b);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function OnboardingDatesPage() {
  const t = useTranslations("Onboarding.dates");
  const tCommon = useTranslations("Onboarding");
  const router = useRouter();

  const [arrival, setArrival] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departure, setDeparture] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  useEffect(() => {
    const draft = getDraft();
    if (draft.dates) {
      setArrival(draft.dates.arrival ?? "");
      setArrivalTime(draft.dates.arrivalTime ?? "");
      setDeparture(draft.dates.departure ?? "");
      setDepartureTime(draft.dates.departureTime ?? "");
    }
  }, []);

  const days = useMemo(() => diffInDays(arrival, departure), [arrival, departure]);

  const isValid = arrival && departure && new Date(departure) > new Date(arrival);

  const handleNext = () => {
    if (!isValid) return;
    updateDraft({
      dates: {
        arrival,
        arrivalTime: arrivalTime || undefined,
        departure,
        departureTime: departureTime || undefined,
      },
    });
    router.push("/onboarding/review");
  };

  return (
    <OnboardingShell step={2} total={3} backHref="/onboarding/destination">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Calendar className="h-6 w-6" />
      </div>

      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">{t("title")}</h1>

      <div className="space-y-6">
        <DateTimeField
          label={t("arrivalLabel")}
          timeLabel={t("arrivalTimeLabel")}
          date={arrival}
          time={arrivalTime}
          onDateChange={setArrival}
          onTimeChange={setArrivalTime}
        />

        <DateTimeField
          label={t("departureLabel")}
          timeLabel={t("departureTimeLabel")}
          date={departure}
          time={departureTime}
          onDateChange={setDeparture}
          onTimeChange={setDepartureTime}
        />

        {days > 0 && (
          <div className="rounded-xl bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
            {t("durationInfo", { days })}
          </div>
        )}
      </div>

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

function DateTimeField({
  label,
  timeLabel,
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  label: string;
  timeLabel: string;
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          placeholder={timeLabel}
          className="rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}

