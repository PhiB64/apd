"use client";

import { useSiteData } from "@hooks/useSiteData";
import BlogSection from "@components/BlogSection";

export default function BlogIndexPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { parametres_site, articles, error } = useSiteData(API_URL);

  const isLoading = !parametres_site && !articles && !error;
  const noArticles = Array.isArray(articles) && articles.length === 0;

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-black">
        <p className="text-white/80 text-lg font-garamond italic animate-pulse">
          Chargement des articles en cours...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-black">
        <p className="text-white/80 text-lg font-garamond italic">
          Erreur : {error}
        </p>
      </main>
    );
  }

  if (noArticles) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-black">
        <p className="text-white/80 text-lg font-garamond italic">
          Aucun article n’est disponible pour le moment.
        </p>
      </main>
    );
  }

  return (
    <main className="relative z-10">
      <BlogSection API_URL={API_URL} />
    </main>
  );
}
