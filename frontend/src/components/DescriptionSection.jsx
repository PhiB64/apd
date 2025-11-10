"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gallery from "./Gallery";
import Interview from "./Interview";
import useIsMobile from "@hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function DescriptionSection({
  eglise,
  interviewBlock,
  onEnter,
  onLeave,
}) {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const descriptionRef = useRef(null);
  const architectureRef = useRef(null);
  const interviewRef = useRef(null);
  const imageRef = useRef(null);

  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!sectionRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      const slides = [
        descriptionRef.current,
        architectureRef.current,
        interviewRef.current,
      ];

      gsap.set(sliderRef.current, {
        width: "inherit",
        display: "flex",
      });

      gsap.set(slides, {
        width: "100%",
        flexShrink: 0,
      });

      gsap.to(sliderRef.current, {
        xPercent: -290,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "top+=800%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, onEnter, onLeave]);

  const nom = eglise?.nom?.trim() || "";
  const mots = nom.split(" ");
  const premier = mots[0];
  const reste = mots.slice(1, -1).join(" ");
  const dernier = mots.slice(-1)[0];

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

  const titreInterview = interviewBlock?.titre;
  const descriptionInterview =
    interviewBlock?.description?.[0]?.children?.[0]?.text;
  const videoUrl = interviewBlock?.video?.url;

  const hasInterviewContent =
    titreInterview || descriptionInterview || videoUrl;

  if (!eglise && !hasInterviewContent) return null;

  return (
    <section
      ref={sectionRef}
      id="description-anchor"
      className="relative w-full overflow-x-hidden h-full"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/fond_pierre.jpg")' }}
      />

      <div
        ref={sliderRef}
        className={`relative z-10 ${isMobile ? "flex flex-col" : "h-full"}`}
      >
        {/* Bloc description */}
        <div
          ref={descriptionRef}
          className="flex items-center justify-center px-6 pt-10"
        >
          <div className="max-w-4xl w-full flex flex-col md:flex-row gap-10 items-center text-black">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-garamond leading-snug break-words">
                {premier}
                <br />
                {reste}{" "}
                <span className="text-white shadow-underline">{dernier}</span>
              </h2>
              {Array.isArray(eglise?.description) && (
                <div className="text-sm md:text-base lettrine space-y-2 leading-relaxed text-justify">
                  {eglise.description.map((para, index) => {
                    const text = para?.children?.[0]?.text?.trim();
                    return text ? (
                      <p key={index} className={index === 0 ? "lettrine" : ""}>
                        {text}
                      </p>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            {eglise?.image_principale && (
              <div className="md:w-1/2 w-full">
                <div className="relative w-full h-[20em] md:h-[30em] aspect-[3/4] rounded-t-full overflow-hidden shadow-xl border-3 border-white">
                  <Image
                    src={getImageUrl(eglise.image_principale)}
                    alt="Image principale"
                    fill
                    className="object-cover scale-110 object-[45%_top]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/*Galerie */}
        <div
          className={`h-full flex items-center justify-center ${
            isMobile ? "w-full" : "w-[50vw]"
          }`}
        >
          <div>
            <Gallery images={eglise?.images ?? []} />
          </div>
        </div>

        {/* Architecture */}
        <div
          ref={architectureRef}
          className="flex items-center justify-center px-6"
        >
          <div className="max-w-3xl text-black space-y-4">
            <h3 className="text-2xl md:text-3xl font-semibold font-garamond">
              Architecture
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-justify">
              {eglise?.architecture?.[0]?.children?.[0]?.text ??
                "Découvrez les caractéristiques architecturales de cette église remarquable."}
            </p>
          </div>
        </div>

        {/* Interview */}
        {hasInterviewContent && (
          <div
            ref={interviewRef}
            className="flex items-center justify-center px-auto"
          >
            <div className="max-w-4xl w-full">
              <Interview
                titre={titreInterview}
                description={descriptionInterview}
                videoUrl={videoUrl}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
