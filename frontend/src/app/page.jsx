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
  const { eglise, accueil, interviews, partenaires, articles, error } =
    useSiteData();

  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;
  const [showContactModal, setShowContactModal] = useState(false);
  const { setHideHeader } = useHeaderVisibility();

  // ⏱️ Masque le header au chargement, puis l'affiche au scroll
  useEffect(() => {
    setHideHeader(true);
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

  const videoUrl = accueil?.video?.url?.startsWith("http")
    ? accueil.video.url
    : `${process.env.NEXT_PUBLIC_API_URL}${accueil?.video?.url}`;

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto">
      {/* 🎥 Fond vidéo permanent */}
      {videoUrl && <VideoBackground videoUrl={videoUrl} />}

      {/* 🏁 Intro */}
      <IntroSection eglise={eglise} />

      {/* 📖 Description + interview */}
      {eglise && firstInterview && (
        <DescriptionSection eglise={eglise} interviewBlock={firstInterview} />
      )}

      {/* 🤝 Partenaires */}
      {partenaires?.length > 0 && <PartnerSection partners={partenaires} />}

      {/* 📰 Blog */}
      <BlogSection articles={articles} limit={4} />

      {/* 📬 Modal contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </main>
  );
}
