import Footer from "@/app/components/Footer";
import HomeParallax from "@/app/components/HomeParallax";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900">
      <HomeParallax />
      <Footer />
    </div>
  );
}