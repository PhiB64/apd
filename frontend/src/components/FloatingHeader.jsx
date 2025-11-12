"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import DonationButton from "@components/DonationButton";
import "hamburgers/dist/hamburgers.min.css";

export default function FloatingHeader({ site, onContactClick, isVisible }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const rawLogoUrl =
    site?.logo?.url ?? site?.logo?.data?.attributes?.url ?? "/logo.png";

  const logoUrl = rawLogoUrl.startsWith("http")
    ? rawLogoUrl
    : `${process.env.NEXT_PUBLIC_API_URL}${rawLogoUrl}`;

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "L'association", href: "/association" },
    { label: "Devenez partenaire", href: "/partners" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", action: onContactClick },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      {/* 🧭 Header desktop */}
      <header
        className={`fixed top-3 left-0 right-0 z-999 flex justify-center transition-opacity duration-500 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-sm px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between w-full max-w-screen-lg mx-4 overflow-hidden min-h-[64px] hidden md:flex">
          <Image
            src={logoUrl}
            alt="Logo"
            width={100}
            height={40}
            className="rounded-md flex-shrink-0 p-1"
            priority
          />
          <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8 text-black flex-wrap justify-end w-full">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  onClick={() => router.push(link.href)}
                  className={`cursor-pointer transition hover:text-red-700 ${
                    pathname === link.href ? "text-[#ac1115] font-semibold" : ""
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="transition hover:text-red-700 text-black cursor-pointer"
                >
                  {link.label}
                </button>
              )
            )}
            <DonationButton href={site?.url_don} className="ml-2" />
          </nav>
        </div>
      </header>

      {/* 🧭 Header mobile */}
      <header
        className={`fixed top-3 left-0 right-0 z-999 flex items-center justify-between px-4 py-2 bg-white/60 backdrop-blur-md shadow-md rounded-sm md:hidden transition-opacity duration-500 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Image
          src={logoUrl}
          alt="Logo"
          width={80}
          height={32}
          className="rounded-md flex-shrink-0"
          priority
        />
        <div className="flex items-center gap-3">
          <a
            href={site?.url_don}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-[#ac1115] hover:text-red-700 transition"
            aria-label="Faire un don"
          >
            <DonationButton href={site?.url_don} variant="header" />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative w-10 h-10 flex items-center justify-center 
    rounded-full bg-white shadow-md transition duration-300 
    focus:outline-none`}
            aria-label="Menu"
          >
            <span
              className={`hamburger hamburger--collapse ${menuOpen ? "is-active" : ""}`}
              style={{
                position: "absolute",
                top: "55%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(0.5)",
              }}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* 📱 Menu mobile */}
      <div
        className={`fixed top-0 left-0 w-full h-screen z-[60] flex items-center justify-center transform transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="w-full h-full bg-[#ac1115] backdrop-blur-md shadow-xl px-8 py-12 flex flex-col items-center justify-center gap-6 text-white">
          {navLinks.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-lg transition  ${
                  pathname === link.href ? "text-white" : ""
                }`}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                onClick={() => {
                  setMenuOpen(false);
                  link.action?.();
                }}
                className="text-lg transition text-white "
              >
                {link.label}
              </button>
            )
          )}

          <DonationButton
            href={site?.url_don}
            variant="menu"
            className="mt-6 border-white border pulse-button "
          />
        </div>
      </div>
    </>
  );
}
