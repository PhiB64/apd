"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

const Interview = forwardRef(({ titre, description, videoUrl }, ref) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreen = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(fullscreenElement === videoRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, []);

  const handleClick = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (!titre && !description && !videoUrl) return null;

  return (
    <div
      ref={ref}
      className="w-full h-auto flex items-start justify-center px-4 md:px-6"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texte à gauche */}
        <div className="flex flex-col justify-center space-y-6 text-black px-2">
          {titre &&
            (() => {
              const mots = titre.trim().split(" ");
              const dernier = mots.pop();
              const reste = mots.join(" ");
              return (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-garamond leading-snug break-words text-black">
                  {reste}{" "}
                  <span className="text-white shadow-underline">{dernier}</span>
                </h2>
              );
            })()}
          {description && (
            <div className="text-sm md:text-base space-y-2 leading-relaxed text-justify font-garamond">
              <p className="lettrine">{description}</p>
            </div>
          )}
        </div>

        {/* Vidéo à droite avec masque SVG */}
        {videoUrl && (
          <div className="flex items-center justify-center px-2">
            <div className="relative w-full max-w-[40rem] aspect-video overflow-hidden">
              {/* Masque SVG */}
              <svg width="0" height="0">
                <defs>
                  <clipPath id="videoMask" clipPathUnits="objectBoundingBox">
                    <path d="M0.05,0.05 Q0.1,0 0.2,0.05 T0.8,0.05 Q0.9,0 0.95,0.05 Q1,0.1 0.95,0.2 T0.95,0.8 Q1,0.9 0.95,0.95 Q0.9,1 0.8,0.95 T0.2,0.95 Q0.1,1 0.05,0.95 Q0,0.9 0.05,0.8 T0.05,0.2 Q0,0.1 0.05,0.05 Z" />
                  </clipPath>
                </defs>
              </svg>

              {/* Vidéo masquée + clic plein écran */}
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                onClick={handleClick}
                className="w-full h-full object-cover p-2 cursor-pointer"
                style={{
                  clipPath: isFullscreen ? "none" : "url(#videoMask)",
                  transition: "clip-path 0.3s ease",
                }}
                aria-label="Interview vidéo"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Interview;
