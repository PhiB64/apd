"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";

import { useSiteData } from "@hooks/useSiteData";
import { useHeaderVisibility } from "@components/HeaderWrapper";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import DescriptionSection from "@components/DescriptionSection";
import PartnerSection from "@components/PartnerSection";
import BlogSection from "@components/BlogSection";
import Footer from "@components/Footer";
import ContactModal from "@components/ContactModal";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { eglise, accueil, parametres_site, interviews, partenaires, error } =
    useSiteData(API_URL);

  const videoUrl = accueil?.video?.url ?? null;
  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;

  const [showContactModal, setShowContactModal] = useState(false);
  const [showSoundButton, setShowSoundButton] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const { setHideHeader } = useHeaderVisibility();

  // 🔁 Réinitialise le mute au chargement
  useLayoutEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

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

  const toggleMute = () => {
    const video = document.querySelector("video");
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  if (error) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center bg-white">
        <p className="text-red-600 text-lg">Erreur : {error}</p>
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
        isMuted={isMuted}
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

      {/* 🧭 Footer */}
      <Footer site={parametres_site} />

      {/* 📬 Modal contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* 🔊 Bouton son fixe */}
      {showSoundButton && (
        <div className="fixed bottom-6 right-6 z-50 transition-opacity duration-500">
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-md shadow-md hover:bg-white/20 transition flex items-center justify-center"
            aria-label="Activer/Désactiver le son"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}
    </main>
  );
}
