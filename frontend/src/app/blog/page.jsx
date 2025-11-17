"use client";

import { useSiteData } from "@hooks/useSiteData";
import BlogSection from "@components/BlogSection";
import ErrorMessage from "@components/ErrorMessage";

export default function BlogIndexPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { parametres_site, articles, error } = useSiteData(API_URL);

  const isLoading = !parametres_site && !articles && !error;
  const noArticles = Array.isArray(articles) && articles.length === 0;

  if (isLoading) {
    return (
      <ErrorMessage
        type="loading"
        message="Chargement des articles en cours..."
      />
    );
  }

  if (error) {
    return <ErrorMessage type="error" message={`Erreur : ${error}`} />;
  }

  if (noArticles) {
    return (
      <ErrorMessage
        type="empty"
        message="Chargement des articles en cours..."
      />
    );
  }

  return (
    <main className="relative z-10">
      <BlogSection API_URL={API_URL} />
    </main>
  );
}
