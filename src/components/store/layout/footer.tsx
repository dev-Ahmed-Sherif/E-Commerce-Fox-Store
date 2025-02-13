"use client";

import Link from "next/link";
import { FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";

import Container from "@/components/ui/container";

import { options } from "@/lib/date-timeOptions";

const { year, timeZone } = options;

const Footer = () => {
  const socialLinks = [
    { href: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || "#", icon: FaFacebookF },
    { href: process.env.NEXT_PUBLIC_YOUTUBE_PAGE || "#", icon: FaYoutube },
    { href: process.env.NEXT_PUBLIC_INSTAGRAM_PAGE || "#", icon: FaWhatsapp },
  ];

  return (
    <footer className="bg-slate-600 border-t py-7 w-full fixed bottom-0 z-50">
      <Container>
        <div className="flex justify-evenly">
          <p className="text-center text-lg text-white">
            &copy; {new Date().toLocaleString("ar-EG", { year, timeZone })} فوكس
            , كل الحقوق محفوظة
          </p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-center text-lg text-white">تواصل معنا</p>

            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon size="2rem" className="text-white w-5 h-7" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
