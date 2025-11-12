"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import ScrollIndicator from "./ScrollIndicator";
import useIsMobile from "@hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection({ eglise }) {
  const sectionRef = useRef(null);
  const welcomeRef = useRef(null);
  const gsapScope = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current || !welcomeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(welcomeRef.current, { opacity: 0, y: 0, scale: 0.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=500" : "+=1000",
          scrub: true,
          pin: sectionRef.current,
          anticipatePin: 1,
        },
      });

      tl.to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 9, // ⬅️ durée augmentée pour ralentir l’apparition
        ease: "power2.out", // ⬅️ transition plus douce
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          const video = document.querySelector("video");
          if (video) {
            video.muted = true;
            setIsMuted(true);
          }
        },
      });
    }, gsapScope);

    return () => ctx.revert();
  }, [isMobile]);

  const toggleMute = () => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const nom = eglise?.nom?.trim() || "";
  const motsNom = nom.split(" ");
  const reste = motsNom.slice(0, -1).join(" ");
  const dernier = motsNom.slice(-1)[0];

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        gsapScope.current = el;
      }}
      className="relative h-screen w-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* 🪧 Titre animé */}
      <div
        ref={welcomeRef}
        className="z-20 text-white flex flex-col items-center justify-center w-full px-4"
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 sm:p-4 w-full max-w-4xl">
          {/* Logo */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto">
            <Image
              src="/whiteLogo.png"
              alt="Logo blanc"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-xl text-white text-center mt-6">
            Aidez-nous à préserver
            <br />
            ce trésor du patrimoine
          </h1>

          {/* Sous-titre */}
          <p className="mt-4 sm:mt-6 text-4xl  md:text-5xl font-garamond leading-relaxed text-white/90 text-center">
            {reste}{" "}
            <span className="shadow-underline text-white">{dernier}</span>
          </p>
        </div>
      </div>

      {/* ⬇️ Scroll Indicator */}
      <div
        className={`absolute bottom-6 sm:bottom-10 z-40 pointer-events-none transition-opacity duration-500 ${
          showScrollIndicator ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>

      {/* 🔊 Bouton son */}
      <div className="fixed bottom-6 right-6 z-50 transition-opacity duration-500">
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-md shadow-md hover:bg-white/20 transition flex items-center justify-center"
          aria-label="Activer/Désactiver le son"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </section>
  );
}
