import BlogsList from '@/components/bloglist';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BlogsPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogsList />
      </main>
      <Footer />
    </div>
  );
}