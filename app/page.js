import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RoomCategories from "@/components/RoomCategories";
import Features from "@/components/Features";
import DesignStyles from "@/components/DesignStyles";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <RoomCategories />
        <Features />
        <DesignStyles />
      </main>
      <Footer />
    </>
  );
}
