// app/components/NuovaConsegnaButton.tsx
"use client";
import AddIcon from "@mui/icons-material/Add";

export default function NuovaConsegnaButton() {
  function handleClick() {
    alert("Funzionalità di creazione nuova consegna non ancora implementata.");
  }

  return (
    <button onClick={handleClick} className="bg-blue-600 px-4 py-2 rounded-lg text-white mb-4 flex items-center gap-2">
      <AddIcon />
      Nuova consegna
    </button>
  );
}