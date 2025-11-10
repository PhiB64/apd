"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ images }) {
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

  useEffect(() => {
    if (!galleryRef.current || !images || images.length === 0) return;

    const ctx = gsap.context(() => {
      const desktopItems = galleryRef.current.querySelectorAll(
        ".gallery-item.desktop"
      );
      const mobileItems = galleryRef.current.querySelectorAll(
        ".gallery-item.mobile"
      );

      // 🖥️ Desktop animation
      gsap.set(desktopItems, { opacity: 1, y: 800 });
      gsap.to(desktopItems, {
        opacity: 1,
        y: 0,
        stagger: 1,
        duration: 5,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "80% top",
          end: "300% top",
          scrub: true,
          markers: false,
        },
      });

      // 📱 Mobile animation
      gsap.set(mobileItems, { opacity: 1, x: 300 });

      gsap.to(mobileItems, {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "bottom center",
          end: "150% top",
          scrub: true,
          markers: false,
        },
      });
    }, galleryRef);

    return () => ctx.revert();
  }, [images]);

  if (!images || images.length === 0) return null;

  const layoutStyles = [
    { top: "10%", left: "20%", width: "30%", height: "30%", zIndex: 1 },
    { top: "35%", left: "25%", width: "20%", height: "55%", zIndex: 2 },
    { top: "30%", left: "48%", width: "15%", height: "45%", zIndex: 3 },
    { top: "55%", left: "60%", width: "25%", height: "40%", zIndex: 4 },
  ];

  return (
    <section
      ref={galleryRef}
      className="relative w-screen min-h-screen overflow-hidden px-6 py-10"
    >
      {/* 🖼️ Desktop layout */}
      <div className="absolute hidden md:block w-full h-full overflow-hidden">
        {images.slice(0, 4).map((img, index) => {
          const style = layoutStyles[index];
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className="gallery-item desktop absolute overflow-hidden border-2 border-white shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none"
              style={style}
            >
              <Image
                src={getImageUrl(img)}
                alt={img.name || `Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}

        {selectedImage && (
          <div
            className="absolute inset-0 z-[10] flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-xl border-4 border-black">
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

      {/* 📱 Mobile layout */}
      <div className="md:hidden w-full h-full grid grid-cols-1 gap-6 ">
        {images.slice(0, 4).map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className="gallery-item mobile relative h-[200px] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none"
          >
            <Image
              src={getImageUrl(img)}
              alt={img.name || `Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}

        {selectedImage && (
          <div
            className="absolute inset-0 z-[10] flex items-center justify-center bg-black/80 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-xl border-4 border-black">
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
    </section>
  );
}
