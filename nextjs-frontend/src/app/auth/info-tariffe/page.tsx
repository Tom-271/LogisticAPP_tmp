'use client';

import Link from "next/link";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const GeMap = dynamic(() => import('@/app/components/GeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full bg-gray-200 animate-pulse rounded-xl" />
  ),
});

export default function WhoAmI() {
  const [radius, setRadius] = useState<number>(7500);

  useEffect(() => {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
  console.log('🔵 URL:', `${url}/api/map-config`);
  
  fetch(`${url}/api/map-config`)
    .then((r) => {
      console.log('🔵 Status:', r.status);
      return r.ok ? r.json() : null;
    })
    .then((json) => {
      console.log('🔵 JSON ricevuto:', json);
      const r = json?.data?.radius ?? json?.data?.attributes?.radius;
      console.log('🔵 radius estratto:', r, 'tipo:', typeof r);
      if (typeof r === 'number') {
        console.log('🟢 setRadius chiamato con:', r);
        setRadius(r);
      } else {
        console.log('🔴 radius non è un number, fallback a 7500');
      }
    })
    .catch((err) => {
      console.log('🔴 Errore:', err);
    });
}, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-14 mt-10">
          ZONA DI AZIONE E TARIFFE
        </h1>

        <p className="text-lg">
          Nella seguente mappa della città di Genova, è evidenziata l'area di copertura del nostro servizio di consegna.
          Offriamo tariffe competitive e un servizio affidabile per garantire la soddisfazione dei nostri clienti.
          Le tariffe di consegna variano in base alla distanza e al tipo di servizio richiesto.
          È possibile eseguire una spedizione e di scoprirne preventivamente il costo.
        </p>

        <p className="italic text-gray-400 mt-20">
          Attenzione! L'area sottostante è solo a scopo illustrativo e potrebbe non rappresentare con precisione la zona di copertura reale.
          Alcune di esse potrebbero essere state omesse.
        </p>

        <section>
          <h2 className="text-2xl font-medium mb-3">Dove lavoro</h2>
          <GeMap radius={radius} />
          <p className="text-sm text-gray-600 mt-2">
            L'area evidenziata mostra la zona di copertura del servizio a Genova.
          </p>
        </section>

        <p className="text-lg mt-20">
          Per maggiori dettagli sulle tariffe e sui servizi offerti, non esitate a contattarci tramite la nostra sezione{' '}
          <Link href="/auth/infos" className="text-blue-500">
            Supporto Clienti
          </Link>.
        </p>
      </div>
    </div>
  );
}