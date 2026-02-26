import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/getSession";
import { sync } from "motion";
import Image from "next/image";
import { redirect } from "next/navigation";


export default async function Home() {
 const session= await getSession()

 if(!session){
  redirect('/api/auth/login')
 }

  return (
   <>
  <HomeClient email={session.user?.email!} />
   </>
  );
}
