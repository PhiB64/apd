"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery({ eglise }) {
  const images = eglise?.images ?? [];
  const galleryRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageUrl = (img) =>
    img?.formats?.large?.url ?? img?.formats?.medium?.url ?? img?.url;

  useEffect(() => {
    const container = galleryRef.current;
    if (!container || images.length <= 1) return;

    let scrollAmount = 0;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const interval = setInterval(() => {
      scrollAmount += 1;
      if (scrollAmount >= maxScroll) scrollAmount = 0;
      container.scrollTo({ left: scrollAmount, behavior: "auto" });
    }, 30);

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-md pt-4">
      <div
        ref={galleryRef}
        className="overflow-x-auto whitespace-nowrap no-scrollbar"
      >
        <div className="inline-flex gap-4 px-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className="relative w-[100px] h-[80px] md:w-[140px] md:h-[100px] rounded-lg overflow-hidden shadow-md flex-shrink-0 group focus:outline-none cursor-pointer"
            >
              <Image
                src={getImageUrl(img)}
                alt={img.name || `Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[1999] flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl aspect-[4/3]">
            <Image
              src={getImageUrl(selectedImage)}
              alt={selectedImage.name || "Image en grand"}
              fill
              className="object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
