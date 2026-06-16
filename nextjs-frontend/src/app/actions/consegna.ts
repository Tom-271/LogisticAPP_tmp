"use server";
import { verifySession } from "../lib/dal";

export async function creaConsegnaAction(data: Record<string, unknown>) {
  try {
    const { session } = await verifySession();
    const jwt = (session as any)?.jwt as string | undefined;

    // I campi JSON di Strapi vogliono oggetti, non stringhe bare
    const wrapJson = (v: unknown) =>
      v && typeof v === "string" ? { value: v } : v ?? undefined;

    // phone_number deve essere un numero (o assente)
    const phone = data.Numero_Telefono ?? data.phone_number;
    const phoneNum = phone ? Number(phone) : undefined;

    const payload: Record<string, unknown> = {
      Titolo:                 data.Titolo,
      Descrizione:            data.Descrizione,
      Email:                  data.Email,
      ...(phoneNum ? { phone_number: phoneNum } : {}),
      // Indirizzi — campo JSON: Strapi vuole un oggetto
      Indirizzo_spedizione:   wrapJson(data.Indirizzo_spedizione),
      Cap_spedizione:         data.Cap_spedizione,
      Citta_spedizione:       data.Citta_spedizione,
      Provincia_spedizione:   data.Provincia_spedizione,
      Indirizzo_consegna:     wrapJson(data.Indirizzo_consegna),
      Cap_consegna:           data.Cap_consegna,
      Citta_consegna:         data.Citta_consegna,
      Provincia_consegna:     data.Provincia_consegna,
      // Date
      Inizio_fascia_ritiro:   data.Inizio_fascia_ritiro || data.Inizio_Consegna,
      Fine_fascia_ritiro:     data.Fine_fascia_ritiro,
      Inizio_fascia_consegna: data.Inizio_fascia_consegna,
      Fine_fascia_consegna:   data.Fine_fascia_consegna,
      Fine_Consegna:          data.Fine_Consegna ?? data.Fine_fascia_consegna,
      // Fatturazione
      Codice_fiscale:         data.Codice_fiscale,
      Partita_IVA:            data.Partita_IVA,
      Ragione_Sociale:        data.Ragione_sociale ?? data.Ragione_Sociale,
      Codice_SDI:             data.Codice_SDI,
      PEC_Fatturazione:       data.PEC_Fatturazione,
    };

    // Rimuove undefined, null e stringhe vuote
    const clean = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );

    const response = await fetch("http://localhost:1337/api/consegnas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify({ data: clean }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData?.error?.message ?? `Errore HTTP ${response.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    // Non loggare dati sensibili
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    return { success: false, error: message };
  }
}
