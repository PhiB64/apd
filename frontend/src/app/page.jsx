"use client";

import { useSiteData } from "@hooks/useSiteData";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import DescriptionSection from "@components/DescriptionSection";
import PartnerSection from "@components/PartnerSection";
import BlogSection from "@components/BlogSection";
import ErrorMessage from "@components/ErrorMessage";

export default function Home() {
  const { eglise, accueil, interviews, partenaires, articles, error } =
    useSiteData();

  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;
  const isLoading =
    !eglise && !accueil && !interviews && !partenaires && !articles && !error;

  if (isLoading) {
    return (
      <ErrorMessage type="loading" message="Chargement du site en cours..." />
    );
  }

  if (error) {
    return <ErrorMessage type="error" message={`Erreur : ${error}`} />;
  }

  const videoUrl = accueil?.video?.url?.startsWith("http")
    ? accueil.video.url
    : `${process.env.NEXT_PUBLIC_API_URL}${accueil?.video?.url}`;

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* 🎥 Fond vidéo permanent */}
      {videoUrl && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <VideoBackground videoUrl={videoUrl} />
        </div>
      )}

      {/* 🧩 Contenu principal */}
      <div className="relative z-10">
        <IntroSection eglise={eglise} />

        {eglise && firstInterview && (
          <DescriptionSection eglise={eglise} interviewBlock={firstInterview} />
        )}

        {partenaires?.length > 0 && <PartnerSection partners={partenaires} />}

        <BlogSection limit={3} />
      </div>
    </main>
  );
}
