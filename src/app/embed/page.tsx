import EmbedClient from '@/components/EmbedClient'
import { getSession } from '@/lib/getSession'
import React from 'react'

async function page() {
   const session=await getSession()

  return (
    <div>
      <EmbedClient ownerId={(session && typeof session === 'object' && 'id' in session ? (session.id as string) : "") || ""} />
    </div>
  )
}

export default page