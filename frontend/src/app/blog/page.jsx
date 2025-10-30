"use client";

import React, { useState } from "react";
import { useSiteData } from "@hooks/useSiteData";
import FloatingHeader from "@components/FloatingHeader";
import Footer from "@components/Footer";
import BlogSection from "@components/BlogSection";

import ContactModal from "@components/ContactModal";

export default function BlogIndexPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { parametres_site, error } = useSiteData(API_URL);
  const [showContactModal, setShowContactModal] = useState(false);

  if (error) {
    return (
      <main className="flex flex-col min-h-screen bg-white items-center justify-center">
        <p className="text-red-600 text-lg">Erreur : {error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <FloatingHeader
        site={parametres_site}
        API_URL={API_URL}
        onContactClick={() => setShowContactModal(true)}
      />

      {/* Marge pour éviter que le logo coupe le contenu */}
      <div className="flex-grow min-h-screen bg-white">
        <BlogSection API_URL={API_URL} />
      </div>

      <Footer site={parametres_site} API_URL={API_URL} />
      {/* 📬 Modale contact */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </main>
  );
}
