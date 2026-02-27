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
            <textarea
              className='w-full h-80 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 font-mono text-xs'
              placeholder={`BUSINESS: ABC Electronics
WEBSITE: www.abc-electronics.com
CONTACT: support@abc-electronics.com | WhatsApp: +91-9876543210

PRODUCTS:
- Smartphones: iPhone 15 (₹79,999), Samsung S24 (₹74,999), OnePlus 12 (₹62,999)
- Laptops: Dell XPS, HP Pavilion, MacBook Air
- Accessories: Chargers, Cases, Screen Protectors

PRICING & OFFERS:
- All prices are inclusive of GST
- Student Discount: 10% on valid student ID
- Bulk Orders: 15% discount for orders above 50 units
- Festival Offer: 20% off on selected items (Valid till 31st March)
- Seasonal Sales: Every month new offers

SHIPPING & DELIVERY:
- Delivery Time: 2-3 days (Metro cities), 5-7 days (Others)
- Shipping Cost: Free on orders above ₹1000
- Shipping Cost: ₹50 on orders below ₹1000
- COD Available: Yes, in all areas
- International Shipping: Not available currently

RETURN & REFUND POLICY:
- Return Window: 7 days from delivery
- Condition: Product must be unopened and in original packaging
- Refund Process: 3-5 business days after approval
- Damaged Products: Full refund or replacement within 24 hours
- Non-returnable Items: Opened software, digital products

PAYMENT METHODS:
- Credit Card, Debit Card, Net Banking
- UPI: Google Pay, PhonePe, Paytm
- Wallet: Amazon Pay, Airtel Money
- EMI: Available on purchases above ₹10,000
- Cash on Delivery: Available

WARRANTY & SUPPORT:
- Manufacturer Warranty: Included with all products
- Extended Warranty: Available for ₹999-₹2999
- Technical Support: 24/7 via email and phone
- Support Hours: Monday-Friday 9AM-6PM, Saturday 10AM-4PM
- No support on Sundays and public holidays

BUSINESS HOURS:
- Monday-Friday: 9:00 AM - 6:00 PM IST
- Saturday: 10:00 AM - 4:00 PM IST
- Sunday: Closed
- Holidays: National holidays closed

FAQ:
Q: How can I track my order?
A: You'll receive a tracking link via email and SMS after dispatch

Q: Can I cancel my order?
A: Orders can be cancelled within 2 hours of placement

Q: Are prices negotiable for bulk orders?
A: Yes, please contact sales@abc-electronics.com for bulk pricing`}
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
            <p className='text-xs text-zinc-500 mt-2'>Be detailed and specific. The more accurate information you provide, the better answers your chatbot will give. Include pricing, policies, delivery times, contact details, FAQs, and any other relevant business information.</p>
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
