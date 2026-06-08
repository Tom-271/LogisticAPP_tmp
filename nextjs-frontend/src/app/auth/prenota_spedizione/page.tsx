import { verifySession } from "@/app/lib/dal";
import PrenotaSpedizioneForm from "./PrenotaSpedizioneForm";

export default async function Page() {
  const { session } = await verifySession();
  const user = (session as any)?.user;

  return (
    <PrenotaSpedizioneForm
      nome={user?.nome ?? ""}
      cognome={user?.cognome ?? ""}
      email={user?.email ?? ""}
    />
  );
}
