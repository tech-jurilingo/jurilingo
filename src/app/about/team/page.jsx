import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TheTeam from "@/components/theteam";

export default function TheTeamPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TheTeam />
      </main>
      <Footer />
    </div>
  );
}
