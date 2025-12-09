import BlogEditor from '@/components/blogeditor';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function BlogEditorPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <BlogEditor />
      </main>
      <Footer />
    </div>
  );
}