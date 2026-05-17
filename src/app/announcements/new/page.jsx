import AnnouncementEditor from '@/components/announcementeditor';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function AnnouncementEditorPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AnnouncementEditor />
      </main>
      <Footer />
    </div>
  );
}
