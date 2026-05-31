import Link from "next/link";
import React from "react";
import { verifySession } from "../lib/dal";
import LogOutButton from "./LogOutButton";
import logo from "@/app/auth/images/bazzurro_delivery.png";;
import UserButton from "./UserButton";

export default async function Navbar() {
  const result: any = await verifySession().catch(() => null);
  const isAuth = result?.isAuth;
  const user = result?.session?.user;

  return (
    <nav className="flex flex-col bg-white shadow-md">
      {/* Riga superiore: logo + pulsanti */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold cursor-pointer">
          <img src={logo.src} alt="Bazzurro Delivery" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/area_operativa"
            className="px-6 py-4 rounded-lg text-blue-600 font-medium border border-transparent"
          >
            Dove lavoriamo
          </Link>
          <Link
            href="/auth/infos"
            className="px-6 py-4 rounded-lg text-blue-600 font-medium border border-transparent"
          >
            Tariffe 
          </Link>

          {isAuth ? (
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <UserButton nome={user?.nome} cognome={user?.cognome} />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-3 rounded-lg bg-green-600 text-white font-medium shadow-md "
            >
              Accedi
            </Link>
          )}
        </div>
      </div>

      {/* Riga blu sotto: 70% larghezza, centrata */}
      <div className="w-[70%] h-[0.5px] bg-gray-400 mx-auto mb-3" />
    </nav>
  );
}