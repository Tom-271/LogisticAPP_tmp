"use client";

import { useState } from "react";
import Calendar from "@/app/components/Calendar";
import TruckIcon from "@/app/components/TruckIcon";

export default function AgendaView({ username }: { username: string }) {
  const [refreshTrigger] = useState(0);

  return (
    <>
      <div className="mb-6 h-[100px] rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
          <TruckIcon />
        </div>
        <h1 className="text-lg ml-4 font-bold text-black">
          Area corriere di {username}
        </h1>
      </div>
      <Calendar refreshTrigger={refreshTrigger} />
    </>
  );
}
