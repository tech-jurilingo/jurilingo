import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import AnnouncementsSection from "@/components/announcementssection";
import Features from "@/components/features";
import CTASection from "@/components/ctasection";
import RecentPodcasts from "@/components/recentpodcast";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AnnouncementsSection />
        <Features />
        <CTASection />
        <RecentPodcasts />
      </main>
      <Footer />
    </div>
  );
}