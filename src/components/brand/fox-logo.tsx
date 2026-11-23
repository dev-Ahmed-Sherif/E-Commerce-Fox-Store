"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type FoxLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: 40,
  md: 56,
  lg: 88,
};

export default function FoxLogo({
  href = "/",
  size = "md",
  showWordmark = false,
  className = "",
}: FoxLogoProps) {
  const px = sizes[size];

  const content = (
    <motion.span
      className={`inline-flex items-center gap-3 ${className}`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      <span className="relative overflow-hidden rounded-full ring-2 ring-fox-crimson/30 shadow-[0_0_0_4px_hsl(var(--fox-crimson)/0.08)]">
        <Image
          src="/fox-store-logo.jpg"
          alt="Fox Store"
          width={px}
          height={px}
          className="rounded-full object-cover"
          priority
        />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold tracking-tight text-fox-crimson">
            FOX STORE
          </span>
          <span className="font-arabic text-xs text-muted-foreground">
            فوكس ستور
          </span>
        </span>
      )}
    </motion.span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
      {content}
    </Link>
  );
}
