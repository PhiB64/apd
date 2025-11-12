"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Architecture = forwardRef(({ styleArchitectural, plan }, ref) => {
  const imageRef = useRef(null); // ✅ ref pour l’image

  if (!styleArchitectural || styleArchitectural.length === 0) return null;

  const planUrl =
    plan?.formats?.medium?.url ??
    plan?.formats?.small?.url ??
    plan?.url ??
    null;

  // ✅ Animation GSAP au scroll
  useLayoutEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: 0.2, opacity: 0 });
      gsap.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          end: "bottom center",
          scrub: false,
          toggleActions: "play none none reverse",
        },
      });
    }, imageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center ">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10 items-center text-black pt-15">
        {/* 📝 Texte à gauche */}
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-3xl md:text-4xl font-garamond leading-snug break-words">
            Le style{" "}
            <span className="text-white shadow-underline">architectural</span>
          </h2>
          <div className="text-sm md:text-base space-y-2 leading-tight text-justify">
            {styleArchitectural?.map((para, index) => {
              const text = para?.children?.[0]?.text?.trim();
              return text ? (
                <p key={index} className={index === 0 ? "lettrine" : ""}>
                  {text}
                </p>
              ) : null;
            })}
          </div>
        </div>

        {/* 🖼️ Plan à droite */}
        {planUrl && (
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div
              ref={imageRef}
              className="relative w-full max-w-[24rem] aspect-[3/4] overflow-hidden shadow-xl border-3 border-[#ac1115] self-stretch"
            >
              <Image
                src={planUrl}
                alt="Plan architectural de l’église"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Architecture;
