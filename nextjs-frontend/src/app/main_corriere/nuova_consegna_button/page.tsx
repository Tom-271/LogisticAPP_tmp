"use client";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';

export default function NuovaConsegnaButton({ onSuccess }: { onSuccess: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Titolo: "",
    Inizio_Consegna: "",
    Fine_Consegna: "",
    Descrizione: ""
  });

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:1337/api/consegnas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        setShowForm(false);
        if (onSuccess) onSuccess(); 
      } else {
        alert("Errore nella creazione della consegna");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 m-2">
      <button 
        onClick={toggleForm} 
        className="w-auto px-5 py-3 gap-3 text-sm font-medium h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
      >
        Aggiungi una consegna
        <AddIcon className="w-5 h-5" />
      </button>

      {showForm && (
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl p-6 rounded-xl mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField 
              label="Titolo" 
              size="small" 
              fullWidth
              value={formData.Titolo}
              onChange={(e) => setFormData({...formData, Titolo: e.target.value})}
            />
            
            <div className="flex flex-col gap-4 w-full">
              <TextField 
                label=""
                 type="datetime-local"
                  size="small"
                  fullWidth
                onChange={(e) => setFormData({...formData, Inizio_Consegna: e.target.value})}
              />
              
              <TextField 
                label=""
                 type="datetime-local"
                 size="small"
                 fullWidth
                onChange={(e) => setFormData({...formData, Fine_Consegna: e.target.value})}
              />
            </div>

            <TextField
              label="Descrizione" multiline rows={4} fullWidth variant="outlined"
              placeholder="Max 300 parole..."
              value={formData.Descrizione}
              onChange={(e) => setFormData({...formData, Descrizione: e.target.value})}
            />
            
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={toggleForm} type="button" className="text-sm px-4 py-2 text-gray-600">Annulla</button>
              <button type="submit" className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckIcon className="w-4 h-4" /> Salva
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}