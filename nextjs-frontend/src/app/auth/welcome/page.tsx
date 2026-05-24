import Link from "next/link";
import Footer from "@/app/components/Footer";

export default async function WhoAmI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
    qui magari mettiamo una breve presentazione del servizio
      </h1>

      <Footer />
    </div>

      );

      
}