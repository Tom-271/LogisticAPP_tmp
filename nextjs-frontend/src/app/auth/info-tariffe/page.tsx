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

// MUI Icons
import EuroIcon from '@mui/icons-material/Euro';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


const GeMap = dynamic(() => import('@/app/components/GeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full bg-gray-200 animate-pulse" />
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
      {/* Container esterno full-width */}
      <div className="flex flex-col items-center min-h-screen bg-gray-100 text-gray-900 flex-grow">

        {/* Contenuto testuale in colonna leggibile */}
        <div className="max-w-3xl w-full space-y-6 p-6">
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
        </div>

        {/* MAPPA — fuori dal max-w-3xl, occupa tutta la larghezza */}
        <div className="w-full">
          <GeMap radius={radius} />
        </div>

        {/* Resto del contenuto di nuovo in colonna leggibile */}
        <div className="max-w-3xl w-full space-y-1 p-6">

          <section className="flex flex-col gap-6 w-full">

            {/* Card Tariffe */}
            <Card
              sx={{
                borderRadius: 4,
                width: '100%',
                zIndex: 1000000,
                boxShadow: 0.6,
                bgcolor: 'white',
                mt: -25,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <div className="text-2xl font-extrabold text-blue-700 capitalize">
                    Tariffario
                  </div>
                </Box>
                <Typography component="div" variant="body2" color="text.secondary">
                  I costi di consegna sono calcolati dinamicamente, in base a parametri precisi, per garantirti la massima trasparenza senza sorprese al check-out.

                  {/* Pulsante toggle */}
                  <div
                    onClick={() => setShowTariffs(!showTariffs)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold cursor-pointer select-none transition-colors"
                  >
                    <span>{showTariffs ? 'Nascondi parametri' : 'Vedi i parametri'}</span>
                    <span className="text-xs">{showTariffs ? '▲' : '▼'}</span>
                  </div>
                </Typography>
              </CardContent>
            </Card>

            {/* Lista parametri espansa sotto la card */}
            {showTariffs && (
              <div className="w-full flex justify-center animate-fade-in">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">
                    Parametri utilizzati per il calcolo:
                  </h3>

                  <ul className="flex flex-col gap-4">

                    {/* 1. Distanza tratta */}
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <NavigateNextIcon sx={{ color: '#1d4ed8', fontSize: 28 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Distanza tratta
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Lunghezza del tragitto tra il punto di ritiro e quello di consegna. Maggiore è la distanza, maggiore sarà la componente di costo legata al tempo di percorrenza e al carburante.
                        </p>
                      </div>
                    </li>

                    {/* 2. Dimensione del pacco */}
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <NavigateNextIcon sx={{ color: '#1d4ed8', fontSize: 28 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Dimensione del pacco
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Volume e ingombro della merce da trasportare (numero colli, peso e dimensioni indicative). Influisce sulla saturazione del veicolo e quindi sul costo del servizio.
                        </p>
                      </div>
                    </li>

                    {/* 3. Preavviso di consegna */}
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <NavigateNextIcon sx={{ color: '#1d4ed8', fontSize: 28 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Preavviso di consegna
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Anticipo con cui viene effettuata la richiesta. Le consegne last-minute (preavviso inferiore alle 6 ore rispetto alla fine della fascia oraria di consegna) comportano una maggiorazione tariffaria proporzionale all'urgenza.
                        </p>
                      </div>
                    </li>

                    {/* 4. Fascia oraria */}
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <NavigateNextIcon sx={{ color: '#1d4ed8', fontSize: 28 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Fascia oraria
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Ampiezza della finestra temporale selezionata per il ritiro e per la consegna. Finestre temporali più ristrette comportano un vincolo operativo maggiore e quindi una maggiorazione del costo.
                        </p>
                      </div>
                    </li>

                    {/* 5. Tipologia di servizio */}
                    <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <NavigateNextIcon sx={{ color: '#1d4ed8', fontSize: 28 }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Tipologia di servizio
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Variazioni legate a operazioni speciali: sconto applicato in caso di riconsegna (consegna e ritiro effettuati in un unico passaggio presso lo stesso indirizzo); sovrapprezzo per le consegne in contrassegno con pagamento in contanti tra 100€ e 300€ (per importi superiori è richiesto il POS del mittente).
                        </p>
                      </div>
                    </li>

                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Pulsante */}
          <div className="flex justify-center mt-12 mb-6">
            <Link
              href=""
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              <LocalShippingIcon sx={{ fontSize: 20 }} />
              Organizza la tua consegna!
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}