import React from "react";
import Footer from "@/app/components/Footer";
import AgendaView from "@/app/main_corriere/AgendaView";
import { verifySession } from "../lib/dal";

export default async function MainCorriere() {
  const { session: { user } }: any = await verifySession();
  return (
    <>
      <div className="min-h-screen px-4">
        <div className="flex justify-center mt-20 px-10 pb-10">
          <div className="w-full max-w-6xl">
            <AgendaView username={user?.username ?? ""} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
