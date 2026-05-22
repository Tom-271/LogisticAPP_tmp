import Link from "next/link";
import Footer from "@/app/components/Footer";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">

      {/* Contenuto Principale */}
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-center">
          Benvenuto in LogicAPP, il servizio di delivery perfetto per te!
        </h1>

        <Link 
          href="/auth/whoami" 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Scopri chi sono!
        </Link>
      </main>

      <Footer />  

    </div>
  );
}