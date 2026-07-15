'use client'
import React, { useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { CHAT_LANGUAGES, DEFAULT_CHAT_LANGUAGE, type ChatLanguageCode } from '@/lib/chatLanguages'

type DashboardTab = 'settings' | 'embed' | 'analytics'

const SAMPLE_TEMPLATE = `BUSINESS: __________ [Your Shop Name]
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
Sunday: __________`

function formatLastChat(dateStr: string | null | undefined) {
  if (!dateStr) return 'No chats yet'
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function DashboardClient({
  ownerId,
  isAdminUser = false,
}: {
  ownerId: string
  isAdminUser?: boolean
}) {
  const navigate = useRouter()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('settings')
  const [businessName, setBusinessName] = React.useState("")
  const [supportEmail, setSupportEmail] = React.useState("")
  const [knowledge, setKnowledge] = React.useState("")
  const [defaultLanguage, setDefaultLanguage] = React.useState<ChatLanguageCode>(DEFAULT_CHAT_LANGUAGE)
  const [supportedLanguages, setSupportedLanguages] = React.useState<ChatLanguageCode[]>(
    CHAT_LANGUAGES.map((language) => language.code)
  )
  const [totalQuestions, setTotalQuestions] = React.useState(0)
  const [lastChatAt, setLastChatAt] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [embedCopied, setEmbedCopied] = React.useState(false)

  const [aiBusinessName, setAiBusinessName] = React.useState("")
  const [aiBusinessType, setAiBusinessType] = React.useState("")
  const [aiWebsite, setAiWebsite] = React.useState("")
  const [aiPhone, setAiPhone] = React.useState("")
  const [aiProductsSummary, setAiProductsSummary] = React.useState("")
  const [aiGenerating, setAiGenerating] = React.useState(false)
  const [aiMessage, setAiMessage] = React.useState("")

  const scriptCode = useMemo(
    () => `<script 
  src="${appUrl}/chatBot.js"
  data-owner-id="${ownerId}">
</script>`,
    [appUrl, ownerId]
  )

  const toggleLanguage = (languageCode: ChatLanguageCode) => {
    setSupportedLanguages((currentLanguages) => {
      const exists = currentLanguages.includes(languageCode)
      if (exists) {
        const nextLanguages = currentLanguages.filter((code) => code !== languageCode)
        if (!nextLanguages.length) return currentLanguages
        if (!nextLanguages.includes(defaultLanguage)) {
          setDefaultLanguage(nextLanguages[0])
        }
        return nextLanguages
      }
      return [...currentLanguages, languageCode]
    })
  }

  const loadSettings = async () => {
    try {
      const result = await axios.post('/api/settings/get', { ownerId })
      const settings = result.data || {}
      setBusinessName(settings.businessName || "")
      setSupportEmail(settings.supportEmail || "")
      setKnowledge(settings.knowledge || "")
      setDefaultLanguage((settings.defaultLanguage || DEFAULT_CHAT_LANGUAGE) as ChatLanguageCode)
      setSupportedLanguages(
        Array.isArray(settings.supportedLanguages) && settings.supportedLanguages.length
          ? settings.supportedLanguages
          : CHAT_LANGUAGES.map((language) => language.code)
      )
      setTotalQuestions(settings.totalQuestions ?? 0)
      setLastChatAt(settings.lastChatAt ?? null)
      setAiBusinessName(settings.businessName || "")
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    if (ownerId) loadSettings()
  }, [ownerId])

  const handleSettings = async () => {
    setLoading(true)
    try {
      await axios.post('/api/settings', {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
        defaultLanguage,
        supportedLanguages,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      await loadSettings()
    } catch (error) {
      console.log('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTemplate = async () => {
    const name = aiBusinessName.trim() || businessName.trim()
    if (!name) {
      setAiMessage('Please enter a business name for AI generation.')
      return
    }
    setAiGenerating(true)
    setAiMessage('')
    try {
      const result = await axios.post('/api/generate-template', {
        ownerId,
        businessName: name,
        businessType: aiBusinessType,
        website: aiWebsite,
        supportEmail: supportEmail || aiWebsite,
        phone: aiPhone,
        productsSummary: aiProductsSummary,
        autoSave: true,
        defaultLanguage,
        supportedLanguages,
      })
      const generated = result.data.knowledge || ''
      setKnowledge(generated)
      if (!businessName.trim()) setBusinessName(name)
      setAiMessage('AI template generated and saved to your knowledge base.')
      await loadSettings()
    } catch {
      setAiMessage('Could not generate template. Please try again in a moment.')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(scriptCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'settings', label: 'Chatbot Settings' },
    { id: 'embed', label: 'Embed Chatbot' },
    { id: 'analytics', label: 'Chatbot Responses' },
  ]

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
          <div className="flex items-center gap-4">
            {isAdminUser && (
              <button
                type="button"
                onClick={() => navigate.push('/admin')}
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                Admin Analytics
              </button>
            )}
            <a href="/api/auth/logout" className="text-sm text-zinc-600 hover:text-zinc-900">
              Logout
            </a>
          </div>
        </div>
      </motion.div>

      <div className="fixed top-16 left-0 w-full z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto py-2" aria-label="Dashboard sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {isAdminUser && (
              <button
                key="admin"
                type="button"
                onClick={() => navigate.push('/admin')}
                className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap text-zinc-600 hover:bg-zinc-100 border border-dashed border-zinc-300"
              >
                Platform Admin
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="flex justify-center px-4 py-14 pt-36">
        <motion.div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {activeTab === 'settings' && (
            <>
              <div className="mb-10">
                <h1 className="text-2xl font-semibold">Chatbot Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your AI chatbot knowledge and business details.</p>
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-medium mb-4">Business Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                      placeholder="e.g., ABC Electronics, Fashion Store, Restaurant Name"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value)
                        setAiBusinessName(e.target.value)
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Support Email *</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                      placeholder="support@example.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <h2 className="text-lg font-medium mb-1">Generate Template via AI</h2>
                <p className="text-sm text-zinc-500 mb-4">
                  No time to fill the full template? Add basic info — AI will create your knowledge base and save it automatically.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Business name *</label>
                    <input
                      type="text"
                      value={aiBusinessName}
                      onChange={(e) => setAiBusinessName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm bg-white"
                      placeholder="My Store"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Business type</label>
                    <input
                      type="text"
                      value={aiBusinessType}
                      onChange={(e) => setAiBusinessType(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm bg-white"
                      placeholder="E-commerce, Restaurant, SaaS..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Website</label>
                    <input
                      type="url"
                      value={aiWebsite}
                      onChange={(e) => setAiWebsite(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm bg-white"
                      placeholder="https://yoursite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={aiPhone}
                      onChange={(e) => setAiPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm bg-white"
                      placeholder="+91..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium mb-1.5">Products or services (short)</label>
                  <textarea
                    value={aiProductsSummary}
                    onChange={(e) => setAiProductsSummary(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm bg-white h-20 resize-none"
                    placeholder="What do you sell? Key prices, offers, delivery areas..."
                  />
                </div>
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleGenerateTemplate}
                  className="mt-4 w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-60"
                >
                  {aiGenerating ? 'Generating with AI...' : '✨ Generate & Auto-Save Template'}
                </button>
                {aiMessage && (
                  <p className={`mt-3 text-sm ${aiMessage.includes('saved') ? 'text-emerald-600' : 'text-amber-700'}`}>
                    {aiMessage}
                  </p>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-medium mb-4">Knowledge Base</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Business Information</label>
                    <textarea
                      className="w-full h-96 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 font-mono resize-none"
                      placeholder="Paste your business info here..."
                      value={knowledge}
                      onChange={(e) => setKnowledge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Manual Template (Copy & Fill)</label>
                    <div className="w-full h-96 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-mono overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-zinc-700">{SAMPLE_TEMPLATE}</pre>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(SAMPLE_TEMPLATE)
                        alert('Template copied! Paste it in the left field and fill your details.')
                      }}
                      className="mt-2 w-full px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-zinc-800 transition font-medium"
                    >
                      Copy Manual Template
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-lg font-medium mb-4">Voice & Language Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {CHAT_LANGUAGES.map((language) => {
                    const checked = supportedLanguages.includes(language.code)
                    return (
                      <label
                        key={language.code}
                        className={`rounded-xl border px-4 py-3 flex items-start gap-3 transition ${
                          checked ? 'border-black bg-zinc-50' : 'border-zinc-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={checked}
                          onChange={() => toggleLanguage(language.code)}
                        />
                        <div>
                          <div className="text-sm font-medium">{language.label}</div>
                          <div className="text-xs text-zinc-500">{language.nativeLabel}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value as ChatLanguageCode)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                >
                  {CHAT_LANGUAGES.filter((language) => supportedLanguages.includes(language.code)).map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.label} ({language.nativeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  onClick={handleSettings}
                  className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </motion.button>
                {saved && (
                  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-emerald-600">
                    Settings Saved
                  </motion.span>
                )}
              </div>
            </>
          )}

          {activeTab === 'embed' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Embed Chatbot</h1>
                <p className="text-zinc-500 mt-1">
                  Copy this script and paste it before the closing <code className="text-xs bg-zinc-100 px-1 rounded">&lt;/body&gt;</code> tag on your website.
                </p>
              </div>
              <div className="bg-zinc-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto">
                <pre>{scriptCode}</pre>
              </div>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="mt-4 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 text-sm font-medium"
              >
                {embedCopied ? '✓ Copied!' : 'Copy Embed Code'}
              </button>
              <p className="mt-6 text-sm text-zinc-500">
                Works on WordPress, Shopify, Wix, React, and plain HTML. Your chatbot uses owner ID:{' '}
                <span className="font-mono text-xs text-zinc-700">{ownerId}</span>
              </p>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Chatbot Responses</h1>
                <p className="text-zinc-500 mt-1">
                  Live stats from visitors using your embedded chatbot.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Total questions asked</p>
                  <p className="text-4xl font-semibold mt-2">{totalQuestions}</p>
                  <p className="text-xs text-zinc-500 mt-2">Every message a customer sends to your bot</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Last customer chat</p>
                  <p className="text-2xl font-semibold mt-2">{formatLastChat(lastChatAt)}</p>
                  <p className="text-xs text-zinc-500 mt-2">Updates when someone uses your widget</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Your chatbot</p>
                  <p className="text-lg font-semibold mt-2">{businessName || 'Not configured yet'}</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {knowledge.trim().length > 50
                      ? 'Knowledge base is active — bot can answer from your data.'
                      : 'Add knowledge in Chatbot Settings so the bot can answer accurately.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadSettings}
                className="mt-6 text-sm text-zinc-600 hover:text-zinc-900 underline"
              >
                Refresh stats
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient
