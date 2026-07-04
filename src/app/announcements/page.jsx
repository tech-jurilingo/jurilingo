import AnnouncementsList from '@/components/announcementslist';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Announcements - JuriLingo",
  description: "Stay up to date with the latest announcements, notices, and updates from JuriLingo.",
};

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnnouncementsList />
      </main>
      <Footer />
    </div>
  );
}
