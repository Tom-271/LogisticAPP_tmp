'use client';

import Link from "next/link";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Footer from "@/app/components/Footer";

// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// MUI Icons
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import EuroIcon from '@mui/icons-material/Euro';

const GeMap = dynamic(() => import('@/app/components/GeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full bg-gray-200 animate-pulse rounded-2xl" />
  ),
});

export default function WhoAmI() {
  const [radius, setRadius] = useState<number>(7500);
  const [showTariffs, setShowTariffs] = useState<boolean>(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
    fetch(`${url}/api/map-config`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const r = json?.data?.radius ?? json?.data?.attributes?.radius;
        if (typeof r === 'number') setRadius(r);
      })
      .catch(() => {
        // fallback: resta 7500 se la fetch fallisce
      });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6 flex-grow">
        <div className="max-w-3xl w-full space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-700 capitalize text-center mt-16 mb-14">
            ZONA DI LAVORO DEI RIDER E TARIFFE ASSOCIATE
          </h1>

          <p className="text-lg leading-relaxed text-gray-800">
            Nella mappa qui sotto puoi vedere la nostra area di copertura su Genova. I nostri rider operano all'interno di questa zona per garantirti ritiri e consegne sempre puntuali e affidabili. 
          </p>

          <p className="text-lg leading-relaxed text-gray-800">
            Non applichiamo tariffe fisse, ma calcoliamo il costo di ogni consegna su misura per te. Il prezzo finale dipende da parametri precisi: la distanza da percorrere, la fascia oraria scelta, le dimensioni del pacco e l'eventuale urgenza della richiesta (come le consegne last-minute). 
          </p>

          <p className="italic text-gray-400 mt-10">
            Attenzione! L'area sottostante è solo a scopo illustrativo e potrebbe non rappresentare con precisione la zona di copertura reale.
          </p>

          <section className="flex flex-col gap-6 w-full">
            <h2 className="text-2xl font-medium mb-1">Dove lavoro</h2>
            
            {/* Mappa */}
            <GeMap radius={radius} />

            {/* Card Informative */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ width: '100%', mt: 2 }}>
              
              {/* Card 1: Rider */}
              <Card sx={{ borderRadius: 4, flex: 1, boxShadow: 2, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <DeliveryDiningIcon sx={{ color: 'black', fontSize: 32, mr: 1.5 }} />
                    <div className="text-2xl font-extrabold text-blue-700 capitalize">
                      Consegne Rapide
                    </div>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    I nostri rider raggiungono rapidamente qualsiasi punto all'interno dell'area blu di copertura. Garantiamo il mantenimento della temperatura e l'integrità del tuo ordine.
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 2: Tariffe */}
              <Card sx={{ borderRadius: 4, flex: 1, boxShadow: 2, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <EuroIcon sx={{ color: 'black', fontSize: 32, mr: 1.5 }} />
                    <div className="text-2xl font-extrabold text-blue-700 capitalize">
                      Tariffe di Consegna
                    </div>
                  </Box>
                  <Typography component="div" variant="body2" color="text.secondary">
                    I costi di consegna sono calcolati dinamicamente per garantirti la massima trasparenza, senza sorprese al check-out.
                    
                    {/* Pulsante interattivo */}
                    <div 
                      onClick={() => setShowTariffs(!showTariffs)}
                      className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer select-none transition-colors"
                    >
                      <span>Vedi di più</span>
                      <span className="text-xs">{showTariffs ? '▲' : '▼'}</span>
                    </div>
                  </Typography>
                </CardContent>
              </Card>

            </Stack>

            {/* Contenitore espanso sotto le card */}
            {showTariffs && (
              <div className="w-full mt-4 flex justify-center animate-fade-in">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full">
                  <h3 className="font-bold text-gray-800 mb-3">Parametri di calcolo:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                    <li><strong>Distanza:</strong> lunghezza del tragitto tra il punto di ritiro e quello di consegna.</li>
                    <li><strong>Fascia oraria:</strong> ampiezza della finestra temporale selezionata per le operazioni di ritiro e consegna.</li>
                    <li><strong>Volume:</strong> dimensioni e ingombro della merce da trasportare.</li>
                    <li><strong>Preavviso (Urgenza):</strong> eventuali maggiorazioni applicate per le richieste "last-minute" (es. preavviso inferiore alle 6 ore).</li>
                    <li><strong>Tipologia di Servizio:</strong> variazioni legate a operazioni speciali, come sconti per le riconsegne o sovrapprezzi per la gestione dei pagamenti in contrassegno.</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          
        </div>
      </div>
      
      <Footer />
    </>
  );
}