import AboutFounder from "@/components/aboutfounder";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AboutFounderPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutFounder />
      </main>
      <Footer />
    </div>
  );
}