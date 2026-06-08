"use client";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';

interface Props {
  nome?: string;
  cognome?: string;
  email?: string;
}

export default function PrenotaSpedizioneForm({ nome = "", cognome = "", email = "" }: Props) {
  const [formData, setFormData] = useState({
    Nome: nome,
    Cognome: cognome,
    Titolo: "",
    Inizio_Consegna: "",
    Fine_Consegna: "",
    Descrizione: "",
    Email: email,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:1337/api/consegnas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        alert("Errore nella creazione della consegna");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4 m-2">
      
      <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-5 leading-tight text-center">
        Inserisci i dati<br />
        <span className="text-blue-600">per la spedizione!</span>
      </h2>

      <div className="w-full max-w-lg bg-white border border-gray-100 shadow-sm p-8 rounded-2xl mb-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* SEZIONE 1: Informazioni Personali */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 justify-center flex">
              Informazioni Personali
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <TextField
                label="Nome"
                size="small"
                fullWidth
                value={formData.Nome}
                onChange={(e) => setFormData({ ...formData, Nome: e.target.value })}
              />
              <TextField
                label="Cognome"
                size="small"
                fullWidth
                value={formData.Cognome}
                onChange={(e) => setFormData({ ...formData, Cognome: e.target.value })}
              />
            </div>

            <TextField
              label="Email"
              size="small"
              fullWidth
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
          </div>

          {/* SEZIONE 2: Informazioni sulla spedizione */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 justify-center flex">
              Dettagli Spedizione
            </h3>
            
            <TextField
              label="Titolo della spedizione"
              size="small"
              fullWidth
              value={formData.Titolo}
              onChange={(e) => setFormData({ ...formData, Titolo: e.target.value })}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <TextField
                label=""
                type="datetime-local"
                size="small"
                fullWidth
                value={formData.Inizio_Consegna}
                onChange={(e) => setFormData({ ...formData, Inizio_Consegna: e.target.value })}
              />
              <TextField
                label=""
                type="datetime-local"
                size="small"
                fullWidth
                value={formData.Fine_Consegna}
                onChange={(e) => setFormData({ ...formData, Fine_Consegna: e.target.value })}
              />
            </div>

            <TextField
              label="Descrizione"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Inserisci i dettagli (max 300 parole)..."
              value={formData.Descrizione}
              onChange={(e) => setFormData({ ...formData, Descrizione: e.target.value })}
            />
          </div>

          {/* Pulsanti */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl transition-all active:scale-95 w-full sm:w-auto"
            >
              <CheckIcon className="w-5 h-5" /> 
              Conferma Spedizione
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}