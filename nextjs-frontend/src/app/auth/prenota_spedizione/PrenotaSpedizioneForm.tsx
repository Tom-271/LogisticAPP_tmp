"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Loader from "@/app/components/Loader";
import { creaConsegnaAction } from "@/app/actions/consegna";

const INPUT_CLASS =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
const LABEL_CLASS = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

interface Props {
  nome?: string;
  cognome?: string;
  email?: string;
  tipo_cliente?: string;
  Ragione_sociale?: string;
  Partita_IVA?: string;
  Codice_SDI?: string;
  PEC_Fatturazione?: string;
  Indirizzo_sede_legale?: string;
  Codice_fiscale?: string;
  Descrizione?: string;
  jwt?: string;
}

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

export default function PrenotaSpedizioneForm({
  nome = "",
  cognome = "",
  email = "",
  tipo_cliente = "privato",
  Ragione_sociale = "",
  Partita_IVA = "",
  Codice_SDI = "",
  PEC_Fatturazione = "",
  Indirizzo_sede_legale = "",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAzienda, setIsAzienda] = useState(tipo_cliente === "azienda");
  const [invoiceMode, setInvoiceMode] = useState<"sdi" | "pec">(
    PEC_Fatturazione ? "pec" : "sdi"
  );
  const [formData, setFormData] = useState({
    Nome: nome,
    Cognome: cognome,
    Titolo: "",
    Descrizione: "",
    Email: email,
    Numero_Telefono: "",
    Ragione_sociale,
    Codice_fiscale: "",
    Partita_IVA,
    Codice_SDI,
    PEC_Fatturazione,
    Indirizzo_sede_legale,
    Inizio_fascia_ritiro: "",
    Fine_fascia_ritiro: "",
    Inizio_fascia_consegna: "",
    Fine_fascia_consegna: "",
    Indirizzo_spedizione: "",
    Cap_spedizione: "",
    Citta_spedizione: "",
    Provincia_spedizione: "",
    Indirizzo_consegna: "",
    Cap_consegna: "",
    Citta_consegna: "",
    Provincia_consegna: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await creaConsegnaAction(formData as Record<string, unknown>);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => { window.location.reload(); }, 2500);
      } else {
        alert(`Errore: ${result.error}`);
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
      alert("Errore di connessione con il server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4 px-4 pb-16">

      <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-5 leading-tight text-center">
        Inserisci i dati<br />
        <span className="text-blue-600">per la spedizione!</span>
      </h2>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        <div className="bg-blue-700 px-6 py-4 flex items-center gap-3 shrink-0">
          <PersonIcon className="text-white" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Informazioni Personali</h3>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 border-b border-gray-100">

          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold">
            <button type="button" onClick={() => setIsAzienda(false)}
              className={`flex-1 py-2 transition-colors ${!isAzienda ? "bg-blue-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              Privato
            </button>
            <button type="button" onClick={() => setIsAzienda(true)}
              className={`flex-1 py-2 transition-colors ${isAzienda ? "bg-blue-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              Azienda
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLASS}>Nome</label>
              <input type="text" placeholder="Mario" value={formData.Nome}
                onChange={(e) => setFormData({ ...formData, Nome: e.target.value })}
                className={INPUT_CLASS} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLASS}>Cognome</label>
              <input type="text" placeholder="Rossi" value={formData.Cognome}
                onChange={(e) => setFormData({ ...formData, Cognome: e.target.value })}
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
            <label className={LABEL_CLASS}>Codice Fiscale</label>
            <input type="text" placeholder="RSSMRA85A01H501X" value={formData.Codice_fiscale}
              onChange={(e) => setFormData({ ...formData, Codice_fiscale: e.target.value })}
              className={INPUT_CLASS} />
          </div>

          {isAzienda && (
            <>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLASS}>Ragione Sociale</label>
                <input type="text" placeholder="Es. Mario Rossi S.r.l." value={formData.Ragione_sociale}
                  onChange={(e) => setFormData({ ...formData, Ragione_sociale: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLASS}>Partita IVA</label>
                <input type="text" placeholder="01234567890" value={formData.Partita_IVA}
                  onChange={(e) => setFormData({ ...formData, Partita_IVA: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLASS}>Indirizzo sede legale</label>
                <input type="text" placeholder="Via Roma 1, 00100 Roma (RM)" value={formData.Indirizzo_sede_legale}
                  onChange={(e) => setFormData({ ...formData, Indirizzo_sede_legale: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
              <div className="flex flex-col gap-2">
                <label className={LABEL_CLASS}>Ricezione fattura elettronica</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-semibold">
                  <button type="button"
                    onClick={() => { setInvoiceMode("sdi"); setFormData((f) => ({ ...f, PEC_Fatturazione: "" })); }}
                    className={`flex-1 py-2 transition-colors ${invoiceMode === "sdi" ? "bg-blue-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                    Codice SDI
                  </button>
                  <button type="button"
                    onClick={() => { setInvoiceMode("pec"); setFormData((f) => ({ ...f, Codice_SDI: "" })); }}
                    className={`flex-1 py-2 transition-colors ${invoiceMode === "pec" ? "bg-blue-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                    PEC
                  </button>
                </div>
                {invoiceMode === "sdi" ? (
                  <div className="flex flex-col gap-1">
                    <input type="text" placeholder="Es. A1B2C3D (7 caratteri)" maxLength={7}
                      value={formData.Codice_SDI}
                      onChange={(e) => setFormData({ ...formData, Codice_SDI: e.target.value.toUpperCase() })}
                      className={INPUT_CLASS} />
                    {formData.Codice_SDI.length > 0 && formData.Codice_SDI.length < 7 && (
                      <p className="text-xs text-orange-500">{7 - formData.Codice_SDI.length} caratteri mancanti</p>
                    )}
                    {formData.Codice_SDI.length === 7 && (
                      <p className="text-xs text-green-600">Codice SDI valido</p>
                    )}
                    {formData.Codice_SDI !== "0000000" && (
                      <p className="text-xs text-gray-400">
                        Non hai un codice SDI?{" "}
                        <button type="button"
                          onClick={() => setFormData((f) => ({ ...f, Codice_SDI: "0000000" }))}
                          className="text-blue-500 hover:text-blue-700 underline underline-offset-2 font-medium transition-colors">
                          Usa 0000000
                        </button>
                      </p>
                    )}
                  </div>
                ) : (
                  <input type="email" placeholder="fatturazione@pec.esempio.it"
                    value={formData.PEC_Fatturazione}
                    onChange={(e) => setFormData({ ...formData, PEC_Fatturazione: e.target.value })}
                    className={INPUT_CLASS} />
                )}
              </div>
            </>
          )}
        </div>

        <div className="bg-blue-700 px-6 py-4 flex items-center gap-3 shrink-0">
          <LocalShippingIcon className="text-white" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Dettagli Spedizione</h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label className={LABEL_CLASS}>Titolo della spedizione</label>
            <input required type="text" placeholder="Es. Consegna Via Roma 12"
              value={formData.Titolo}
              onChange={(e) => setFormData({ ...formData, Titolo: e.target.value })}
              className={INPUT_CLASS} />
          </div>

          <div className="flex flex-col gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div>
              <p className="text-sm font-semibold text-blue-800">Fascia oraria di ritiro</p>
              <p className="text-xs text-blue-500">Indica quando sei disponibile a far ritirare il pacco dal corriere</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL_CLASS}>Da</label>
                <input required type="datetime-local" value={formData.Inizio_fascia_ritiro}
                  onChange={(e) => setFormData({ ...formData, Inizio_fascia_ritiro: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
              <AccessTimeIcon fontSize="small" className="text-blue-300 mt-5 shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL_CLASS}>A</label>
                <input required type="datetime-local" value={formData.Fine_fascia_ritiro}
                  onChange={(e) => setFormData({ ...formData, Fine_fascia_ritiro: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
            </div>
            <div className="border-t border-blue-200 pt-3">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Indirizzo di ritiro</p>
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
          </div>

          <div className="flex flex-col gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div>
              <p className="text-sm font-semibold text-orange-700">Stima periodo di consegna</p>
              <p className="text-xs text-orange-400">Indica entro quando vorresti ricevere il pacco a destinazione</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL_CLASS}>Da</label>
                <input required type="datetime-local" value={formData.Inizio_fascia_consegna}
                  onChange={(e) => setFormData({ ...formData, Inizio_fascia_consegna: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
              <AccessTimeIcon fontSize="small" className="text-orange-300 mt-5 shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <label className={LABEL_CLASS}>A</label>
                <input required type="datetime-local" value={formData.Fine_fascia_consegna}
                  onChange={(e) => setFormData({ ...formData, Fine_fascia_consegna: e.target.value })}
                  className={INPUT_CLASS} />
              </div>
            </div>
            <div className="border-t border-orange-200 pt-3">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Indirizzo di consegna</p>
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
          </div>

          <div className="flex flex-col gap-1">
            <label className={LABEL_CLASS}>Note</label>
            <textarea rows={4} placeholder="Inserisci i dettagli (max 300 parole)…"
              value={formData.Descrizione}
              onChange={(e) => setFormData({ ...formData, Descrizione: e.target.value })}
              className={`${INPUT_CLASS} resize-none`} />
          </div>
            
            
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-full w-[70%] mt-4 mb-4 self-center"
          >
            Calcola Preventivo Spedizione
          </button>

          {isLoading && typeof window !== "undefined" && createPortal(
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader />
              <p className="mt-4 text-sm font-semibold text-gray-600 tracking-wide">Calcolo in corso…</p>
            </div>,
            document.body
          )}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl shadow-sm w-full sm:w-auto justify-center disabled:opacity-60">
              <CheckIcon style={{ fontSize: 16 }} />
              {isSubmitting ? "Invio in corso…" : "Conferma Spedizione"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && typeof window !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-2xl px-10 py-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircleIcon className="text-green-500" style={{ fontSize: 40 }} />
            </div>
            <p className="text-lg font-bold text-gray-800">Inserimento effettuato correttamente</p>
            <p className="text-sm text-gray-400">La pagina si aggiornerà tra un momento…</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
