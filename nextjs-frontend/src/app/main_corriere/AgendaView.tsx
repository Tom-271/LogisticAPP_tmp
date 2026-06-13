"use client";

import { useState, useCallback } from "react";
import NuovaConsegnaButton from "@/app/main_corriere/nuova_consegna_button/page";
import Calendar from "@/app/components/Calendar";

export default function AgendaView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refresh = useCallback(() => setRefreshTrigger(t => t + 1), []);

  return (
    <>
      <NuovaConsegnaButton onSuccess={refresh} />
      <Calendar refreshTrigger={refreshTrigger} />
    </>
  );
}
