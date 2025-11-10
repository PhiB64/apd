import "./globals.css";

import HeaderWrapper from "@components/HeaderWrapper";

export const metadata = {
  title: "Église Saint-Jean-Baptiste d’Aulès",
  description: "Site officiel de restauration et de soutien",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <HeaderWrapper>{children}</HeaderWrapper>
      </body>
    </html>
  );
}
