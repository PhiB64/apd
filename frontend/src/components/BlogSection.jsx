"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteData } from "../hooks/useSiteData";

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection({ API_URL, limit = null }) {
  const { articles, isLoading, error } = useSiteData(API_URL);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    if (!articles || articles.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 50%",
          pin: true,
          scrub: 0.5,
        },
      });

      tl.fromTo(
        cardsRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [articles]);

  const sectionClasses =
    "relative py-20 px-6 md:px-32 min-h-screen bg-cover bg-center bg-no-repeat";

  const backgroundStyle = {
    backgroundImage: "url('/fond_pierre.jpg')",
  };

  if (error) {
    return (
      <section
        ref={sectionRef}
        className={sectionClasses}
        style={backgroundStyle}
      >
        <p className="text-center text-sm md:text-base text-red-500">
          Erreur : {error}
        </p>
      </section>
    );
  }

  const displayed = Array.isArray(articles)
    ? limit
      ? articles.slice(0, limit)
      : articles
    : [];

  if (displayed.length === 0) {
    return (
      <section
        ref={sectionRef}
        className={sectionClasses}
        style={backgroundStyle}
      >
        <p className="text-center text-sm md:text-base text-gray-500">
          Aucun article disponible pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={sectionClasses}
      style={backgroundStyle}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-garamond text-center mt-12 mb-12 text-black">
          {limit ? "Les derniers articles" : "Tous les articles"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10 justify-center">
          {displayed.map((article, index) => {
            const {
              id,
              titre,
              slug,
              auteur,
              date_publication,
              contenu,
              image,
            } = article;

            const extrait =
              contenu?.[0]?.children?.[0]?.text?.slice(0, 140) + "..." || "";

            const imageUrl =
              image?.formats?.medium?.url || image?.url || "/placeholder.jpg";

            return (
              <Link
                key={id}
                href={`/blog/${slug}`}
                className="blog-card group block bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={imageUrl}
                    alt={titre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-sm md:text-base font-normal text-gray-800 mb-2 group-hover:text-red-700 transition">
                    {titre}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(date_publication).toLocaleDateString("fr-FR")} ·{" "}
                    {auteur}
                  </p>
                  <p className="text-sm md:text-base italic text-gray-700">
                    {extrait}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {limit && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-[#ac1115] text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
            >
              Voir tous les articles
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
