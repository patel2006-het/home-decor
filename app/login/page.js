import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "Sign In | HavenDecor",
  description: "Sign in to your HavenDecor account to manage your 3D home designs, review projects, and edit your style profile.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginClient />
      </main>
      <Footer />
    </div>
  );
}
