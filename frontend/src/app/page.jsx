"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useSiteData } from "@hooks/useSiteData";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import HomeSection from "@components/HomeSection";
import FloatingHeader from "@components/FloatingHeader";
import DescriptionSection from "@components/DescriptionSection";
import PartnerSection from "@components/PartnerSection";
import ContactModal from "@components/ContactModal";
import Footer from "@components/Footer";
import BlogSection from "@components/BlogSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const {
    eglise,
    accueil,
    parametres_site,
    partenaires,
    interviews,
    error,
    isLoading,
  } = useSiteData(API_URL);

  const videoUrl = accueil?.video?.url ?? null;

  const [showHeader, setShowHeader] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const introRef = useRef(null);
  const descriptionRef = useRef(null);

  // ✅ Fonction centralisée pour passer l’intro
  const handleSkip = () => {
    introRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowHeader(true);
    setShowContent(true);
  };

  // ✅ Déclenche le passage automatique si triggerSkip=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("triggerSkip") === "true") {
        handleSkip();
        params.delete("triggerSkip");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  // ✅ Rafraîchit ScrollTrigger après le rendu du contenu
  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }
  }, [showContent]);

  if (isLoading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;

  return (
    <main className="relative overflow-x-hidden">
      {/* 🎥 Vidéo de fond */}
      {videoUrl && <VideoBackground videoUrl={videoUrl} />}

      {/* 🧭 Header flottant */}
      {showHeader && (
        <FloatingHeader
          site={parametres_site}
          onContactClick={() => setShowContactModal(true)}
        />
      )}

      {/* 🎬 Intro vidéo avec bouton "Passer" */}
      {!showContent && <IntroSection videoUrl={videoUrl} onSkip={handleSkip} />}

      {/* 📦 Contenu principal */}
      {showContent && (
        <div className="relative z-10">
          <HomeSection ref={introRef} eglise={eglise} />

          {eglise && firstInterview && (
            <DescriptionSection
              ref={descriptionRef}
              eglise={eglise}
              interviewBlock={firstInterview}
            />
          )}

          {partenaires?.length > 0 && <PartnerSection partners={partenaires} />}

          <div className="flex-grow">
            <BlogSection API_URL={API_URL} limit={4} />
          </div>

          <Footer site={parametres_site} />
        </div>
      )}

      {/* 📬 Modal contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </main>
  );
}
