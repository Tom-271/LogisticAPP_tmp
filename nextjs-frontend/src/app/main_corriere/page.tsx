import React from "react";
import TruckIcon from "@/app/components/TruckIcon";
import Footer from "@/app/components/Footer";
import AgendaView from "@/app/main_corriere/AgendaView";

import { verifySession } from "../lib/dal";

export default async function MainCorriere() {
  const { session: { user } }: any = await verifySession();
  return (
    <>
      <div className="min-h-screen px-4">
        <div className="ml-40 mt-20 w-auto h-[100px] rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm flex items-center gap-4 inline-flex">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
            <TruckIcon />
          </div>
          <h1 className="text-lg ml-4 font-bold text-black mr-8">
            Area corriere di {user?.username}
          </h1>
        </div>
        <div className="flex justify-center mt-6 px-10 pb-10">
          <div className="w-full max-w-6xl">
            <AgendaView />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
