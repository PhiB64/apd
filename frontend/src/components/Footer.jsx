"use client";

import { useSiteData } from "@hooks/useSiteData";
import Image from "next/image";

export default function Footer() {
  const { site } = useSiteData();
  const logoUrl = site?.logo_footer?.url;
  const reseaux = site?.reseaux_sociaux ?? [];

  return (
    <footer className="relative z-10 bg-black text-gray-100 px-6 py-16 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        <LogoBlock logoUrl={logoUrl} />
        <SocialBlock reseaux={reseaux} />
      </div>
    </footer>
  );
}

function LogoBlock({ logoUrl }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      {logoUrl && (
        <Image
          src={logoUrl}
          alt="Logo footer"
          width={280}
          height={100}
          className="mb-4 object-contain"
        />
      )}
      <p className="text-sm text-stone-400">
        &copy; {new Date().getFullYear()} Ufo Agency. Tous droits réservés.
      </p>
    </div>
  );
}

function SocialBlock({ reseaux }) {
  return (
    <div className="flex flex-col items-center md:items-end text-center md:text-right">
      <h3 className="text-lg font-semibold mb-4 tracking-wide ">Suivez-nous</h3>
      <div className="flex flex-col space-y-2">
        {reseaux.length > 0 ? (
          reseaux.map((reseau, index) => (
            <a
              key={index}
              href={reseau.url}
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-white transition-colors text-base"
            >
              {reseau.nom} →
            </a>
          ))
        ) : (
          <p className="text-lg">Aucun réseau social configuré</p>
        )}
      </div>
    </div>
  );
}
