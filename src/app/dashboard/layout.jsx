import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
