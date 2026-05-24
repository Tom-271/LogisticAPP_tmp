"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserButtonProps {
  nome?: string;
  cognome?: string;
}

export default function UserButton({ nome, cognome }: UserButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/auth/user-page") return null;

  const isLoggedIn = Boolean(nome || cognome);
  const initials = `${(nome || "").charAt(0)}${(cognome || "").charAt(0)}`.toUpperCase();

  if (isLoggedIn) {
    return (
      <button
        onClick={() => router.push("/auth/user-page")}
        aria-label="Vai al profilo"
        title="Vai al profilo"
        className="cursor-pointer w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg text-white text-sm font-bold tracking-widest transition-all duration-200"
      >
        {initials}
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push("/auth/login")}
      className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
      Login
    </button>
  );
}