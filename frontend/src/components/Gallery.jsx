"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
        gsap.set(desktopItems, { opacity: 1, x: 1000 });
        gsap.to(desktopItems, {
          opacity: 1,
          x: 0,
          stagger: 0.5,
          duration: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "80% top",
            end: "200% top",
            scrub: true,
            markers: false,
          },
        });
      }

      if (mobileItems.length > 0) {
        mobileItems.forEach((item) => {
          gsap.set(item, { opacity: 0, y: 50 });
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "bottom center",
              toggleActions: "play none none reverse",
            },
          });
        });
      }
    }, galleryRef.current);

    return () => ctx.revert();
  }, [images]);

  if (!images || images.length === 0) return null;

  const layoutStyles = [
    { top: "10%", left: "0%", width: "20%", height: "30%", zIndex: 1 },
    { top: "35%", left: "3%", width: "21%", height: "33%", zIndex: 2 },
    { top: "12%", left: "22%", width: "18%", height: "43%", zIndex: 3 },
    { top: "65%", left: "0%", width: "15%", height: "25%", zIndex: 4 },
    { top: "60%", left: "20%", width: "15%", height: "30%", zIndex: 5 },
    { top: "40%", left: "37%", width: "15%", height: "45%", zIndex: 6 },
    { top: "10%", left: "42%", width: "20%", height: "27%", zIndex: 7 },
    { top: "63%", left: "50%", width: "20%", height: "27%", zIndex: 8 },
    { top: "33%", left: "54%", width: "20%", height: "27%", zIndex: 9 },
    { top: "12%", left: "64%", width: "22%", height: "25%", zIndex: 10 },
    { top: "40%", left: "70%", width: "22%", height: "50%", zIndex: 11 },
  ];

  return (
    <div ref={galleryRef} className="relative w-screen h-screen">
      {/* Desktop */}
      <div className="absolute hidden md:block w-full h-full overflow-hidden">
        {images.slice(0, 11).map((img, index) => {
          const style = layoutStyles[index];
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className="gallery-item desktop absolute overflow-hidden border-3 border-white shadow-lg transition-transform duration-1000"
              style={style}
            >
              <Image
                src={getImageUrl(img)}
                alt={img.name || `Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none"
              />
            </button>
          );
        })}

        {selectedImage && (
          <div
            className="absolute inset-0 z-[10] flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden shadow-xl bg-black/60 border-3 border-white">
              <Image
                src={getImageUrl(selectedImage)}
                alt={selectedImage.name || "Image agrandie"}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full h-screen flex items-center justify-center px-6">
        <div className="w-full grid grid-cols-1 gap-6 ">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="gallery-item mobile relative h-[200px] overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border-3 border-white"
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
    </div>
  );
}
