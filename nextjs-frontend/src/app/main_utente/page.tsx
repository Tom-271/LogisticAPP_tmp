import Link from "next/link";
import React from "react";
import LogOutButton from "@/app/components/LogOutButton";
import Footer from "@/app/components/Footer";

import { verifySession } from "../lib/dal";

export default async function MainUtente() {
  const { session: { user } }: any = await verifySession();
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center space-y-6">
          <p className="text-xl font-semibold text-gray-800 capitalize">
            Benvenuto, {user?.username}!
          </p>
          <p className="text-sm text-gray-500">Area Utente</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/change-password"
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Cambia password
            </Link>
            <LogOutButton />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
