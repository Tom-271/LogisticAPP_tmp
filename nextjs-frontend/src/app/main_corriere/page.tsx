import Link from "next/link";
import React from "react";
import LogOutButton from "@/app/components/LogOutButton";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Footer from "@/app/components/Footer";

import { verifySession } from "../lib/dal";

export default async function MainCorriere() {
  const { session: { user } }: any = await verifySession();
  return (
    <>
      <div className="relative min-h-screen bg-gray-100 px-4">

        {/* l'ho sparato ad auto così si assesta alla dimensione del nickname*/}
        <div className="absolute top-20 left-40 w-auto h-[100px] rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
            <LocalShippingIcon className="text-white" fontSize="large" />
          </div>
          <h1 className="text-lg ml-4 font-bold text-black mr-8">
            Area corriere di {user?.username}
          </h1>
        </div>
        

      </div>
      <Footer />
    </>
  );
}
