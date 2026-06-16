"use client";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PrenotaSpedizioneForm from "@/app/auth/prenota_spedizione/PrenotaSpedizioneForm";

export default function NuovaConsegnaButton() {
  const [showForm, setShowForm] = useState(false);

  const close = () => setShowForm(false);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="shrink-0 h-[100px] px-6 bg-blue-700 text-white rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-blue-800 active:scale-95 shadow-sm"
      >
        <LocalShippingIcon />
        <span className="text-sm font-semibold">Nuova consegna</span>
        <AddIcon style={{ fontSize: 16 }} />
      </button>

      {showForm && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="flex min-h-full justify-center px-4 py-10">
          <div className="relative w-full max-w-lg h-fit">
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow transition-colors"
            >
              <CloseIcon fontSize="small" />
            </button>
            <PrenotaSpedizioneForm />
          </div>
          </div>
        </div>
      )}
    </>
  );
}
