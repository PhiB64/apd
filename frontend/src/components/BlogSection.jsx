"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteData } from "@hooks/useSiteData";

export default function BlogSection({ API_URL, limit = 3 }) {
  const { articles, isLoading, error } = useSiteData(API_URL);

  if (isLoading || error) return null;

  const displayedArticles = articles.slice(0, limit);

  return (
    <section className="w-full px-6 md:px-32 py-20 bg-[#f9f5ef] text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 📰 Titre */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-garamond leading-snug">
            Derniers{" "}
            <span className="text-[#ac1115] shadow-underline">articles</span>
          </h2>
        </div>

        {/* 🖋️ Liste des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedArticles.map((article) => {
            const { id, attributes } = article;
            if (!attributes) return null;

            const { titre, slug, image, date_publication, contenu, auteur } =
              attributes;

            const imageUrl =
              image?.data?.attributes?.formats?.medium?.url ??
              image?.data?.attributes?.url ??
              null;

            const extrait =
              contenu?.[0]?.children?.[0]?.text?.slice(0, 180) ?? "";

            return (
              <Link
                key={id}
                href={`/blog/${slug}`}
                className="group block space-y-2"
              >
                <div className="p-6 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300">
                  {imageUrl && (
                    <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold font-garamond group-hover:text-[#ac1115]">
                    {titre}
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    Publié le{" "}
                    {new Date(date_publication).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    par {auteur}
                  </p>
                  <p className="mt-2 text-sm text-justify text-gray-800">
                    {extrait}...
                  </p>
                  <span className="inline-block mt-4 text-[#ac1115] font-semibold">
                    Lire l’article →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 🔗 Bouton vers tous les articles */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block mt-6 px-6 py-2 rounded-sm bg-[#ac1115] text-white font-semibold shadow-md hover:bg-[#8c0e12] transition-all duration-300"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}
