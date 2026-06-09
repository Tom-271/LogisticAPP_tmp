import Link from "next/link";
import React from "react";
import HomeParallax from "@/app/components/HomeParallax";
import Footer from "@/app/components/Footer";

import { verifySession } from "../lib/dal";

export default async function MainUtente() {
  const { session: { user } }: any = await verifySession();
  return (
    <div className="flex flex-col min-h-screen text-gray-900">
          <HomeParallax />
          <Footer />
        </div>
  );
}
