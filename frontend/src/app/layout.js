import "./globals.css";
import Footer from "../components/Footer";
import HeaderWrapper from "@components/HeaderWapper";
import { HeaderDonationProvider } from "../contexts/HeaderDonationContext";

export const metadata = {
  title: "Église Saint-Jean-Baptiste d’Aulès",
  description: "Site officiel de restauration et de soutien",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <HeaderDonationProvider>
          <HeaderWrapper />
          {children}
          <Footer />
        </HeaderDonationProvider>
      </body>
    </html>
  );
}
