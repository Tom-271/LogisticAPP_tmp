import Link from "next/link";
import React from "react";
import LogOutButton from "@/app/components/LogOutButton";
import { verifySession } from "@/app/lib/dal";
import ToggleInfo from "@/app/components/ToggleInfo";

export default async function Profile() {
  // 1. Recupera la sessione
  const result: any = await verifySession();
  
  // 2. Estrai i dati
  const user = result?.session?.user;
  const role = user?.role || "Ruolo non definito"; 
  const email = user?.email || "Non presente";
  const nome = user?.nome || "Nome";
  const cognome = user?.cognome || "Cognome";
  const username = user?.username || "Utente";

  // Calcola le prime due iniziali per l'avatar dinamico
  const initials = `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

  // 3. Renderizza la UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      {/* Aumentato max-w e arrotondamento per un look più moderno */}
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8">
        
        {/* Header Profilo con Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-inner text-white text-3xl font-bold tracking-widest">
            {initials}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
              {nome} {cognome}
            </h1>
            <p className="text-sm font-medium text-gray-500">@{username}</p>
          </div>
          
          {/* Badge del Ruolo */}
          <span className="px-4 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wider">
            {role}
          </span>
        </div>

        {/* Scheda Dati Utente */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
            <span className="text-gray-800 font-medium">{email}</span>
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome Completo</span>
            <span className="text-gray-800 font-medium capitalize">{nome} {cognome}</span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</span>
            <span className="text-gray-800 font-medium">{username}</span>
          </div>
        </div>

        

        {/* Toggle mutuamente esclusivo */}
        <ToggleInfo />

        {/* Pulsanti di Azione */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          {/* ... */}
        </div>

        {/* Pulsanti di Azione */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link
            href="/auth/change-password"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-200 text-center"
          >
            Cambia Password
          </Link>
          <LogOutButton />
        </div>


      
      </div>
    </div>
  );
}