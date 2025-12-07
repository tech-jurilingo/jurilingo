import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import CTASection from "@/components/ctasection";
import RecentCompetitions from "@/components/recentcompetition";
import RecentPodcasts from "@/components/recentpodcast";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <CTASection />
        <RecentCompetitions />
        <RecentPodcasts />
      </main>
      <Footer />
    </div>
  );
}