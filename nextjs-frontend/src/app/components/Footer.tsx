'use client';

import React from "react";
import Link from "next/link";
import EmailIcon from '@mui/icons-material/Email';
import RoomIcon from '@mui/icons-material/Room';
import EuroIcon from '@mui/icons-material/Euro';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gray-50 flex flex-col items-center pt-10 pb-6 border-t border-gray-200 font-sans">
      
      {/* Sezione 4 Colonne con divisore verticale */}
      <div className="w-full max-w-7xl px-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white">
          
          {/* 1. Mail */}
          <a 
            href="mailto:logicAPP.info@gmail.com"
            className="flex flex-col items-center text-center px-4 py-6 md:py-3 transition-colors group decoration-transparent"
          >
            <EmailIcon className="text-blue-800 mb-3" style={{ fontSize: 40 }} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-gray-900 mb-2">Mail</h3>
            <p className="text-xs text-gray-600 mb-3 flex-grow">
              Per preventivi o richieste non esitare a contattarci. 
            </p>
            <p className="font-bold text-blue-700 text-base break-all">
              logicAPP.info@gmail.com
            </p>
            <span className="font-bold text-blue-700 text-base break-all  transition-colors">
               <ArrowOutwardIcon className="inline-block ml-1" style={{ fontSize: 16 }} />
            </span>
          </a>

          {/* 2. Dove Lavoro */}
          <Link
            href="/auth/area_operativa"
            className="flex flex-col items-center text-center px-4 py-6 md:py-3 transition-colors group decoration-transparent"
          >
            <RoomIcon className="text-blue-800 mb-3" style={{ fontSize: 40 }} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-gray-900 mb-2">Dove Lavoro</h3>
            <p className="text-xs text-gray-600 mb-3 flex-grow">
              Trasparenza, velocità e precisione. Ecco le zone principalmente coperte.
            </p>
            <span className="font-bold text-blue-700 text-base  transition-colors">
              <ArrowOutwardIcon className="inline-block ml-1" style={{ fontSize: 16 }} />
            </span>
          </Link>

          {/* 3. Tariffe */}
          <Link
            href="/auth/area_operativa"
            className="flex flex-col items-center text-center px-4 py-6 md:py-3 transition-colors group decoration-transparent"
          >
            <EuroIcon className="text-blue-800 mb-3" style={{ fontSize: 40 }} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-gray-900 mb-2">Tariffe</h3>
            <p className="text-xs text-gray-600 mb-3 flex-grow">
              Scopri le nostre tariffe competitive e i vantaggi esclusivi per i clienti. Scopri come eseguire un preventivo in pochi click.
            </p>
            <span className="font-bold text-blue-700 text-base  transition-colors">
              <ArrowOutwardIcon className="inline-block ml-1" style={{ fontSize: 16 }} />
            </span>
          </Link>

          {/* 4. Proposta Lavorativa (Apre mail come richiesto) */}
          <a 
            href="mailto:logicAPP.info@gmail.com"
            className="flex flex-col items-center text-center px-4 py-6 md:py-3 transition-colors group decoration-transparent"
          >
            <GroupAddIcon className="text-blue-800 mb-3" style={{ fontSize: 40 }} />
            <h3 className="font-bold text-lg uppercase tracking-wider text-gray-900 mb-2">Lavora con Noi</h3>
            <p className="text-xs text-gray-600 mb-3 flex-grow">
              Cerchiamo sempre nuovi professionisti. Inviaci la tua proposta lavorativa via mail condividendo CV e lettera di presentazione.
            </p>
            <span className="font-bold text-blue-700 text-base  transition-colors">
               <ArrowOutwardIcon className="inline-block ml-1" style={{ fontSize: 16 }} />
            </span>
          </a>

        </div>
      </div>

      {/* Linea separatrice orizzontale */}
      <div className="w-[80%] max-w-5xl h-[1px] bg-gray-300 mb-6" />

      <div className="text-center text-white text-sm mb-4 h-full w-full">
        {/* Dati Aziendali */}
      <div className="text-center text-gray-700 px-4 ">
        <p className="font-bold text-gray-900 text-base tracking-wide">LogicAPP</p>
        <p className="mt-1 text-xs font-medium">Genova (GE) ITALIA | P.Iva 000000000</p>
      </div>

      {/* Social */}
      <div className="mt-4">
        <ul className="flex justify-center">
          <li>
            <a target="_blank" rel="noreferrer" href="#" className="block hover:scale-110 transition-transform">
              <img 
                src="https://www.chefstudio.it/img/instagram-icon.png" 
                title="Instagram" 
                alt="Instagram icon" 
                className="w-5 h-5" 
              />
            </a>
          </li>
        </ul>
      </div>
      </div>
    </footer>
  );
}