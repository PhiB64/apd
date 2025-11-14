"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection({ partners }) {
  const scopeRef = useRef(null);
  const textBlockRef = useRef(null);
  const logoBlockRef = useRef(null);
  const imagesRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "+=70%",
          scrub: true,
          pin: true,
          anticipatePin: 4,
          pinSpacing: true,
          markers: true,
        },
      });

      // Animation texte
      tl.fromTo(
        textBlockRef.current,
        { xPercent: -50, opacity: 0 },
        { xPercent: 0, opacity: 1, ease: "power2.out" }
      );

      // Animation logos
      tl.fromTo(
        logoBlockRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power2.out" },
        "<" // démarre en même temps que le texte
      );

      // Effets de survol sur les logos
      imagesRef.current.forEach((img) => {
        if (!img) return;
        img.addEventListener("mouseenter", () => {
          gsap.to(img, {
            scale: 1.05,
            rotation: 10,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        img.addEventListener("mouseleave", () => {
          gsap.to(img, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <section
      ref={scopeRef}
      className="relative min-h-screen w-full overflow-y-hidden bg-[#ac1115] flex items-center justify-center"
    >
      <div className=" max-w-6xl w-full h-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Bloc texte */}
        <div ref={textBlockRef} className="space-y-4 px-6 pt-28 md:pt-0">
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
            className="inline-block px-6 py-2 rounded-sm bg-white text-[#ac1115] font-semibold shadow-md hover:bg-[#f9f5ef] transition-all duration-300 w-fit mt-4"
          >
            Devenez partenaire
          </a>
        </div>

        {/* Bloc logos */}
        <div
          ref={logoBlockRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center justify-center px-12 py-10"
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
