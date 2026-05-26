import Link from "next/link";

export default async function WhoAmI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      
      {/* Card Contenitore */}
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 space-y-8 border border-gray-200">
        
        {/* Titolo */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
            I Nostri Contatti
          </h1>
          <p className="text-gray-500 mt-2">Siamo a tua disposizione</p>
        </div>

        {/* Dettagli Contatti */}
        <div className="space-y-6">
          
          {/* Telefono */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">
              Telefono
            </span>
            <a 
              href="tel:+39000000000" 
              className="text-xl font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              +39 000 000 0000
            </a>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">
              Email
            </span>
            <a 
              href="mailto:info@tuasocieta.it" 
              className="text-xl font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              info@tuasocieta.it
            </a>
          </div>

          {/* Orari di Apertura */}
          <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Orari di Apertura
            </span>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Lunedì - Sabato</span>
              <span className="font-semibold">09:00 - 18:30</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 mt-1">
              <span>Domenica</span>
              <span>Chiuso</span>
            </div>
          </div>

        </div>

        {/* Bottone di ritorno (opzionale, sfrutta l'import di Link) */}
        <div className="pt-4 text-center">
          <Link 
            href="/" 
            className="inline-block w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Torna alla Home
          </Link>
        </div>

      </div>


     <div className="w-[70%] h-[0.5px] bg-gray-400 mt-8" />

      <div className="flex flex-row items-center justify-center gap-15 mt-5">
        
        {/* Primo Elemento */}
        <div className="w-16 h-16 flex flex-col font-medium items-center justify-center text-center gap-2">
          <p className="font-bold">spara</p>
          <p className="text-sm">forzaaa</p>
        </div>
        
        {/* Secondo Elemento */}
        <div className="w-16 h-16 flex flex-col font-medium items-center justify-center text-center gap-2">
          <p className="font-bold">spara</p>
          <p className="text-sm">forzaaa</p>
        </div>

        {/* Terzo Elemento */}
        <div className="w-16 h-16 flex flex-col font-medium items-center justify-center text-center gap-2">
          <p className="font-bold">spara</p>
          <p className="text-sm">forzaaa</p>
        </div>

      </div>


    </div>

    
  );
}