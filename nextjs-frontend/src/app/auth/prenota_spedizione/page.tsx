import { verifySession } from "@/app/lib/dal";
import PrenotaSpedizioneForm from "./PrenotaSpedizioneForm";

export default async function Page() {
  const { session } = await verifySession();
  const user = (session as any)?.user;
  const jwt = (session as any)?.jwt ?? "";

  return (
    <PrenotaSpedizioneForm
      nome={user?.nome ?? ""}
      cognome={user?.cognome ?? ""}
      email={user?.email ?? ""}
      tipo_cliente={user?.tipo_cliente ?? "privato"}
      Ragione_sociale={user?.Ragione_sociale ?? ""}
      Partita_IVA={user?.Partita_IVA ?? ""}
      Codice_SDI={user?.Codice_SDI ?? ""}
      PEC_Fatturazione={user?.PEC_Fatturazione ?? ""}
      Indirizzo_sede_legale={user?.Indirizzo_sede_legale ?? ""}
      jwt={jwt}
    />
  );
}
