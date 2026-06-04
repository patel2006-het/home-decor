import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "My Projects | HavenDecor",
  description: "Manage, duplicate, delete, and share your 3D interior design projects on HavenDecor.",
};

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream/30">
      <Navbar />
      <main className="flex-1">
        <ProjectsClient />
      </main>
      <Footer />
    </div>
  );
}
