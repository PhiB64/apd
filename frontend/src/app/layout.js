import "./globals.css";
import Footer from "../components/Footer";
import HeaderProvider from "../contexts/HeaderContext";

export const metadata = {
  title: "Église Saint-Jean-Baptiste d’Aulès",
  description: "Site officiel de restauration et de soutien",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {/*Fournit le header flottant + modale de contact + contexte global */}
        <HeaderProvider>
          {children}
          <Footer />
        </HeaderProvider>
      </body>
    </html>
  );
}
