"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 4000); // 4 secondes

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    const target = document.getElementById("description-anchor");
    if (!target) {
      console.warn("La cible #description-anchor est introuvable.");
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleScroll}
      onKeyDown={(e) => e.key === "Enter" && handleScroll()}
      className={`fixed bottom-10 left-1/2 z-40 pointer-events-auto curtain-content cursor-pointer transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Faites défiler vers la section suivante"
    >
      <div className="-translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
        </div>
        <span className="text-white text-xs mt-2 text-center whitespace-nowrap">
          Faites défiler
        </span>
      </div>
    </div>
  );
}
