"use client";

import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gallery from "./Gallery";
import Interview from "./Interview";

gsap.registerPlugin(ScrollTrigger);

const DescriptionSection = forwardRef(({ eglise, interviewBlock }, ref) => {
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const interviewRef = useRef(null);
  const groupRef = useRef(null);

  const nom = eglise?.nom?.trim() || "";
  const mots = nom.split(" ");
  const premier = mots[0];
  const reste = mots.slice(1, -1).join(" ");
  const dernier = mots.slice(-1)[0];

  const [selectedImage, setSelectedImage] = useState(
    eglise?.image_principale ?? null
  );

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

  const titreInterview = interviewBlock?.titre;
  const descriptionInterview =
    interviewBlock?.description?.[0]?.children?.[0]?.text;
  const videoUrl = interviewBlock?.video?.url;

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "top+=200%",
          pin: true,
          scrub: 0.5,
        },
      });

      tl.fromTo(
        backgroundRef.current,
        { xPercent: 100, opacity: 1 },
        { xPercent: 0, opacity: 1, ease: "none", duration: 1 }
      );

      tl.fromTo(
        groupRef.current,
        { xPercent: 150, opacity: 1 },
        { xPercent: 0, opacity: 1, ease: "none", duration: 1 },
        "-=1"
      );

      if (isMobile) {
        tl.to(
          groupRef.current,
          {
            yPercent: -150,
            ease: "none",
            duration: 5,
          },
          "+=0.5"
        );
      }

      tl.to(
        groupRef.current,
        {
          xPercent: -200,
          opacity: 1,
          ease: "none",
          duration: 3,
        },
        "+=1"
      );

      if (isMobile) {
        tl.fromTo(
          interviewRef.current,
          { xPercent: 200, opacity: 1 },
          { xPercent: 0, opacity: 1, ease: "none", duration: 1 },
          "-=7"
        );
      } else {
        tl.fromTo(
          interviewRef.current,
          { xPercent: 200, opacity: 1 },
          { xPercent: 0, opacity: 1, ease: "none", duration: 3 },
          "-=3"
        );
      }
      if (isMobile) {
        tl.to(
          interviewRef.current,
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            duration: 0.2,
          },
          "-=1"
        );
      } else {
        tl.to(interviewRef.current, {
          xPercent: 0,
          opacity: 1,
          ease: "none",
          duration: 1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hasInterviewContent =
    titreInterview || descriptionInterview || videoUrl;

  if (!eglise && !hasInterviewContent) return null;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen overflow-hidden flex items-center justify-center pt-20 md:pt-0 "
    >
      <div
        ref={backgroundRef}
        className="absolute top-0 left-0 w-full min-h-full z-0 bg-cover bg-center "
        style={{
          backgroundImage: 'url("/fond_pierre.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div ref={containerRef} className="relative z-10 w-full max-w-6xl ">
        {/* Texte + image */}
        <div
          ref={groupRef}
          className="flex flex-col md:flex-row items-center justify-center gap-10 w-full h-auto px-6 pt-100 md:pt-0"
        >
          <div ref={textRef} className="md:w-1/2 w-full text-black">
            <div className="space-y-4">
              {eglise?.nom && (
                <h2 className="text-3xl md:text-4xl font-garamond leading-snug break-words">
                  {premier}
                  <br />
                  {reste}{" "}
                  <span className="text-white shadow-underline">{dernier}</span>
                </h2>
              )}
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
            <button className="flex items-center justify-center px-6 py-2 rounded-sm bg-[#ac1115] text-white font-semibold shadow-md hover:bg-red-700 transition-all duration-300 w-fit sm:hidden lg:flex mt-5">
              Découvrez son histoire
            </button>
          </div>

          {selectedImage && (
            <div
              ref={imageRef}
              className="md:w-1/2 w-full flex flex-col items-center gap-4"
            >
              <div className="relative w-full aspect-[4/3] rounded-t-full overflow-hidden shadow-xl">
                <Image
                  src={getImageUrl(selectedImage)}
                  alt={selectedImage.name || "Image principale"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Gallery eglise={eglise} />
            </div>
          )}
        </div>

        {/* Interview superposée */}
        {hasInterviewContent && (
          <div
            ref={interviewRef}
            className="absolute z-20 inset-0 flex items-center justify-center pb-10"
          >
            <Interview
              titre={titreInterview}
              description={descriptionInterview}
              videoUrl={videoUrl}
            />
          </div>
        )}
      </div>
    </section>
  );
});

export default DescriptionSection;
