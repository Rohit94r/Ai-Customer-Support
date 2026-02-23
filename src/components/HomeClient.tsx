'use client'
import React, { useEffect, useState } from 'react'

import { AnimatePresence, motion } from "motion/react"

function HomeClient({ email }: { email: string }) {
  const handleLogin = () => {
    window.location.href = "/api/auth/login"
  }
  const firstLetter = email ? email[0].toUpperCase() : ""
  const [open, setOpen] = useState(false)
  const popupRef = React.useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const handler=(e:MouseEvent)=>{
      if(popupRef.current && !popupRef.current.contains(e.target as Node))
        setOpen(false)
      
    }
    document.addEventListener("mousedown",handler)
    return () => {     
      document.removeEventListener("mousedown",handler)
    }
  },[])
  return (
    <div className='min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200 '>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between '>
          <div className='text-lg font-semibold tracking-tight'>Support <span className='text-zinc-400'>Ai</span></div>

          {email ? <div className='relative' ref={popupRef} >
            <button className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:scale-105 transition' onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>{firstLetter}</button>

            <AnimatePresence>
            {open && (
              <motion.div 
              initial = {{ opacity: 0, y: -6 }}
              animate={{opacity: 1, y: 0 }}
              exit={{opacity:0, y: -6}}
              className='absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden'>
              <button className='w-full text-left px-4 py-3 text-sm hover:bg-zinc-100'>Dashboard</button>
              <button className='block px-4 py-3 text-sm text-red-600 hover:bg-zinc-100'>Logout</button>
                       </motion.div>)}
                       </AnimatePresence>



          </div> :
            <button onClick={handleLogin} className='px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 flex item-center gap-2'>Login</button>}

        </div>
      </motion.div>
    <section className='pt-36 pb-28 px-6'>
     <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center'>
       <motion.div
       initial={{ opacity: 0, x: -40 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.7 }}
       className=''>
        <h1 className='text-4xl md:text-5xl font-semibold tracking-tight'>
          AI Customer Support <br /> Build for Modern Websites
        </h1>
        <p className='mt-6 text-lg text-zinc-600 max-w-xl '>
          Add a powerfull AI Chatbot to your website in minutes. Our AI Customer Support is designed to provide instant and accurate responses to your customers, improving their experience and boosting your business. With easy integration and customizable features, you can have your AI support up and running in no time.
        </p>

       </motion.div>
       <div>

       </div>

     </div>
    </section>
    </div>
  )
}

export default HomeClient