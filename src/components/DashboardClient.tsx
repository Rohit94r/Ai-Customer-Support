'use client'
import React, { useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { CHAT_LANGUAGES, DEFAULT_CHAT_LANGUAGE, type ChatLanguageCode } from '@/lib/chatLanguages'
import { FREE_MONTHLY_QUESTION_LIMIT, usageStatus } from '@/lib/usage'

type DashboardTab = 'settings' | 'embed' | 'analytics'
type QuestionVariant = {
  question: string
  askedAt: string
}

type QuestionInsight = {
  _id?: string
  latestQuestion: string
  normalizedQuestion: string
  askedCount: number
  cacheHits: number
  responseLanguage: string
  lastAskedAt: string
  recentQuestions?: QuestionVariant[]
}

type AnalyticsSummary = {
  uniqueQuestions: number
  cachedResponsesServed: number
  repeatedQuestions: number
}

type PreviewMessage = { role: 'user' | 'bot'; text: string }

type ToastState = {
  type: 'success' | 'error' | 'info'
  message: string
} | null

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

function formatQuestionTimestamp(dateStr: string | null | undefined) {
  if (!dateStr) return 'No recent activity'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
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
  const [monthlyQuestions, setMonthlyQuestions] = React.useState(0)
  const [lastChatAt, setLastChatAt] = React.useState<string | null>(null)
  const [recentQuestions, setRecentQuestions] = React.useState<QuestionInsight[]>([])
  const [topQuestions, setTopQuestions] = React.useState<QuestionInsight[]>([])
  const [analyticsSummary, setAnalyticsSummary] = React.useState<AnalyticsSummary>({
    uniqueQuestions: 0,
    cachedResponsesServed: 0,
    repeatedQuestions: 0,
  })
  const [loading, setLoading] = React.useState(false)
  const [settingsLoaded, setSettingsLoaded] = React.useState(false)
  const [toast, setToast] = React.useState<ToastState>(null)
  const [embedCopied, setEmbedCopied] = React.useState(false)
  const [dismissedOnboarding, setDismissedOnboarding] = React.useState(false)

  const [aiBusinessName, setAiBusinessName] = React.useState("")
  const [aiBusinessType, setAiBusinessType] = React.useState("")
  const [aiWebsite, setAiWebsite] = React.useState("")
  const [aiPhone, setAiPhone] = React.useState("")
  const [aiProductsSummary, setAiProductsSummary] = React.useState("")
  const [aiGenerating, setAiGenerating] = React.useState(false)

  const [previewMessages, setPreviewMessages] = React.useState<PreviewMessage[]>([
    { role: 'bot', text: 'Hi! Ask me anything about your business to test the chatbot.' },
  ])
  const [previewInput, setPreviewInput] = React.useState('')
  const [previewLoading, setPreviewLoading] = React.useState(false)

  const scriptCode = useMemo(
    () => `<script 
  src="${appUrl}/chatBot.js"
  data-owner-id="${ownerId}">
</script>`,
    [appUrl, ownerId]
  )

  const usage = usageStatus(monthlyQuestions)
  const hasBusinessName = businessName.trim().length > 0
  const hasKnowledge = knowledge.trim().length > 40
  const hasSupportEmail = supportEmail.trim().length > 0
  const hasEmbedReady = hasBusinessName && hasKnowledge
  const hasLiveChat = totalQuestions > 0

  const onboardingSteps = [
    {
      id: 'business',
      label: 'Add business name & support email',
      done: hasBusinessName && hasSupportEmail,
      action: () => setActiveTab('settings'),
    },
    {
      id: 'knowledge',
      label: 'Add knowledge base (or generate with AI)',
      done: hasKnowledge,
      action: () => setActiveTab('settings'),
    },
    {
      id: 'embed',
      label: 'Copy embed code for your website',
      done: embedCopied || hasLiveChat,
      action: () => setActiveTab('embed'),
    },
    {
      id: 'test',
      label: 'Test your chatbot from the dashboard',
      done: previewMessages.some((m) => m.role === 'user') || hasLiveChat,
      action: () => setActiveTab('embed'),
    },
  ]
  const completedSteps = onboardingSteps.filter((step) => step.done).length
  const showOnboarding = settingsLoaded && !dismissedOnboarding && completedSteps < onboardingSteps.length

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 3500)
  }

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
      setMonthlyQuestions(settings.monthlyQuestions ?? 0)
      setLastChatAt(settings.lastChatAt ?? null)
      setAiBusinessName(settings.businessName || "")
    } catch {
      showToast('error', 'Could not load settings. Refresh and try again.')
    } finally {
      setSettingsLoaded(true)
    }
  }

  const loadAnalytics = async () => {
    try {
      const result = await axios.post('/api/chat/analytics', { ownerId })
      setRecentQuestions(result.data.recentQuestions || [])
      setTopQuestions(result.data.topQuestions || [])
      setAnalyticsSummary(
        result.data.summary || {
          uniqueQuestions: 0,
          cachedResponsesServed: 0,
          repeatedQuestions: 0,
        }
      )
    } catch {
      // Analytics can stay empty without blocking the dashboard
    }
  }

  useEffect(() => {
    if (ownerId) {
      loadSettings()
      loadAnalytics()
    }
  }, [ownerId])

  useEffect(() => {
    try {
      if (window.localStorage.getItem(`apna-onboarding-dismissed-${ownerId}`) === '1') {
        setDismissedOnboarding(true)
      }
    } catch {
      // ignore storage errors
    }
  }, [ownerId])

  const handleSettings = async () => {
    if (!businessName.trim()) {
      showToast('error', 'Business name is required before saving.')
      return
    }
    if (!knowledge.trim()) {
      showToast('error', 'Add a knowledge base so the chatbot can answer customers.')
      return
    }
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
      showToast('success', 'Settings saved. Your live chatbot will use these updates.')
      await Promise.all([loadSettings(), loadAnalytics()])
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Could not save settings. Please try again.'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTemplate = async () => {
    const name = aiBusinessName.trim() || businessName.trim()
    if (!name) {
      showToast('error', 'Enter a business name for AI generation.')
      return
    }
    setAiGenerating(true)
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
      showToast('success', 'AI template generated and saved to your knowledge base.')
      await loadSettings()
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Could not generate template. Please try again in a moment.'
      showToast('error', message)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode)
      setEmbedCopied(true)
      showToast('success', 'Embed code copied. Paste it before </body> on your site.')
      setTimeout(() => setEmbedCopied(false), 2000)
    } catch {
      showToast('error', 'Could not copy automatically. Select the code and copy manually.')
    }
  }

  const dismissOnboarding = () => {
    setDismissedOnboarding(true)
    try {
      window.localStorage.setItem(`apna-onboarding-dismissed-${ownerId}`, '1')
    } catch {
      // ignore
    }
  }

  const sendPreviewMessage = async () => {
    const text = previewInput.trim()
    if (!text || previewLoading) return

    if (!hasEmbedReady) {
      showToast('info', 'Save a business name and knowledge base first, then test here.')
      setActiveTab('settings')
      return
    }

    setPreviewMessages((current) => [...current, { role: 'user', text }])
    setPreviewInput('')
    setPreviewLoading(true)

    try {
      const result = await axios.post('/api/chat', {
        message: text,
        ownerId,
        language: defaultLanguage,
      })
      setPreviewMessages((current) => [
        ...current,
        { role: 'bot', text: result.data.text || result.data.message || 'No response' },
      ])
      await Promise.all([loadSettings(), loadAnalytics()])
    } catch (error) {
      const message =
        axios.isAxiosError(error) && (error.response?.data?.message || error.response?.data?.error)
          ? String(error.response.data.message || error.response.data.error)
          : 'Could not reach the chatbot. Try again in a moment.'
      setPreviewMessages((current) => [...current, { role: 'bot', text: message }])
    } finally {
      setPreviewLoading(false)
    }
  }

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: 'settings', label: 'Chatbot Settings' },
    { id: 'embed', label: 'Embed & Test' },
    { id: 'analytics', label: 'Chatbot Responses' },
  ]

  const usageBarClass =
    usage.tone === 'limit'
      ? 'bg-red-500'
      : usage.tone === 'warn'
        ? 'bg-amber-500'
        : 'bg-emerald-500'

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {toast && (
        <div
          className={`fixed top-20 right-4 z-[60] max-w-sm rounded-xl px-4 py-3 text-sm shadow-lg border ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-zinc-900 border-zinc-800 text-white'
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}

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
        <motion.div className="w-full max-w-3xl space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">
                  Free plan usage this month
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {monthlyQuestions.toLocaleString('en-IN')} / {FREE_MONTHLY_QUESTION_LIMIT.toLocaleString('en-IN')} questions
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {usage.tone === 'limit'
                    ? 'Monthly limit reached. Chat replies pause until next month.'
                    : usage.tone === 'warn'
                      ? `${usage.remaining} questions left this month.`
                      : `${usage.remaining} questions remaining on the free plan.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className="text-sm text-zinc-600 hover:text-zinc-900 underline"
              >
                View responses
              </button>
            </div>
            <div className="mt-4 h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usageBarClass}`}
                style={{ width: `${usage.percent}%` }}
              />
            </div>
          </div>

          {showOnboarding && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Get your chatbot live</h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    {completedSteps} of {onboardingSteps.length} steps done — finish these to start answering customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dismissOnboarding}
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  Dismiss
                </button>
              </div>
              <ol className="mt-5 space-y-3">
                {onboardingSteps.map((step, index) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={step.action}
                      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        step.done
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          step.done ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-600 border border-zinc-300'
                        }`}
                      >
                        {step.done ? '✓' : index + 1}
                      </span>
                      <span className={`text-sm ${step.done ? 'text-emerald-900' : 'text-zinc-800'}`}>
                        {step.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {activeTab === 'settings' && (
            <>
              <div className="mb-10">
                <h1 className="text-2xl font-semibold">Chatbot Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your AI chatbot knowledge and business details.</p>
              </div>

              {!hasBusinessName && !hasKnowledge && settingsLoaded && (
                <div className="mb-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5">
                  <p className="text-sm font-medium text-zinc-800">Your chatbot is empty</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Add a business name and knowledge base below, or generate a starter template with AI.
                  </p>
                </div>
              )}

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
                    <label className="block text-sm font-medium mb-2">Support Email</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                      placeholder="support@example.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                    <p className="mt-1.5 text-xs text-zinc-500">
                      Shown when the bot cannot answer — helps customers reach you.
                    </p>
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
                  {aiGenerating ? 'Generating with AI...' : 'Generate & Auto-Save Template'}
                </button>
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
                    <p className="mt-1.5 text-xs text-zinc-500">
                      {knowledge.trim().length.toLocaleString('en-IN')} characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Manual Template (Copy & Fill)</label>
                    <div className="w-full h-96 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-mono overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-zinc-700">{SAMPLE_TEMPLATE}</pre>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(SAMPLE_TEMPLATE)
                          showToast('success', 'Template copied. Paste it on the left and fill your details.')
                        } catch {
                          showToast('error', 'Could not copy template. Select and copy manually.')
                        }
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
                <button
                  type="button"
                  onClick={() => setActiveTab('embed')}
                  className="text-sm text-zinc-600 hover:text-zinc-900 underline"
                >
                  Next: embed & test →
                </button>
              </div>
            </>
          )}

          {activeTab === 'embed' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Embed & Test</h1>
                <p className="text-zinc-500 mt-1">
                  Copy this script and paste it before the closing <code className="text-xs bg-zinc-100 px-1 rounded">&lt;/body&gt;</code> tag, then test replies here before going live.
                </p>
              </div>

              {!hasEmbedReady && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Finish chatbot settings first (business name + knowledge).{' '}
                  <button type="button" className="underline font-medium" onClick={() => setActiveTab('settings')}>
                    Go to settings
                  </button>
                </div>
              )}

              <div className="bg-zinc-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto">
                <pre>{scriptCode}</pre>
              </div>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="mt-4 px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 text-sm font-medium"
              >
                {embedCopied ? 'Copied!' : 'Copy Embed Code'}
              </button>
              <p className="mt-6 text-sm text-zinc-500">
                Works on WordPress, Shopify, Wix, React, and plain HTML. Your chatbot uses owner ID:{' '}
                <span className="font-mono text-xs text-zinc-700">{ownerId}</span>
              </p>

              <div className="mt-10 rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="bg-zinc-900 text-white px-5 py-4">
                  <h2 className="text-base font-semibold">Live preview</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Sends real questions to your chatbot — same API your website widget uses.
                  </p>
                </div>
                <div className="h-72 overflow-y-auto bg-zinc-50 p-4 space-y-3">
                  {previewMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'ml-auto bg-zinc-900 text-white rounded-br-md'
                          : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-md'
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                  {previewLoading && (
                    <div className="w-fit rounded-2xl bg-white border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-500">
                      Thinking…
                    </div>
                  )}
                </div>
                <div className="border-t border-zinc-200 bg-white p-3 flex gap-2">
                  <input
                    type="text"
                    value={previewInput}
                    onChange={(e) => setPreviewInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        sendPreviewMessage()
                      }
                    }}
                    placeholder={hasEmbedReady ? 'Ask a test question…' : 'Save settings first to test'}
                    disabled={!hasEmbedReady || previewLoading}
                    className="flex-1 rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 disabled:bg-zinc-50"
                  />
                  <button
                    type="button"
                    onClick={sendPreviewMessage}
                    disabled={!hasEmbedReady || previewLoading || !previewInput.trim()}
                    className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Chatbot Responses</h1>
                <p className="text-zinc-500 mt-1">
                  Live stats, recent customer questions, and repeated-question trends from your embedded chatbot.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Total questions asked</p>
                  <p className="text-4xl font-semibold mt-2">{totalQuestions}</p>
                  <p className="text-xs text-zinc-500 mt-2">Every message a customer sends to your bot</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">This month (free plan)</p>
                  <p className="text-4xl font-semibold mt-2">{monthlyQuestions}</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    of {FREE_MONTHLY_QUESTION_LIMIT.toLocaleString('en-IN')} included questions
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Last customer chat</p>
                  <p className="text-2xl font-semibold mt-2">{formatLastChat(lastChatAt)}</p>
                  <p className="text-xs text-zinc-500 mt-2">Updates when someone uses your widget</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Unique questions cached</p>
                  <p className="text-4xl font-semibold mt-2">{analyticsSummary.uniqueQuestions}</p>
                  <p className="text-xs text-zinc-500 mt-2">Distinct normalized questions stored for this chatbot</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 p-6 bg-zinc-50">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Cached replies served</p>
                  <p className="text-4xl font-semibold mt-2">{analyticsSummary.cachedResponsesServed}</p>
                  <p className="text-xs text-zinc-500 mt-2">Repeat questions answered instantly from saved responses</p>
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
              <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Recent customer questions</h2>
                      <p className="text-sm text-zinc-500 mt-1">
                        Latest phrasing customers used, including repeated questions.
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                      {recentQuestions.length} tracked
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {recentQuestions.length ? recentQuestions.map((question) => (
                      <div key={`${question.normalizedQuestion}-${question.responseLanguage}`} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                            {question.responseLanguage}
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                            Asked {question.askedCount} time{question.askedCount > 1 ? 's' : ''}
                          </span>
                          {question.cacheHits > 0 && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                              Cache reused {question.cacheHits} time{question.cacheHits > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm font-medium text-zinc-900">{question.latestQuestion}</p>
                        <p className="mt-2 text-xs text-zinc-500">
                          Last seen {formatQuestionTimestamp(question.lastAskedAt)}
                        </p>
                        {question.recentQuestions && question.recentQuestions.length > 1 && (
                          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                              Recent variants
                            </p>
                            <div className="mt-2 space-y-2">
                              {question.recentQuestions.slice(0, 3).map((variant, index) => (
                                <div key={`${variant.question}-${index}`} className="text-xs text-zinc-600">
                                  <span className="font-medium text-zinc-800">{variant.question}</span>
                                  <span className="ml-2 text-zinc-400">{formatQuestionTimestamp(variant.askedAt)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center">
                        <p className="text-sm font-medium text-zinc-800">No customer questions yet</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Embed the widget or use Live preview to generate your first replies.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('embed')}
                          className="mt-4 text-sm font-medium text-zinc-900 underline"
                        >
                          Open Embed & Test
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <div>
                    <h2 className="text-lg font-semibold">Top repeated questions</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      Questions customers ask most often, useful for improving your knowledge base.
                    </p>
                  </div>
                  <div className="mt-5 space-y-3">
                    {topQuestions.length ? topQuestions.map((question, index) => (
                      <div key={`${question.normalizedQuestion}-${index}`} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-zinc-500">#{index + 1}</span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                            {question.askedCount} asks
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-medium text-zinc-900">{question.latestQuestion}</p>
                        <p className="mt-2 text-xs text-zinc-500">
                          Last seen {formatQuestionTimestamp(question.lastAskedAt)}
                        </p>
                      </div>
                    )) : (
                      <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                        Repeated questions will show here automatically after visitors start using the chatbot.
                      </p>
                    )}
                  </div>
                  <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 font-medium">Repeated question groups</p>
                    <p className="mt-2 text-2xl font-semibold text-zinc-900">{analyticsSummary.repeatedQuestions}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Count of cached question groups that have been asked more than once.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  loadSettings()
                  loadAnalytics()
                  showToast('info', 'Stats refreshed.')
                }}
                className="mt-6 text-sm text-zinc-600 hover:text-zinc-900 underline"
              >
                Refresh stats
              </button>
            </>
          )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient
