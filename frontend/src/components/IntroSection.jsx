"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection({ accueil, eglise }) {
  const sectionRef = useRef(null);
  const gsapContainerRef = useRef(null);
  const wordRef = useRef(null);
  const welcomeTitleRef = useRef(null);
  const welcomeDescRef = useRef(null);
  const welcomeRef = useRef(null);

  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // 🔁 ScrollIndicator visible uniquement en haut
  useLayoutEffect(() => {
    const handleScroll = () => {
      const isAtTop = window.scrollY < 100;
      setShowScrollIndicator(isAtTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!wordRef.current || !sectionRef.current || !welcomeRef.current)
        return;

      const words = wordRef.current.querySelectorAll("span");
      if (!words.length) return;

      gsap.set(words, { opacity: 0, y: 80, scale: 0.9 });
      gsap.set(welcomeRef.current, {
        opacity: 0,
        y: 0,
        scale: 0.6,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2000", // durée du scroll
          scrub: true,
          pin: sectionRef.current,
          anticipatePin: 1,
          markers: false,
        },
      });

      // Animation des mots
      words.forEach((word, i) => {
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2,
            ease: "none",
          },
          i * 0.5
        );
      });
      words.forEach((word, i) => {
        tl.to(word, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "none",
        });
      });
      words.forEach((word, i) => {
        tl.to(
          word,
          {
            filter: "blur(16px)",
            opacity: 0,
            duration: 1,
            ease: "none",
          },
          "+=" + (i * 0.2 + 0.3)
        );
      });
      tl.to(
        welcomeRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 4,
          ease: "none",
        },
        "-=0.6"
      );

      tl.to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        delay: 1,
        duration: 4,
        ease: "none",
      });
    }, gsapContainerRef);

    return () => ctx.revert();
  }, []);

  const titre = accueil?.titre ?? "Art & Patrimoine de DOAZIT";
  const nom = eglise?.nom?.trim() || "";
  const motsNom = nom.split(" ");
  const reste = motsNom.slice(0, -1).join(" ");
  const dernier = motsNom.slice(-1)[0];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen flex flex-col items-center text-center px-6 overflow-hidden"
    >
      {/* 🧠 Contenu animé */}
      <div
        ref={gsapContainerRef}
        className="relative z-10 max-w-[90vw] px-4 min-h-screen flex-col flex justify-center items-center"
      >
        {/* Titre animé mot par mot */}
        <h1
          ref={wordRef}
          className="relative z-10 text-church text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-center"
        >
          {titre.split(" ").map((word, i) => (
            <span key={i} className="inline-block mx-2 opacity-0">
              <span className="font-cloister">{word[0]}</span>
              <span className="font-garamond">{word.slice(1)}</span>
            </span>
          ))}
        </h1>

        {/* Bloc Welcome animé dans la même timeline */}
        <div
          ref={welcomeRef}
          className=" absolute z-20 text-white text-center max-w-4xl opacity-0 "
        >
          <h2
            ref={welcomeTitleRef}
            className="font-extrabold leading-tight drop-shadow-xl "
            style={{
              fontSize: "clamp(2rem, 6vw, 4rem)",
              lineHeight: "1.2",
            }}
          >
            Aidez-nous à préserver
            <br />
            ce trésor du patrimoine
          </h2>
          <p
            ref={welcomeDescRef}
            className="mt-6 font-medium drop-shadow-lg "
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              lineHeight: "2",
            }}
          >
            Chaque don contribue à restaurer
            <br />
            <span className="text-4xl md:text-5xl font-garamond">{reste} </span>
            <span className="text-4xl md:text-5xl font-garamond shadow-underline">
              {dernier}
            </span>
            <br />
          </p>
        </div>
      </div>
      {/* ⬇️ ScrollIndicator */}
      <div
        className={`absolute bottom-6 sm:bottom-10 z-40 pointer-events-none transition-opacity duration-500 ${
          showScrollIndicator ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <ScrollIndicator />
      </div>
    </section>
  );
}
