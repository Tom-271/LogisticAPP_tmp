"use client";
import { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// NUOVO: provider di geocoding gratuito (OpenStreetMap) della libreria leaflet-geosearch
import { OpenStreetMapProvider } from "leaflet-geosearch";

export default function NuovaConsegnaButton({ onSuccess }: { onSuccess?: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Titolo: "",
    Inizio_Consegna: "",
    Fine_Consegna: "",
    Numero_Telefono: "",
    Descrizione: "",
    Email: "",
    Indirizzo_RITIRO: "",
    Indirizzo_CONSEGNA: "",
  });

  const close = () => setShowForm(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:1337/api/consegnas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });
      if (response.ok) {
        close();
        if (onSuccess) onSuccess();
      } else {
        alert("Errore nella creazione della consegna");
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="w-auto px-5 py-3 gap-3 text-sm font-medium h-14 bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all hover:bg-blue-700 active:scale-95 shadow-sm m-2"
      >
        Aggiungi una consegna
        <AddIcon className="w-5 h-5" />
      </button>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LocalShippingIcon className="text-white" />
                <h2 className="text-lg font-bold text-white tracking-wide">Nuova Consegna</h2>
              </div>
              <button
                onClick={close}
                className="text-blue-200 hover:text-white hover:bg-blue-600 rounded-full p-1 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

              {/* Titolo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Titolo</label>
                <input
                  required
                  type="text"
                  placeholder="Es. Consegna Via Roma 12"
                  value={formData.Titolo}
                  onChange={(e) => setFormData({ ...formData, Titolo: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              {/* ===================== NUOVO: Indirizzi con autocomplete ===================== */}
              <AddressAutocomplete
                label="Indirizzo di ritiro"
                placeholder="Es. Via Balbi 5, Genova"
                onSelect={(addr) => setFormData((f) => ({ ...f, Indirizzo_RITIRO: addr }))}
              />
              <AddressAutocomplete
                label="Indirizzo di consegna"
                placeholder="Es. Corso Italia 12, Genova"
                onSelect={(addr) => setFormData((f) => ({ ...f, Indirizzo_CONSEGNA: addr }))}
              />
              {/* =================== FINE blocco indirizzi =================== */}

              {/* Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inizio</label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.Inizio_Consegna}
                    onChange={(e) => setFormData({ ...formData, Inizio_Consegna: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fine</label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.Fine_Consegna}
                    onChange={(e) => setFormData({ ...formData, Fine_Consegna: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">email</label>
                <input
                  type="email"
                  placeholder="mario.rossi@gmail.com"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              {/* Telefono */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Numero di telefono</label>
                <input
                  type="tel"
                  placeholder="Es. +39 333 1234567"
                  value={formData.Numero_Telefono}
                  onChange={(e) => setFormData({ ...formData, Numero_Telefono: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>


              {/* Descrizione */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</label>
                <textarea
                  rows={3}
                  placeholder="Informazioni aggiuntive..."
                  value={formData.Descrizione}
                  onChange={(e) => setFormData({ ...formData, Descrizione: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={close}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl transition-all "
                >
                  <CheckIcon style={{ fontSize: 16 }} />
                  {loading ? "Salvataggio..." : "Salva consegna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================================
   NUOVO: Componente di autocomplete indirizzi
   - Geocoding via leaflet-geosearch (OpenStreetMapProvider), gratis e senza key
   - addressdetails=1 -> uso i campi strutturati (raw.address) per costruire
     un'etichetta PULITA: solo via, città, CAP (niente quartieri/provincia/regione)
   - Numero civico in un input SEPARATO; l'indirizzo finale = via + civico + città + CAP
   - debounce 300ms per rispettare i limiti dell'istanza pubblica OSM/Nominatim
   ============================================================================ */
function AddressAutocomplete({
  label,
  placeholder,
  onSelect,
}: {
  label: string;
  placeholder?: string;
  onSelect: (addr: string) => void;
}) {
  const provider = useRef(
    new OpenStreetMapProvider({
      params: {
        addressdetails: 1,
        countrycodes: "it",
        "accept-language": "it",
      },
    })
  );
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null); // raw.address scelto
  const [civico, setCivico] = useState("");

  // via + città + CAP (niente quartiere/provincia/regione)
  const cleanLabel = (a: any): string => {
    if (!a) return "";
    const street = a.road || a.footway || a.name || "";
    const city = a.city || a.town || a.village || a.municipality || "";
    return [street, city, a.postcode].filter(Boolean).join(", ");
  };

  // indirizzo finale: "Via X 12, Città, CAP"
  const buildFinal = (a: any, civ: string): string => {
    if (!a) return "";
    const street = a.road || a.footway || a.name || "";
    const city = a.city || a.town || a.village || a.municipality || "";
    const line1 = [street, civ].filter(Boolean).join(" ");
    return [line1, city, a.postcode].filter(Boolean).join(", ");
  };

  useEffect(() => {
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await provider.current.search({ query: q });
      setResults(res);
      setOpen(true);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-3">
        {/* Via (autocomplete) */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {open && results.length > 0 && (
            <ul className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-auto">
              {results.map((r, i) => {
                const lbl = cleanLabel(r.raw?.address) || r.label;
                return (
                  <li
                    key={i}
                    onClick={() => {
                      const addr = r.raw?.address || null;
                      setSelected(addr);
                      setQ(lbl);
                      setOpen(false);
                      onSelect(buildFinal(addr, civico));
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                  >
                    {lbl}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Numero civico (separato) */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="Civico"
          value={civico}
          onChange={(e) => {
            const v = e.target.value;
            setCivico(v);
            if (selected) onSelect(buildFinal(selected, v));
          }}
          className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
    </div>
  );
}