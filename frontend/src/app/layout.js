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
    <html lang="fr" className="scroll-smooth">
      <body className=" overflow-x-hidden antialiased">
        <HeaderDonationProvider>
          <HeaderWrapper />
          <main className="relative z-10">{children}</main>
          <Footer />
        </HeaderDonationProvider>
      </body>
    </html>
  );
}
