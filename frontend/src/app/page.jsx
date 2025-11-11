"use client";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useSiteData } from "@hooks/useSiteData";
import { useHeaderVisibility } from "@components/HeaderWrapper";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import DescriptionSection from "@components/DescriptionSection";
import PartnerSection from "@components/PartnerSection";
import BlogSection from "@components/BlogSection";

import ContactModal from "@components/ContactModal";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { eglise, accueil, parametres_site, interviews, partenaires, error } =
    useSiteData(API_URL);

  const videoUrl = accueil?.video?.url ?? null;
  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;

  const [showContactModal, setShowContactModal] = useState(false);

  const { setHideHeader } = useHeaderVisibility();

  // ⏱️ Masque le header au chargement, puis l'affiche au scroll
  useEffect(() => {
    setHideHeader(true); // Masquer le header au chargement

    const handleScroll = () => {
      setHideHeader(false);
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setHideHeader]);

  if (error) {
    return (
      <main className="flex flex-col h-full w-full overflow-hidden items-center justify-center bg-black">
        <p className="text-white text-lg">Erreur : {error}</p>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto">
      {/* 🎥 Fond vidéo */}
      <VideoBackground
        videoUrl={
          "https://res.cloudinary.com/dkidpfpm1/video/upload/v1759917787/video_accueil_6c4adf0ce7.mp4"
        }
      />

      {/* 🏁 Intro avec fond vidéo + titre animé */}
      <IntroSection accueil={accueil} eglise={eglise} />

      {/* 📖 Description + interview */}
      {eglise && firstInterview && (
        <DescriptionSection eglise={eglise} interviewBlock={firstInterview} />
      )}

      {/* 🤝 Partenaires */}
      {partenaires?.length > 0 && <PartnerSection partners={partenaires} />}

      {/* 📰 Blog */}
      <BlogSection API_URL={API_URL} limit={4} />

      {/* 📬 Modal contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </main>
  );
}
