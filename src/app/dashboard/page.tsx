import DashboardClient from '@/components/DashboardClient'
import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

async function page (){
  const session=await getSession()

  if(!session){
    redirect('/api/auth/login')
  }

  return(
    <>
      <DashboardClient ownerId={session?.user?.id as string}/>
    </>
  )
}

export default page