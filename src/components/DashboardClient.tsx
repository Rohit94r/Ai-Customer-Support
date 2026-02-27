'use client'
import React, { useEffect } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

function DashboardClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter()
  const [businessName, setBusinessName] = React.useState("")
  const [supportEmail, setSupportEmail] = React.useState("")
  const [knowledge, setKnowledge] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const handleSettings = async () => {
    setLoading(true)
    try {
      const result = await axios.post('/api/settings', { ownerId, businessName, supportEmail, knowledge })
      console.log('Saved:', result.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setLoading(false)
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(ownerId) {
      const handleGetDetails=async ()=>{
     try {
      const result = await axios.post('/api/settings/get', { ownerId})
     setBusinessName(result.data.businessName)
     setSupportEmail(result.data.supportEmail)
     setKnowledge(result.data.knowledge)

    
    } catch (error) {
      console.log('Error:', error)
      
    }
  }
  handleGetDetails()
}
  }, [ownerId])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-lg font-semibold tracking-tight cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            Apna <span className="text-zinc-400">AI</span>
          </div>
          <button className='px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={() => navigate.push("/embed")}>
            Embed ChatBot
          </button>
        </div>
      </motion.div>
      <div className='flex justify-center px-4 py-14 mt-21'>
        <motion.div className='w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10'>
          <div className='mb-10'>
            <h1 className='text-2xl font-semibold'>ChatBot Setting</h1>
            <p className='text-zinc-500 mt-1'>Manage your AI chatbot knowledge and business details.</p>
          </div>
          <div className='mb-10'>
            <h1 className='text-lg font-medium mb-4'>Business Details</h1>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Business Name *</label>
                <input 
                  type="text" 
                  className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' 
                  placeholder='e.g., ABC Electronics, Fashion Store, Restaurant Name' 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                />
                <p className='text-xs text-zinc-500 mt-2'>Your company or business name - displayed in chatbot header</p>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Support Email *</label>
                <input 
                  type="email" 
                  className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' 
                  placeholder='support@example.com' 
                  value={supportEmail} 
                  onChange={(e) => setSupportEmail(e.target.value)} 
                />
                <p className='text-xs text-zinc-500 mt-2'>Used as fallback when chatbot cannot answer a question</p>
              </div>
            </div>
          </div>

          <div className='mb-10'>
            <h1 className='text-lg font-medium mb-4'>Knowledge Base</h1>
            <p className='text-sm text-zinc-500 mb-4'>Add all information the AI should know about your business. The chatbot will use this to answer customer questions.</p>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Input Section */}
              <div>
                <label className='block text-sm font-medium mb-2'>Your Business Information</label>
                <textarea
                  className='w-full h-96 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 font-mono text-xs resize-none'
                  placeholder='Paste your business info here...'
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                />
                <p className='text-xs text-zinc-500 mt-2'>💡 Tip: Copy the sample from the right side and customize it with your business details</p>
              </div>

              {/* Sample Data Section */}
              <div>
                <label className='block text-sm font-medium mb-2'>📋 Sample Template (Copy & Fill Blanks)</label>
                <div className='w-full h-96 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-mono overflow-y-auto'>
                  <pre className='whitespace-pre-wrap text-xs text-zinc-700'>{`BUSINESS: __________ [Your Shop Name]
WEBSITE: __________ [Your Website URL]
CONTACT: __________ [Email] | WhatsApp: __________

PRODUCTS & SERVICES:
- Product 1: __________ (₹ __________)
- Product 2: __________ (₹ __________)
- Service: __________

PRICING & OFFERS:
- __________ Discount: __% on __________
- Bulk Orders: __% discount for __ units
- Special Offer: __________ (Valid till __)
- Seasonal Sales: __________

SHIPPING & DELIVERY:
- Delivery Time: __ days (Metro), __ days (Others)
- Free Shipping: On orders above ₹__________
- Shipping Cost: ₹__________ (below minimum)
- COD Available: Yes/No
- Delivery Areas: __________

RETURN & REFUND:
- Return Window: __ days from delivery
- Condition: __________
- Refund Time: __________ days
- Non-returnable: __________

PAYMENT METHODS:
- Credit/Debit Card: Yes
- UPI Apps: __________ (Google Pay, PhonePe, etc)
- Wallet: __________
- EMI Available: On orders above ₹__________
- COD: __________

SUPPORT & WARRANTY:
- Support Email: __________
- Support Phone: __________
- Support Hours: __________ IST
- Warranty: __________

FAQ:
Q: __________?
A: __________

Q: __________?
A: __________

BUSINESS HOURS:
Monday-Friday: __ AM - __ PM
Saturday: __ AM - __ PM
Sunday: __________`}</pre>
                </div>
                <button 
                  onClick={() => {
                    const sampleText = `BUSINESS: __________ [Your Shop Name]
WEBSITE: __________ [Your Website URL]
CONTACT: __________ [Email] | WhatsApp: __________

PRODUCTS & SERVICES:
- Product 1: __________ (₹ __________)
- Product 2: __________ (₹ __________)
- Service: __________

PRICING & OFFERS:
- __________ Discount: __% on __________
- Bulk Orders: __% discount for __ units
- Special Offer: __________ (Valid till __)
- Seasonal Sales: __________

SHIPPING & DELIVERY:
- Delivery Time: __ days (Metro), __ days (Others)
- Free Shipping: On orders above ₹__________
- Shipping Cost: ₹__________ (below minimum)
- COD Available: Yes/No
- Delivery Areas: __________

RETURN & REFUND:
- Return Window: __ days from delivery
- Condition: __________
- Refund Time: __________ days
- Non-returnable: __________

PAYMENT METHODS:
- Credit/Debit Card: Yes
- UPI Apps: __________ (Google Pay, PhonePe, etc)
- Wallet: __________
- EMI Available: On orders above ₹__________
- COD: __________

SUPPORT & WARRANTY:
- Support Email: __________
- Support Phone: __________
- Support Hours: __________ IST
- Warranty: __________

FAQ:
Q: __________?
A: __________

Q: __________?
A: __________

BUSINESS HOURS:
Monday-Friday: __ AM - __ PM
Saturday: __ AM - __ PM
Sunday: __________`;
                    navigator.clipboard.writeText(sampleText);
                    alert('Template copied! Now paste it in the left field and fill in your details.');
                  }}
                  className='mt-2 w-full px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-zinc-800 transition font-medium'
                >
                  📋 Copy Template & Paste Left
                </button>
              </div>
            </div>
            
            <p className='text-xs text-zinc-500 mt-4'>📌 Instructions: Copy the template from right, paste in left field, replace blanks (________) with your actual business information. More details = Better AI responses!</p>
          </div>
          <div className='flex items-center gap-5'>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={handleSettings}
              className='px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60'
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>
            {saved && <motion.span
              initial={{ opacity: 0, y:6 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-sm font-medium text-emerald-600'
            >
              Settings Saved
            </motion.span>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient
