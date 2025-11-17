"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ErrorMessage from "@components/ErrorMessage";
import useIsMobile from "@hooks/useIsMobile"; // ✅ hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection({ partners, error, isLoading }) {
  const scopeRef = useRef(null);
  const textBlockRef = useRef(null);
  const logoBlockRef = useRef(null);
  const imagesRef = useRef([]);

  const isMobile = useIsMobile(); // ✅ au bon endroit

  // ✅ Toujours appeler les hooks avant tout return
  useLayoutEffect(() => {
    if (!partners || partners.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoBlockRef.current,
        { opacity: 0, scale: 0.5 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scopeRef.current,
            start: isMobile ? "+=220%top" : "+370% top",
            end: isMobile ? "+=240%top" : "+=390% top",
            toggleActions: "play none none reverse",
            scrub: 0.5,
            markers: false,
          },
        }
      );

      imagesRef.current.forEach((img) => {
        if (!img) return;
        const enter = () =>
          gsap.to(img, {
            scale: 1.05,
            rotation: 10,
            duration: 0.3,
            ease: "power2.out",
          });
        const leave = () =>
          gsap.to(img, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });

        img.addEventListener("mouseenter", enter);
        img.addEventListener("mouseleave", leave);
        img._gsapCleanup = () => {
          img.removeEventListener("mouseenter", enter);
          img.removeEventListener("mouseleave", leave);
        };
      });
    }, scopeRef);

    return () => {
      imagesRef.current.forEach((img) => img?._gsapCleanup?.());
      ctx.revert();
    };
  }, [partners]);

  // ✅ Gestion des états après les hooks
  if (isLoading) {
    return (
      <ErrorMessage
        type="loading"
        message="Chargement des partenaires en cours..."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        type="error"
        message={`Erreur lors du chargement des partenaires : ${error}`}
      />
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <ErrorMessage
        type="empty"
        message="Aucun partenaire à afficher pour le moment."
      />
    );
  }

  // ✅ Rendu principal
  return (
    <section
      ref={scopeRef}
      className="relative z-10 w-full min-h-screen bg-[#ac1115] flex items-center justify-center"
    >
      <div className="relative max-w-6xl w-full min-h-screen mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Bloc texte */}
        <div ref={textBlockRef} className="space-y-4 px-6 pt-20 md:pt-0">
          <h2 className="text-3xl sm:text-4xl font-garamond leading-snug drop-shadow-xl text-white">
            Nos <span className="shadow-underline text-white">partenaires</span>
          </h2>
          <div className="text-base sm:text-lg lettrine_w space-y-2 leading-relaxed text-justify font-garamond text-white/90">
            <p className="lettrine_w">
              Ils accompagnent notre démarche patrimoniale et soutiennent la
              transmission des mémoires locales. Leur engagement contribue à
              faire rayonner les lieux, les récits et les savoir-faire qui
              composent l’identité vivante de notre territoire.
            </p>
          </div>
          <a
            href="/partners"
            className="inline-block px-6 py-2 rounded-sm bg-[#ac1115] text-white font-semibold shadow-md hover:bg-[#f9f5ef] transition-all duration-300 w-fit mt-4"
          >
            Devenez partenaire
          </a>
        </div>

        {/* Bloc logos */}
        <div
          ref={logoBlockRef}
          className="grid grid-cols-2 gap-5 px-6 md:px-12 py-0 md:py-10 pb-20 md:pb-0"
        >
          {partners.map((partner, index) => {
            const logo = partner.logo?.[0];
            const imageUrl =
              logo?.formats?.medium?.url ??
              logo?.formats?.small?.url ??
              logo?.formats?.thumbnail?.url ??
              logo?.url;

            return (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform"
              >
                <div className="flex items-center justify-center bg-[#f9f5ef] rounded-lg shadow-md aspect-[4/3] overflow-hidden">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={logo?.name || "Logo partenaire"}
                      width={200}
                      height={150}
                      className="object-contain max-h-full max-w-full p-2"
                      ref={(el) => (imagesRef.current[index] = el)}
                    />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
