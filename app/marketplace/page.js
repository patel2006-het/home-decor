import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceClient from "./MarketplaceClient";

export const metadata = {
  title: "Furniture Marketplace | HavenDecor",
  description: "Browse real branded furniture from IKEA, West Elm, Pottery Barn, and Article, and swap them into your 3D design studio.",
};

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
      <Navbar />
      <main className="flex-1">
        <MarketplaceClient />
      </main>
      <Footer />
    </div>
  );
}
