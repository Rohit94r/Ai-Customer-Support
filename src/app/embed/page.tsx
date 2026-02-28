import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import EmbedClient from "@/components/EmbedClient";

export default async function EmbedPage() {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect("/");
  }

  const ownerId = session.user.id;

  return <EmbedClient ownerId={ownerId} />;
}
