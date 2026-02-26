'use client'
import { navigate } from 'next/dist/client/components/segment-cache/navigation'
import { useRouter } from 'next/router'
import React from 'react'

function EmbedClient({ownerId}:{ownerId:string}) {
   const navigate=useRouter()
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
         <div className="text-lg font-semibold cursor-pointer" onClick={()=>navigate.push("/")}>Support <span className="text-zinc-400">AI</span></div>
         <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={() => navigate.push("/dashboard")}>Back to Dashboard</button>

      </div>

    </div>
  )
}

export default EmbedClient