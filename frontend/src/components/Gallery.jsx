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
        gsap.set(desktopItems, { opacity: 0, y: 500 });
        gsap.to(desktopItems, {
          opacity: 1,
          y: 0,
          stagger: (index, target) =>
            parseFloat(target.getAttribute("data-order")) * 1.5,
          duration: 1.5,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top+=90%",
            end: "+=60%",
            scrub: true,
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
            scrub: true,
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
    { top: "0%", left: "0%", width: "17.6%", height: "29.6%", order: 0 },
    { top: "0%", left: "19.2%", width: "17.6%", height: "52.8%", order: 1 },
    { top: "0%", left: "38.4%", width: "20%", height: "20.8%", order: 2 },
    { top: "0%", left: "60%", width: "20%", height: "28.8%", order: 3 },
    { top: "23.2%", left: "38.4%", width: "20%", height: "29.6%", order: 4 },
    { top: "31.2%", left: "60%", width: "20%", height: "21.6%", order: 5 },
    { top: "32%", left: "0%", width: "17.6%", height: "48%", order: 6 },
    { top: "55.2%", left: "48%", width: "32%", height: "24.8%", order: 7 },
    { top: "55.2%", left: "19.2%", width: "27.2%", height: "24.8%", order: 8 },
  ];

  return (
    <div
      ref={galleryRef}
      className="relative w-screen h-screen flex items-center justify-center"
    >
      {/* Cadre décoratif global */}
      <div className="absolute inset-0 z-0 hidden md:flex items-center justify-center pt-20 pr-30">
        <div className="relative h-[64rem] w-[72rem]">
          <Image
            src="/grand.png"
            alt="Cadre décoratif"
            fill
            className="object-contain scale-x-[0.86]"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block relative w-[50vw] h-[60vh] mt-46 ml-13">
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
                {/* Cadre décoratif */}
                <Image
                  src="/cadre.png"
                  alt="Cadre décoratif"
                  fill
                  className="object-fill z-10 pointer-events-none"
                />
                {/* Image */}
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
      <div className="md:hidden w-full h-screen flex items-center justify-center px-6">
        <div className="w-full grid grid-cols-1 gap-4">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={img.id || index}
              className="gallery-item mobile relative h-[180px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-115"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/or3.png"
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
