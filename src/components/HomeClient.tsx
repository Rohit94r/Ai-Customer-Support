"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";
import LiveChatDemo from "@/components/LiveChatDemo";
import SiteFooter from "@/components/SiteFooter";
import { ADMIN_EMAIL } from "@/lib/admin";
import { trackEvent } from "@/lib/track";

function HomeClient({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false)
  const isAdminUser =
    !!email && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleLogin = (ctaLabel = "login") => {
    trackEvent({ type: "cta_click", label: ctaLabel, path: "/" });
    setLoading(true)
    window.location.href = "/api/auth/login";
  };
  const firstLetter = email ? email[0].toUpperCase() : "";
  const [open, setOpen] = useState(false);
  const popupRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  useEffect(() => {
    trackEvent({ type: "page_view", path: "/", label: "home" });
  }, []);
  const navigate = useRouter()

  const openLiveChat = () => {
    trackEvent({ type: "cta_click", label: "try_live_demo", path: "/" });
    const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLElement | null;
    if (chatButton) chatButton.click();
  };
  const features = [
    {
      title: "100% Free — No Hidden Fees",
      desc: "Get a fully functional AI chatbot for your website without spending a dime. No credit card, no recurring costs."
    },
    {
      title: "Embed in Under 2 Minutes",
      desc: "Speed matters. Add our smart chatbot to any platform—WordPress, Shopify, Wix, or custom HTML—with a single line of code."
    },
    {
      title: "Trained on Your Data Only",
      desc: "Stop worrying about hallucinations. Upload your FAQs, pricing, and policies, and the AI will only answer based on your specific knowledge."
    },
    {
      title: "24/7 Instant Response",
      desc: "Don't keep your customers waiting. Provide instant, accurate answers even while you sleep, ensuring you never miss a lead."
    },
    {
      title: "Zero Coding Required",
      desc: "If you can copy and paste, you can set up ApnaAI. Our dashboard makes it easy for anyone to build a professional AI assistant."
    },
    {
      title: "Enterprise-Grade Performance",
      desc: "Powered by LLaMA 3.3 70B via Groq—delivering lightning-fast, natural-sounding conversations that actually help your users."
    },
  ]

  const industries = [
    { name: "Restaurants", detail: "Menus, hours, reservations" },
    { name: "Online Stores", detail: "Orders, returns, shipping" },
    { name: "Clinics", detail: "Appointments & services" },
    { name: "Coaching", detail: "Courses, fees, schedules" },
    { name: "Agencies", detail: "Services & lead capture" },
    { name: "Local Shops", detail: "Pricing & availability" },
  ]

  const testimonials = [
    {
      quote:
        "We used to miss dinner-rush messages every night. Now ApnaAI answers menu and timing questions while we cook — and it’s free, which mattered for our small kitchen.",
      name: "Priya Mehta",
      role: "Owner, Spice Route Café",
      industry: "Restaurant",
    },
    {
      quote:
        "Parents kept asking the same questions about batch timings and fees. I pasted one script and the bot handles it. Setup took less than five minutes.",
      name: "Ankit Sharma",
      role: "Founder, ScoreUp Coaching",
      industry: "Education",
    },
    {
      quote:
        "COD, return policy, and delivery timelines — same three questions all day. ApnaAI replies from our product info so our store doesn’t lose buyers after hours.",
      name: "Neha Kapoor",
      role: "Founder, Silk & Thread",
      industry: "Ecommerce",
    },
    {
      quote:
        "Patients call nonstop about clinic hours and whether we take walk-ins. The chat widget covers those basics so our reception desk can focus on appointments.",
      name: "Dr. Rahul Desai",
      role: "Clinic Director, CareFirst Health",
      industry: "Healthcare",
    },
  ]

  const faqs = [
    {
      q: "How do I add a chatbot to my website for free?",
      a: "Sign up on ApnaAI, fill in your business details, then copy the 1-line script tag and paste it before the </body> tag on your website. Your AI chatbot will be live instantly."
    },
    {
      q: "Is ApnaAI really free?",
      a: "Yes, ApnaAI is completely free to use. Sign up, configure your chatbot, and embed it on your website at no cost."
    },
    {
      q: "Does it work on WordPress, Shopify or any website?",
      a: "Yes. ApnaAI works on any website — WordPress, Shopify, Wix, plain HTML, or any other platform. Just paste the script tag."
    },
    {
      q: "How does the AI know about my business?",
      a: "You add your business information — products, pricing, FAQs, policies — in the dashboard. The AI uses only your knowledge base to answer customer questions."
    },
  ]
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200 "
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between ">
          <div className="text-lg font-semibold tracking-tight">
            Apna <span className="text-zinc-400">AI</span>
          </div>

          <div className="flex items-center gap-4">
          <a
            href="/blog"
            className="hidden sm:inline text-sm text-zinc-600 hover:text-zinc-900"
          >
            Blog
          </a>
          {email ? (
            <div className="relative" ref={popupRef}>
              <button
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                {firstLetter}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden"
                  >
                    <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100" onClick={() => navigate.push("/dashboard")}  >
                      Dashboard
                    </button>
                    {isAdminUser && (
                      <button
                        className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100"
                        onClick={() => navigate.push("/admin")}
                      >
                        Admin Analytics
                      </button>
                    )}
                    <a href="/api/auth/logout" className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-zinc-100">
                      Logout
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => handleLogin("nav_login")}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 flex item-center gap-2"

            >
              {loading ? "Loading...." : "Login"}
            </button>
          )}
          </div>
        </div>
      </motion.div>
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className=""
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Add a Free AI Chatbot to Your Website <br /> in 2 Minutes (No Coding)
            </h1>
            <p className="mt-6 text-lg text-zinc-600 max-w-xl leading-relaxed">
              Stop spending hours answering the same questions every day. ApnaAI lets you embed a smart, 24/7 AI-powered customer support bot that knows your business inside and out.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-zinc-500 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span>Trusted by 100+ small businesses</span>
            </div>
            <div className='mt-10 flex flex-wrap gap-4'>
              {email ?
                <button
                  className=" cursor-pointer px-7 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition shadow-lg shadow-black/10"
                  onClick={() => {
                    trackEvent({ type: "cta_click", label: "go_to_dashboard", path: "/" });
                    navigate.push("/dashboard");
                  }}
                >
                  Go to Dashboard
                </button> :
                <button
                  className="px-7 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition shadow-lg shadow-black/10"
                  onClick={() => handleLogin("get_started")}
                >
                  Get Started for Free
                </button>}
              <button 
                onClick={openLiveChat}
                className="px-7 py-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition font-medium" 
              >
                Try Live Demo
              </button>
            </div>
            <p className="mt-5 text-xs text-zinc-400">
              Free forever · No credit card · Works on any website
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <LiveChatDemo onOpenChat={openLiveChat} />
          </motion.div>
        </div>
      </section>

      {/* WHO USES APNAAI */}
      <section className="border-t border-zinc-200 bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400">
              Who uses ApnaAI
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              Built for small businesses that answer the same questions daily
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden">
            {industries.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white px-5 py-6 text-center"
              >
                <p className="font-semibold text-zinc-900 text-sm">{item.name}</p>
                <p className="mt-1.5 text-xs text-zinc-500 leading-snug">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold">How It Works</h2>
            <p className="mt-4 text-zinc-600">Get your AI chatbot live in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free ApnaAI account in seconds and access your dashboard." },
              { step: "02", title: "Add Your Info", desc: "Upload your business details, FAQs, and product info to train your AI assistant." },
              { step: "03", title: "Copy & Paste", desc: "Copy one script tag and paste it onto your site. Your bot is now live!" },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-white border border-zinc-200">
                <div className="text-4xl font-black text-zinc-200 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id='feature'
        className='bg-white py-28 px-6 border-t border-zinc-200'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.9 }}
            className='text-3xl font-semibold text-center'
          >
            Why Businesses Choose ApnaAI — Free Chatbot for Websites
          </motion.h2>
          <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-10'>
            {features.map((f, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: false }}
                className='bg-zinc-50 rounded-2xl p-8 border border-zinc-200'>
                <h3 className='font-semibold text-zinc-900'>{f.title}</h3>
                <p className='mt-3 text-zinc-600 text-sm'>{f.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-28 px-6 border-t border-zinc-200 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold">What small businesses say</h2>
            <p className="mt-4 text-zinc-600 max-w-xl mx-auto">
              Real use cases from restaurants, coaches, shops, and clinics using a free AI chatbot on their site.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="border-t border-zinc-300 pt-8"
              >
                <p className="text-zinc-700 leading-relaxed text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <cite className="not-italic font-semibold text-zinc-900 text-sm">{t.name}</cite>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-[11px] font-medium tracking-wide uppercase text-zinc-400 shrink-0">
                    {t.industry}
                  </span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className='py-28 px-6 bg-white border-t border-zinc-200'>
        <div className='max-w-3xl mx-auto'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className='text-3xl font-semibold text-center mb-4'
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-center text-zinc-500 text-sm mb-12 max-w-xl mx-auto">
            Everything you need to know before embedding ApnaAI on your website.
          </p>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
          <div className='space-y-6'>
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: false }}
                className='bg-zinc-50 rounded-2xl p-6 border border-zinc-200'
              >
                <h3 className='font-semibold text-zinc-900'>{f.q}</h3>
                <p className='mt-2 text-sm text-zinc-600'>{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-3xl md:text-4xl font-bold text-center text-zinc-900"
          >
            Industry guides & resources
          </motion.h2>
          <p className="mt-3 text-center text-zinc-500 text-sm mb-12 max-w-xl mx-auto">
            20+ practical guides to help you add a free AI chatbot to your website — built for Indian small businesses.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Chatbot for Restaurant Website", slug: "free-chatbot-for-restaurant-website" },
              { title: "Chatbot for Ecommerce Website", slug: "free-ai-chatbot-for-ecommerce-website" },
              { title: "Chatbot for Coaching Institute", slug: "chatbot-for-coaching-institute-website" },
              { title: "Chatbot for Clinic & Hospital", slug: "chatbot-for-hospital-clinic-website-india" },
              { title: "Chatbot for Real Estate Website", slug: "chatbot-for-real-estate-website-india" },
              { title: "Chatbot for Salon & Beauty Parlour", slug: "chatbot-for-salon-parlour-website-india" },
              { title: "Benefits of AI Chatbot for Business", slug: "benefits-ai-chatbot-small-business" },
              { title: "Free Live Chat Widget Comparison", slug: "free-live-chat-widget-website" },
              { title: "How to Add Free AI Chatbot", slug: "how-to-add-free-ai-chatbot-to-website" },
            ].map((post, i) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: false }}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left hover:border-zinc-400 hover:shadow-sm transition"
              >
                <p className="text-sm font-medium text-zinc-900">{post.title}</p>
                <p className="mt-1 text-xs text-zinc-500">Read guide →</p>
              </motion.a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              View all guides →
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Put an AI assistant on your site today
          </h2>
          <p className="text-zinc-400 text-lg mb-4">
            Join 100+ businesses using ApnaAI for instant answers, fewer missed leads, and support that never sleeps.
          </p>
          <p className="text-zinc-500 text-sm mb-10">
            Free · No credit card · Live in under 2 minutes · Works on WordPress, Shopify, Wix &amp; more
          </p>
          <button 
            onClick={() => {
              if (email) {
                trackEvent({ type: "cta_click", label: "footer_open_dashboard", path: "/" });
                navigate.push("/dashboard");
              } else {
                handleLogin("footer_get_started");
              }
            }}
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition shadow-xl"
          >
            {email ? "Open Dashboard" : "Get Started for Free"}
          </button>
          <p className="mt-6 text-sm text-zinc-500">
            Try the live demo above first — then embed it on your own site.
          </p>
        </div>
      </section>

      <SiteFooter />

    </div>
  );
}

export default HomeClient;
