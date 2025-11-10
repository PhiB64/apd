"use client";

import { useState } from "react";
import { useSiteData } from "@hooks/useSiteData";
import Footer from "@components/Footer";

import ContactModal from "@components/ContactModal";

export default function PartnersPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [showContactModal, setShowContactModal] = useState(false);
  const { parametres_site, error } = useSiteData(API_URL);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-red-600">
        <p className="text-sm md:text-base font-normal drop-shadow-sm leading-relaxed">
          Erreur : {error}
        </p>
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-screen bg-white pt-[150px] pb-20 px-6"
        style={{
          backgroundImage: 'url("/fond_pierre.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ✅ Section incitative */}
        <section className="max-w-4xl mx-auto text-center mb-20 ">
          <h1 className="text-3xl md:text-4xl drop-shadow-lg leading-snug text-black mb-6 font-garamond ">
            Devenez partenaire de notre{" "}
            <span className="shadow-underline text-white">projet</span>
          </h1>
          <p className="text-sm md:text-base font-normal drop-shadow-sm leading-relaxed text-black">
            En soutenant la restauration de l’église Saint-Jean Baptiste
            d’Aulès, vous participez à la préservation d’un patrimoine vivant et
            à la transmission d’une histoire locale forte. Votre engagement sera
            valorisé auprès du public et des institutions.
          </p>
          <div className="mt-8">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-block px-6 py-3 bg-[#ac1115] font-semibold text-white rounded-sm shadow-md hover:bg-red-700 transition"
            >
              Je souhaite devenir partenaire
            </button>
          </div>
        </section>
      </main>

      <Footer site={parametres_site} API_URL={API_URL} />

      {/* 📬 Modale contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  );
}
