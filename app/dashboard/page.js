import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | HavenDecor",
  description: "View your user profile settings, modify security settings, and open your saved interior design projects on HavenDecor.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/30">
      <Navbar />
      <main className="flex-1">
        <DashboardClient />
      </main>
      <Footer />
    </div>
  );
}
