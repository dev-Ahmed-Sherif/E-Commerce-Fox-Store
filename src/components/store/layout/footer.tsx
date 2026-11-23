"use client";

import Link from "next/link";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import FoxLogo from "@/components/brand/fox-logo";
import { useTranslations } from "@/i18n/locale-provider";

const Footer = () => {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-fox-charcoal text-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-4">
            <FoxLogo href="/" size="sm" />
            <div>
              <p className="font-display font-semibold">{t.brand.name}</p>
              <p className="text-sm text-white/70">{t.store.footerAbout}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+201032590927"
              className="text-sm text-white/80 hover:text-white"
            >
              {t.store.phone}
            </a>
            <Link
              href="https://www.facebook.com/FoxWorksEG"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2 transition hover:bg-fox-crimson"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://wa.me/201032590927"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2 transition hover:bg-fox-crimson"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </Link>
          </div>
        </motion.div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6 lg:px-8">
          © {year} Fox Store — فوكس ستور. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
