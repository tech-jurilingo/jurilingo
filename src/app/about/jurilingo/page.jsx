import AboutJuriLingo from "@/components/aboutjurilingo";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutJuriLingoPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutJuriLingo />
      </main>
      <Footer />
    </div>
  );
}