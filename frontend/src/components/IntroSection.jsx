"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";

import ScrollIndicator from "./ScrollIndicator";
import useIsMobile from "@hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection({ eglise }) {
  const sectionRef = useRef(null);
  const welcomeRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showSoundButton, setShowSoundButton] = useState(true);

  const isMobile = useIsMobile();

  // 🔁 ScrollIndicator visible uniquement en haut
  useLayoutEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔊 Réinitialise le mute au chargement
  useLayoutEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  // 🎬 Animation GSAP + mute à la sortie
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !welcomeRef.current) return;

      gsap.set(welcomeRef.current, { opacity: 0, y: 0, scale: 0.6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=500" : "+=1000",
          scrub: true,
          pin: sectionRef.current,
          anticipatePin: 1,
          markers: false,
        },
      });

      tl.to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 4,
        ease: "none",
      });

      tl.to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        delay: 1,
        duration: 4,
        ease: "none",
      });

      // 🔇 Mute automatique à la sortie de la section
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
    }, sectionRef);

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
      ref={sectionRef}
      className="relative h-screen w-screen flex items-center justify-center text-center px-6 overflow-hidden"
    >
      <div
        ref={welcomeRef}
        className="z-20 text-white text-center w-full max-w-[80vw] opacity-0 px-4"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
          Aidez-nous à préserver
          <br />
          un trésor du patrimoine
        </h2>
        <p className="mt-6">
          <span className="text-4xl md:text-5xl leading-relaxed font-garamond">
            {reste}{" "}
          </span>
          <span className="text-4xl md:text-5xl leading-relaxed font-garamond shadow-underline">
            {dernier}
          </span>
        </p>
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

      {/* 🔊 Bouton son fixe */}
      {showSoundButton && (
        <div className="fixed bottom-6 right-6 z-50 transition-opacity duration-500">
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-md shadow-md hover:bg-white/20 transition flex items-center justify-center"
            aria-label="Activer/Désactiver le son"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}
    </section>
  );
}
