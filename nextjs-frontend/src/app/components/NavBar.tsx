import Link from "next/link";
import React from "react";
import { verifySession } from "../lib/dal";
import LogOutButton from "./LogOutButton";
import UserButton from "./UserButton";


export default async function Navbar() {
  const { isAuth }: any = await verifySession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-semibold cursor-pointer">
        LogicAPP
      </Link>

      <div className="flex items-center gap-3">
        <Link
            href="/auth/info-tariffe"
            className="px-6 py-4 rounded-lg text-blue-600 font-bold border border-transparent"
          >
          I nostri servizi 
        </Link>
        <Link
            href="/auth/infos"
            className="px-6 py-4 rounded-lg text-blue-600 font-bold border border-transparent"
          >
          Supporto Clienti

        </Link>

        {isAuth ? (
          <div className="flex items-center gap-4 ml-2">
            <UserButton />
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow-md transition-transform transform cursor-pointer"
          >
            Sign-in
          </Link>
        )}
      </div>
    </nav>
  );
}