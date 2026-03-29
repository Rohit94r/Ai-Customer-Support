'use client'
import React, { useState } from 'react'

export default function EmbedClient({ ownerId }: { ownerId: string }) {
  const [copied, setCopied] = useState(false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const scriptCode = `<script 
  src="${appUrl}/chatBot.js"
  data-owner-id="${ownerId}">
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Embed Chatbot</h1>
        <p className="text-zinc-600 mb-6">Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag:</p>
        
        <div className="bg-zinc-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{scriptCode}</pre>
        </div>
        
        <button
          onClick={handleCopy}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-zinc-800"
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </div>
    </div>
  )
}
