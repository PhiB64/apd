"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection({ partners }) {
  const sectionRef = useRef(null);
  const textBlockRef = useRef(null);
  const logoBlockRef = useRef(null);
  const logosRef = useRef([]);
  const imagesRef = useRef([]);
  const divRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+70%",
          scrub: true,
          pin: sectionRef.current,
          anticipatePin: 2,
          markers: false,
        },
      });

      // Animation texte
      tl.fromTo(
        textBlockRef.current,
        { xPercent: -200, opacity: 1 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 10,
          ease: "none",
        }
      );

      // Animation logos
      tl.fromTo(
        logoBlockRef.current,
        { xPercent: 200, opacity: 1 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 10,
          ease: "none",
        },
        "-=10"
      );

      tl.to(logoBlockRef.current, {
        xPercent: 0,
        opacity: 1,
        duration: 3,
        ease: "none",
      });

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className=" relative min-h-screen w-full overflow-hidden bg-[#ac1115] flex items-center justify-center"
    >
      <div
        ref={divRef}
        className="absolute max-w-6xl w-full h-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center"
      >
        {/* Bloc texte */}
        <div ref={textBlockRef} className="space-y-4 px-4">
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

          {/* ✅ Bouton rapproché des logos */}
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
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center justify-center px-4"
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
                ref={(el) => (logosRef.current[index] = el)}
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
