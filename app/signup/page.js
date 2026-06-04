import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupClient from "./SignupClient";

export const metadata = {
  title: "Create an Account | HavenDecor",
  description: "Sign up for a free HavenDecor account to start designing interior spaces, saving multi-room layouts, and sharing your designs.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignupClient />
      </main>
      <Footer />
    </div>
  );
}
