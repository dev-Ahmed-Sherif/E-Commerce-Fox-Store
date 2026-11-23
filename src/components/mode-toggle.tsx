"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "@/i18n/locale-provider";

const ModeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden className="opacity-0">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t.theme.toggle}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ModeToggle;
