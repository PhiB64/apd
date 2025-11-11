"use client";

import { forwardRef } from "react";
import Image from "next/image";

const Architecture = forwardRef(({ styleArchitectural, plan }, ref) => {
  if (!styleArchitectural || styleArchitectural.length === 0) return null;

  // ✅ Récupère l'URL du plan depuis les formats Cloudinary
  const planUrl =
    plan?.formats?.medium?.url ??
    plan?.formats?.small?.url ??
    plan?.url ??
    null;

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center px-6 pt-20 border-2 "
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10 items-start text-black">
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
          <div className="w-full md:w-1/2 flex justify-center items-center pt-20">
            <div className="relative w-full max-w-[24rem] aspect-[3/4] overflow-hidden shadow-xl border-3 border-white self-stretch">
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
