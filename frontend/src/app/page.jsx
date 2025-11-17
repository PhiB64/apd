"use client";

import { useSiteData } from "@hooks/useSiteData";
import dynamic from "next/dynamic";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import DescriptionSection from "@components/DescriptionSection";
import ErrorMessage from "@components/ErrorMessage";

// ⏳ Chargement dynamique de PartnerSection
const PartnerSection = dynamic(() => import("@components/PartnerSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] flex items-center justify-center text-white font-garamond text-xl">
      Chargement des partenaires…
    </div>
  ),
});

// ⏳ Chargement dynamique de BlogSection
const BlogSection = dynamic(() => import("@components/BlogSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] flex items-center justify-center text-white font-garamond text-xl">
      Chargement des récits…
    </div>
  ),
});

export default function Home() {
  const { eglise, accueil, interviews, partenaires, articles, error } =
    useSiteData();

  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;

  const isLoading =
    !eglise && !accueil && !interviews && !partenaires && !articles && !error;

  const videoUrl = accueil?.video?.url?.startsWith("http")
    ? accueil.video.url
    : `${process.env.NEXT_PUBLIC_API_URL}${accueil?.video?.url}`;

  if (isLoading) {
    return (
      <main className="relative w-full min-h-screen flex items-center justify-center bg-black text-white">
        <ErrorMessage type="loading" message="Chargement du site en cours..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative w-full min-h-screen flex items-center justify-center bg-black text-white">
        <ErrorMessage type="error" message={`Erreur : ${error}`} />
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
      {/* 🎥 Fond vidéo permanent */}
      {videoUrl && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <VideoBackground videoUrl={videoUrl} />
        </div>
      )}

      {/* 🧩 Contenu principal */}
      <div className="relative z-10">
        <section id="intro">
          <IntroSection eglise={eglise} />
        </section>

        {eglise && firstInterview && (
          <section id="description">
            <DescriptionSection
              eglise={eglise}
              interviewBlock={firstInterview}
            />
          </section>
        )}

        <section id="partners">
          <PartnerSection partners={partenaires} />
        </section>

        <section id="blog">
          <BlogSection limit={3} />
        </section>
      </div>
    </main>
  );
}
