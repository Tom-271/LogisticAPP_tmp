"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const INPUT_CLASS =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
const LABEL_CLASS = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

interface AddressFields {
  indirizzo: string;
  cap: string;
  citta: string;
  provincia: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  class: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    "ISO3166-2-lvl6"?: string;
  };
}

function AddressSection({
  color = "blue",
  onChange,
}: {
  color?: "blue" | "orange";
  onChange: (fields: AddressFields) => void;
}) {
  const [via, setVia] = useState("");
  const [civico, setCivico] = useState("");
  const [cap, setCap] = useState("");
  const [citta, setCitta] = useState("");
  const [provincia, setProvincia] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (via.trim().length < 3) { setSuggestions([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(via)}&format=json&limit=8&addressdetails=1&countrycodes=it&accept-language=it`
        );
        const data: NominatimResult[] = await res.json();
        const streets = data.filter(
          (item) => item.class === "highway" || !!item.address?.road
        );
        if (streets.length > 0 && inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
        setSuggestions(streets);
        setOpen(streets.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [via]);

  const notify = (v: string, c: string, cp: string, ct: string, pr: string) =>
    onChange({ indirizzo: [v, c].filter(Boolean).join(", "), cap: cp, citta: ct, provincia: pr });

  const select = (item: NominatimResult) => {
    const street = item.address.road ?? "";
    const newCap = item.address.postcode ?? "";
    const newCitta = item.address.city ?? item.address.town ?? item.address.village ?? "";
    const iso = item.address["ISO3166-2-lvl6"];
    const newProvincia = iso
      ? (iso.split("-").pop() ?? "")
      : (item.address.county ?? "").slice(0, 2).toUpperCase();

    setVia(street);
    setCap(newCap);
    setCitta(newCitta);
    setProvincia(newProvincia);
    setVerified(true);
    setOpen(false);
    notify(street, civico, newCap, newCitta, newProvincia);
  };

  const accentRing = color === "orange" ? "focus:ring-orange-400" : "focus:ring-blue-400";
  const viaClass = `${INPUT_CLASS} pr-10 ${
    verified === true
      ? "border-green-400 focus:ring-green-400"
      : verified === false
      ? "border-orange-400 focus:ring-orange-400"
      : accentRing
  }`;

  const dropdown =
    mounted && open && suggestions.length > 0
      ? createPortal(
          <ul
            style={{
              position: "fixed",
              top: dropPos.top,
              left: dropPos.left,
              width: dropPos.width,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto"
          >
            {suggestions.map((item) => (
              <li
                key={item.place_id}
                onMouseDown={() => select(item)}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
              >
                <span className="font-medium">{item.address.road ?? item.display_name}</span>
                {(item.address.city ?? item.address.town) && (
                  <span className="text-gray-400 ml-1">
                    — {item.address.city ?? item.address.town}
                  </span>
                )}
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>Via / Corso / Piazza</label>
        <div ref={wrapperRef} className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Es. Corso Monte Grappa"
            value={via}
            autoComplete="off"
            onChange={(e) => {
              setVia(e.target.value);
              setVerified(null);
              notify(e.target.value, civico, cap, citta, provincia);
            }}
            onBlur={() => { if (via.trim().length > 0 && verified !== true) setVerified(false); }}
            className={viaClass}
          />
          {verified === true && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
              <CheckCircleIcon fontSize="small" />
            </span>
          )}
          {verified === false && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
              <WarningAmberIcon fontSize="small" />
            </span>
          )}
        </div>
        {verified === false && (
          <p className="text-xs text-orange-500">Seleziona dal menu per verificare l&apos;indirizzo</p>
        )}
        {verified === true && (
          <p className="text-xs text-green-600">Indirizzo verificato ✓</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS}>N. Civico</label>
        <input type="text" placeholder="Es. 12" value={civico}
          onChange={(e) => { setCivico(e.target.value); notify(via, e.target.value, cap, citta, provincia); }}
          className={INPUT_CLASS} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>CAP</label>
          <input type="text" placeholder="36061" maxLength={5} value={cap}
            onChange={(e) => { setCap(e.target.value); notify(via, civico, e.target.value, citta, provincia); }}
            className={INPUT_CLASS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Città</label>
          <input type="text" placeholder="Roma" value={citta}
            onChange={(e) => { setCitta(e.target.value); notify(via, civico, cap, e.target.value, provincia); }}
            className={INPUT_CLASS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={LABEL_CLASS}>Prov.</label>
          <input type="text" placeholder="RM" maxLength={2} value={provincia}
            onChange={(e) => {
              const v = e.target.value.toUpperCase();
              setProvincia(v);
              notify(via, civico, cap, citta, v);
            }}
            className={INPUT_CLASS} />
        </div>
      </div>

      {dropdown}
    </div>
  );
}

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
    Indirizzo_spedizione: "",
    Cap_spedizione: "",
    Citta_spedizione: "",
    Provincia_spedizione: "",
    Indirizzo_consegna: "",
    Cap_consegna: "",
    Citta_consegna: "",
    Provincia_consegna: "",
  });

  const close = () => setShowForm(false);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

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
        className="w-auto px-5 py-3 gap-3 text-sm font-medium h-14 bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all hover:bg-blue-800 active:scale-95 shadow-sm m-2"
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
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            <div className="bg-blue-700 px-6 py-4 flex items-center justify-between shrink-0 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <LocalShippingIcon className="text-white" />
                <h2 className="text-lg font-bold text-white tracking-wide">Nuova Consegna</h2>
              </div>
              <button onClick={close}
                className="text-blue-200 hover:text-white hover:bg-blue-600 rounded-full p-1 transition-colors">
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

              <div className="flex flex-col gap-1">
                <label className={LABEL_CLASS}>Titolo</label>
                <input required type="text" placeholder="Es. Consegna Via Roma 12"
                  value={formData.Titolo}
                  onChange={(e) => setFormData({ ...formData, Titolo: e.target.value })}
                  className={INPUT_CLASS} />
              </div>

              <div className="flex flex-col gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  📦 Indirizzo di ritiro
                </p>
                <AddressSection
                  color="blue"
                  onChange={(f) =>
                    setFormData((prev) => ({
                      ...prev,
                      Indirizzo_spedizione: f.indirizzo,
                      Cap_spedizione: f.cap,
                      Citta_spedizione: f.citta,
                      Provincia_spedizione: f.provincia,
                    }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                  🏠 Indirizzo di consegna
                </p>
                <AddressSection
                  color="orange"
                  onChange={(f) =>
                    setFormData((prev) => ({
                      ...prev,
                      Indirizzo_consegna: f.indirizzo,
                      Cap_consegna: f.cap,
                      Citta_consegna: f.citta,
                      Provincia_consegna: f.provincia,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={LABEL_CLASS}>Inizio</label>
                  <input required type="datetime-local" value={formData.Inizio_Consegna}
                    onChange={(e) => setFormData({ ...formData, Inizio_Consegna: e.target.value })}
                    className={INPUT_CLASS} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={LABEL_CLASS}>Fine</label>
                  <input required type="datetime-local" value={formData.Fine_Consegna}
                    onChange={(e) => setFormData({ ...formData, Fine_Consegna: e.target.value })}
                    className={INPUT_CLASS} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={LABEL_CLASS}>Email</label>
                  <input type="email" placeholder="mario.rossi@gmail.com" value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    className={INPUT_CLASS} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={LABEL_CLASS}>Telefono</label>
                  <input type="tel" placeholder="+39 333 1234567" value={formData.Numero_Telefono}
                    onChange={(e) => setFormData({ ...formData, Numero_Telefono: e.target.value })}
                    className={INPUT_CLASS} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={LABEL_CLASS}>Note</label>
                <textarea rows={3} placeholder="Informazioni aggiuntive…"
                  value={formData.Descrizione}
                  onChange={(e) => setFormData({ ...formData, Descrizione: e.target.value })}
                  className={`${INPUT_CLASS} resize-none`} />
              </div>

              <div className="flex justify-end gap-3 pt-1 pb-1">
                <button type="button" onClick={close}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all">
                  Annulla
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-xl hover:bg-blue-800 active:scale-95 transition-all shadow-sm disabled:opacity-60">
                  <CheckIcon style={{ fontSize: 16 }} />
                  {loading ? "Salvataggio…" : "Salva consegna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
