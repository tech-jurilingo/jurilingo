import CompetitionEditor from '@/components/competitioneditor';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function CompetitionEditorPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CompetitionEditor />
      </main>
      <Footer />
    </div>
  );
}