"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ images }) {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

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
        gsap.set(desktopItems, { opacity: 1, x: 500 });
        gsap.to(desktopItems, {
          opacity: 1,
          x: 0,
          stagger: (index, target) => {
            // Lire l'ordre d'animation depuis l'attribut data-order
            return parseFloat(target.getAttribute("data-order")) * 1.5;
          },
          duration: 1.5,
          ease: "none",

          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top+=30%",
            end: "+=80%",

            scrub: true,
            markers: true,
          },
        });
      }

      if (mobileItems.length > 0) {
        gsap.set(mobileItems, { opacity: 0, y: 50 });
        gsap.to(mobileItems, {
          opacity: 1,
          y: 0,
          stagger: 0.6,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "+=100%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, galleryRef.current);

    return () => ctx.revert();
  }, [images]);

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

  if (!images || images.length === 0) return null;

  const layoutStyles = [
    { top: "0%", left: "0%", width: "22%", height: "37%", order: 0 },
    { top: "0%", left: "24%", width: "22%", height: "66%", order: 1 },
    { top: "0%", left: "48%", width: "25%", height: "26%", order: 2 },
    { top: "0%", left: "75%", width: "25%", height: "36%", order: 3 },
    { top: "29%", left: "48%", width: "25%", height: "37%", order: 4 },
    { top: "39%", left: "75%", width: "25%", height: "27%", order: 5 },
    { top: "40%", left: "0%", width: "22%", height: "60%", order: 6 },
    { top: "69%", left: "60%", width: "40%", height: "31%", order: 7 },
    { top: "69%", left: "24%", width: "34%", height: "31%", order: 8 },
  ];

  return (
    <div
      ref={galleryRef}
      className="relative w-screen h-screen flex items-center justify-center"
    >
      {/* Desktop */}
      <div className="hidden md:block relative w-[50vw] h-[60vh]  mx-auto">
        {images.slice(0, 9).map((img, index) => {
          const style = layoutStyles[index] || {
            top: "0%",
            left: "0%",
            width: "20%",
            height: "33%",
          };
          return (
            <button
              key={img.id || index}
              onClick={() => setSelectedImage(img)}
              className="gallery-item desktop absolute overflow-hidden border-3 border-white shadow-lg transition-transform duration-500"
              data-order={style.order}
              style={{
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={getImageUrl(img)}
                  alt={img.name || `Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full h-screen flex items-center justify-center px-6">
        <div className="w-full grid grid-cols-1 gap-4 ">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={img.id || index}
              className="gallery-item mobile relative h-[180px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-3 border-white"
            >
              <Image
                src={getImageUrl(img)}
                alt={img.name || `Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

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
