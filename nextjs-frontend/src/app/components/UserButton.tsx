"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

// Definisci le props che il componente si aspetta
interface UserButtonProps {
  username?: string;
}

export default function UserButton({ username }: UserButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/auth/user-page") {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/auth/user-page")}
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
      Profilo
    </button>
  );
}