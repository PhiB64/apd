"use client";

import { useSiteData } from "@hooks/useSiteData";

import BlogSection from "@components/BlogSection";

export default function BlogIndexPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { parametres_site, error } = useSiteData(API_URL);

  if (error) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-white text-lg">Erreur : {error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen ">
      {/* Marge pour éviter que le logo coupe le contenu */}
      <div className="flex-grow min-h-screen ">
        <BlogSection API_URL={API_URL} />
      </div>
    </main>
  );
}
