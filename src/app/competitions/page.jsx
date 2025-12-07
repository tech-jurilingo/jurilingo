import CompetitionList from '@/components/competitionlist';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function CompetitionsPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CompetitionList />
      </main>
      <Footer />
    </div>
  );
}