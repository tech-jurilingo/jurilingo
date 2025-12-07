import PodcastsList from '@/components/podcastlist';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PodcastsPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PodcastsList />
      </main>
      <Footer />
    </div>
  );
}