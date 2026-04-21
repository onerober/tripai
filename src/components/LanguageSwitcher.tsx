"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "es" ? "en" : "es";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
      aria-label="Change language"
    >
      <Globe className="h-4 w-4" />
      {locale === "es" ? t("en") : t("es")}
    </button>
  );
}

