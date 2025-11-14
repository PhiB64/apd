"use client";

import { useSiteData } from "@hooks/useSiteData";

import VideoBackground from "@components/VideoBackground";
import IntroSection from "@components/IntroSection";
import DescriptionSection from "@components/DescriptionSection";
import PartnerSection from "@components/PartnerSection";
import BlogSection from "@components/BlogSection";

export default function Home() {
  const { eglise, accueil, interviews, partenaires, articles, error } =
    useSiteData();

  const firstInterview = Array.isArray(interviews) ? interviews[0] : null;

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
    <main className="relative w-full min-h-screen overflow-x-hidden">
      {/* 🎥 Fond vidéo permanent */}
      {videoUrl && <VideoBackground videoUrl={videoUrl} />}

      {/* 🏁 Intro */}
      <div className="relative w-screen h-[200vh] overflow-x-hidden">
        <IntroSection eglise={eglise} />
      </div>

      <div className="relative w-[400vw] w-screen overflow-x-hidden">
        {/* 📖 Description + interview */}
        {eglise && firstInterview && (
          <DescriptionSection eglise={eglise} interviewBlock={firstInterview} />
        )}
      </div>

      <div className="relative w-[100vw]overflow-x-hidden">
        {/* 🤝 Partenaires */}
        {partenaires?.length > 0 && <PartnerSection partners={partenaires} />}
      </div>

      <div className="relative  overflow-x-hidden">
        {/* 📰 Blog */}
        <BlogSection limit={3} />
      </div>
    </main>
  );
}
