"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "bn", label: "Bengali", native: "বাংলা" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "mr", label: "Marathi", native: "मराठी" },
    { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
    { code: "ur", label: "Urdu", native: "اردو" },
    { code: "od", label: "Odia", native: "ଓଡ଼ିଆ" },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const switchLanguage = (code: string) => {
        router.replace(pathname, { locale: code });
        setOpen(false);
    };

    const current = languages.find((l) => l.code === locale) || languages[0];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-9 items-center gap-1.5 rounded-full border border-(--color-border-muted) bg-(--color-surface-muted) px-3 py-1.5 text-sm font-semibold text-(--color-text-primary) shadow-sm transition-colors hover:bg-(--color-border-muted) sm:h-10 sm:px-4 sm:py-2"
            >
                <Globe size={16} className="text-emerald-600" />
                <span className="hidden sm:inline">{current.native}</span>
                <span className="sm:hidden">{locale.toUpperCase()}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-(--color-border-muted) bg-(--color-surface-page) shadow-lg">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`dark:hover:text-emerald-450 flex w-full items-center justify-between px-3 py-1.5 text-left text-sm font-semibold transition-colors hover:bg-emerald-50 hover:text-emerald-700 sm:px-4 sm:py-2 dark:hover:bg-emerald-950/20 ${locale === lang.code ? "dark:text-emerald-450 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20" : "text-(--color-text-primary)"}`}
                        >
                            <span>{lang.native}</span>
                            {locale === lang.code && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
