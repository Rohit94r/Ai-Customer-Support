
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";

function HomeClient({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false)


  const handleLogin = () => {
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
  const navigate = useRouter()
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
                    <a href="/api/auth/logout" className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-zinc-100">
                      Logout
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 flex item-center gap-2"

            >
              {loading ? "Loading...." : "Login"}
            </button>
          )}
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
              <span>Trusted by 100+ businesses</span>
            </div>
            <div className='mt-10 flex flex-wrap gap-4'>
              {email ?
                <button className=" cursor-pointer px-7 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition shadow-lg shadow-black/10" onClick={() => navigate.push("/dashboard")}>
                  Go to Dashboard
                </button> :
                <button className="px-7 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition shadow-lg shadow-black/10" onClick={handleLogin}>
                  Get Started for Free
                </button>}
              <button 
                onClick={() => {
                  const chatButton = Array.from(document.querySelectorAll('div')).find(el => el.innerHTML === '💬');
                  if (chatButton) (chatButton as HTMLElement).click();
                }}
                className="px-7 py-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition font-medium" 
              >
                Try Live Demo
              </button>
            </div>
          </motion.div>


          {/* RIGHT DEV */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl bg-white shadow-2xl border border-zinc-200 p-6">
              <div className="text-sm text-zinc-500 mb-3">Live Chat Preview</div>
              <div className="space-y-4">
                <div className="bg-black text-white rounded-lg px-4 py-2 text-sm ml-auto w-fit">Do you offer cash on delivery?</div>
                <div className='bg-zinc-100 rounded-lg px-4 py-2 text-sm w-fit'>Yes, Cash on Delivery is available for all orders above ₹500.</div>
                <div className="bg-black text-white rounded-lg px-4 py-2 text-sm ml-auto w-fit italic text-xs opacity-80">(AI response is instant)</div>
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition"
                onClick={() => {
                  const chatButton = Array.from(document.querySelectorAll('div')).find(el => el.innerHTML === '💬');
                  if (chatButton) (chatButton as HTMLElement).click();
                }}
              >
                💬
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-t border-zinc-200 bg-white">
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
              <div key={i} className="relative p-8 rounded-2xl bg-zinc-50 border border-zinc-200">
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
        className='bg-zinc-50 py-28 px-6 border-t border-zinc-200'
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
                className='bg-white rounded-2xl p-8 shadow-lg border border-zinc-200'>
                <h3 className='font-semibold text-zinc-900'>{f.title}</h3>
                <p className='mt-3 text-zinc-600 text-sm'>{f.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </section>
      {/* FAQ */}
      <section className='py-28 px-6'>
        <div className='max-w-3xl mx-auto'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className='text-3xl font-semibold text-center mb-12'
          >
            Frequently Asked Questions
          </motion.h2>
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

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Ready to automate your customer support?</h2>
          <p className="text-zinc-400 text-lg mb-10">Join 100+ businesses using ApnaAI to provide instant support and close more sales.</p>
          <button 
            onClick={handleLogin}
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition shadow-xl"
          >
            Get Started for Free Now
          </button>
          <p className="mt-6 text-sm text-zinc-500 italic">No credit card required. Live in 2 minutes.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='py-10 text-center text-sm text-zinc-500'>
        &copy; {new Date().getFullYear()} ApnaAI. All rights reserved. &mdash; Free AI Chatbot for Websites
      </footer>

    </div>
  );
}

export default HomeClient;
