"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";
import ScrollIndicator from "./ScrollIndicator";
import DonationButton from "@components/DonationButton";
import useIsMobile from "@hooks/useIsMobile";
import { useHeaderDonation } from "@contexts/HeaderDonationContext";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection({ eglise }) {
  const sectionRef = useRef(null);
  const welcomeRef = useRef(null);
  const buttonRef = useRef(null);
  const gsapScope = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const isMobile = useIsMobile();
  const { setShowDonationButton } = useHeaderDonation();

  useEffect(() => {
    setShowDonationButton(false);
  }, [setShowDonationButton]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 100;
      setShowScrollIndicator(isTop);
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
    if (!sectionRef.current || !welcomeRef.current || !buttonRef.current)
      return;

    const ctx = gsap.context(() => {
      gsap.set([welcomeRef.current, buttonRef.current], {
        opacity: 0,
        scale: 0.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(welcomeRef.current, {
        opacity: 1,
        scale: 1,
        ease: "none",
      })
        .to(
          buttonRef.current,
          {
            opacity: 1,
            scale: 1,
            ease: "none",
          },
          "+=0.3"
        )
        .to(
          buttonRef.current,
          {
            opacity: 0,
            scale: 0.6,
            ease: "none",
            onComplete: () => setShowDonationButton(true),
          },
          "+=0.6"
        );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        onLeaveBack: () => setShowDonationButton(false),
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
  }, [isMobile, setShowDonationButton]);

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
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center"
    >
      {/* Contenu centré */}
      <div
        ref={welcomeRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-xl text-white text-center">
          Aidez-nous à préserver
          <br />
          ce trésor du patrimoine
        </h1>

        <p className="mt-4 sm:mt-6 text-4xl md:text-5xl font-garamond leading-relaxed text-white/90 text-center">
          {reste} <span className="shadow-underline text-white">{dernier}</span>
        </p>

        <div ref={buttonRef} className="mt-8">
          <DonationButton variant="intro" />
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div
        className={`absolute bottom-6 z-40 pointer-events-none transition-opacity duration-500 ${
          showScrollIndicator ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>

      {/* Bouton mute */}
      <div className="absolute bottom-6 right-6 z-50">
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
