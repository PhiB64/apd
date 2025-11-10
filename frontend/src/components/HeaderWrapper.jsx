"use client";

import { createContext, useContext, useState } from "react";
import FloatingHeader from "@components/FloatingHeader";
import ContactModal from "@components/ContactModal";
import { useSiteData } from "@hooks/useSiteData";

// Crée le contexte
const HeaderContext = createContext();

export function useHeaderVisibility() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderVisibility must be used within HeaderWrapper");
  }
  return context;
}

export default function HeaderWrapper({ children }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { parametres_site } = useSiteData(API_URL);

  const [hideHeader, setHideHeader] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        hideHeader,
        setHideHeader,
        showContactModal,
        setShowContactModal,
      }}
    >
      <FloatingHeader
        site={parametres_site}
        isVisible={!hideHeader}
        onContactClick={() => setShowContactModal(true)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {children}
    </HeaderContext.Provider>
  );
}
