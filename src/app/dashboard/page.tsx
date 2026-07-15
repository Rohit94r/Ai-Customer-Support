import type { Metadata } from "next";
import DashboardClient from '@/components/DashboardClient'
import { isAdmin } from '@/lib/admin'
import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function page (){
  const session=await getSession()

  if(!session){
    redirect('/api/auth/login')
  }

  return(
    <>
      <DashboardClient
        ownerId={session?.user?.id as string}
        isAdminUser={isAdmin(session)}
      />
    </>
  )
}

export default page
