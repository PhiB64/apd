"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsMobile from "@hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ images }) {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!galleryRef.current || !images || images.length === 0) return;

    const ctx = gsap.context(() => {
      const desktopItems = galleryRef.current.querySelectorAll(
        ".gallery-item.desktop"
      );
      const mobileItems = galleryRef.current.querySelectorAll(
        ".gallery-item.mobile"
      );

      if (desktopItems.length > 0) {
        gsap.set(desktopItems, { opacity: 0, y: 500 });
        gsap.to(desktopItems, {
          opacity: 1,
          y: 0,
          stagger: 0.6,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: isMobile ? "" : "+=15%",
            end: isMobile ? "" : "+=30%",
            scrub: true,
            markers: false,
          },
        });
      }

      if (mobileItems.length > 0) {
        gsap.set(mobileItems, { opacity: 0, y: 50 });
        gsap.to(mobileItems, {
          opacity: 1,
          y: 0,
          stagger: 0.6,
          duration: 1,
          ease: "power3.out",

          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top center",
            end: "+=40%",
            toggleActions: "play none none reverse",
            scrub: false,
            markers: false,
          },
        });
      }
    }, galleryRef.current);

    return () => ctx.revert();
  }, [images, isMobile]);

  useEffect(() => {
    let previousOverflow;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };

    if (selectedImage) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      globalThis.addEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = previousOverflow || "";
      globalThis.removeEventListener("keydown", onKey);
    };
  }, [selectedImage]);

  const layoutStyles = [
    { top: "26%", left: "20%", width: "14%", height: "23%", order: 0 },
    { top: "26%", left: "35%", width: "14%", height: "41%", order: 1 },
    { top: "26%", left: "50%", width: "15%", height: "16%", order: 2 },
    { top: "26%", left: "66%", width: "14%", height: "22%", order: 3 },
    { top: "44%", left: "50%", width: "15%", height: "23%", order: 4 },
    { top: "50%", left: "66%", width: "14%", height: "17%", order: 5 },
    { top: "51%", left: "20%", width: "14%", height: "37%", order: 6 },
    { top: "69%", left: "57%", width: "23%", height: "19%", order: 7 },
    { top: "69%", left: "35%", width: "21%", height: "19%", order: 8 },
  ];
  return (
    <div
      ref={galleryRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center "
    >
      {/* Cadre décoratif global */}
      <div className="absolute inset-0 z-0 hidden md:flex items-center justify-center pt-15 ">
        <div className="relative h-[65rem] w-[73rem]">
          <Image
            src="/grand.png"
            alt="Cadre décoratif"
            fill
            className="object-contain scale-x-[0.85] scale-y-[1.01]"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block relative w-[50vw] h-[60vh] ">
        {images.slice(0, 9).map((img, index) => {
          const style = layoutStyles[index] || {
            top: "%",
            left: "0%",
            width: "20%",
            height: "33%",
          };
          return (
            <button
              key={img.id || index}
              onClick={() => setSelectedImage(img)}
              className="gallery-item desktop absolute overflow-hidden shadow-lg transition-transform duration-500 cursor-pointer"
              data-order={style.order}
              style={{
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
              }}
            >
              <div className="relative w-full h-full group">
                <Image
                  src="/cadre_gallery.png"
                  alt="Cadre décoratif"
                  fill
                  className="object-fill z-10 pointer-events-none"
                />
                <div className="w-full h-full transition-transform duration-300 group-hover:scale-115">
                  <Image
                    src={getImageUrl(img)}
                    alt={img.name || `Image ${index + 1}`}
                    fill
                    className="object-cover z-0"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full min-h-screen flex items-center justify-center px-6">
        <div className="w-full grid grid-cols-1 gap-4">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={img.id || index}
              className="gallery-item mobile relative h-[180px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-115"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/cadre_gallery.png"
                  alt="Cadre décoratif"
                  fill
                  className="object-fill z-10 pointer-events-none"
                />
                <Image
                  src={getImageUrl(img)}
                  alt={img.name || `Image ${index + 1}`}
                  fill
                  className="object-cover z-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen viewer */}
      {typeof document !== "undefined" && selectedImage
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div
                className="relative w-full max-w-[80vw] max-h-[80vh] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={getImageUrl(selectedImage)}
                    alt={selectedImage.name || "Image agrandie"}
                    width={1000}
                    height={700}
                    onClick={() => setSelectedImage(null)}
                    className="object-contain max-w-full max-h-full cursor-pointer"
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
