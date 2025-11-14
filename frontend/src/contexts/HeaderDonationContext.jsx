"use client";

import { createContext, useContext, useState } from "react";

const HeaderDonationContext = createContext();

export function HeaderDonationProvider({ children }) {
  const [showDonationButton, setShowDonationButton] = useState(true);

  return (
    <HeaderDonationContext.Provider
      value={{ showDonationButton, setShowDonationButton }}
    >
      {children}
    </HeaderDonationContext.Provider>
  );
}

export function useHeaderDonation() {
  return useContext(HeaderDonationContext);
}
