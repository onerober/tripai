"use client";

import { useEffect, useState, use } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getTrip } from "@/lib/trip-store";
import type { Trip } from "@/types/trip";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string; locale: string }>;
}) {
  const { tripId } = use(params);
  const t = useTranslations("TripDetail");

  const [trip, setTrip] = useState<Trip | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = getTrip(tripId);
    setTrip(found ?? null);
  }, [tripId]);

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">{t("notFound")}</h1>
          <Link href="/" className="text-primary underline">
            {t("backHome")}
          </Link>
        </div>
      </main>
    );
  }

  const handleCopy = async () => {
    if (!trip.masterDoc) return;
    await navigator.clipboard.writeText(trip.masterDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!trip.masterDoc) return;
    const blob = new Blob([trip.masterDoc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tripai-${trip.destination.city}-${trip.dates.arrival}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const destFull = trip.additionalDestinations?.length
    ? `${trip.destination.city} + ${trip.additionalDestinations.map((d) => d.city).join(" + ")}`
    : trip.destination.city;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur md:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backHome")}
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copied ? t("copied") : t("copy")}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            {t("download")}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12 md:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          {t("readyBadge")}
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">{destFull}</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          {trip.dates.arrival} → {trip.dates.departure}
        </p>

        <article className="prose prose-stone max-w-none whitespace-pre-wrap rounded-2xl border border-border bg-card p-8 text-sm leading-relaxed text-foreground md:text-base">
          {trip.masterDoc ?? t("noDoc")}
        </article>
      </section>
    </main>
  );
}

