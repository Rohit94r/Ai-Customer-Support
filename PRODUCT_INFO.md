# 📘 Apna AI — Product Info & How It Works

## 🧠 What is Apna AI?

Apna AI is a SaaS platform that allows any business to deploy an AI-powered customer support chatbot on their website — without writing a single line of backend code. Business owners sign up, configure their chatbot with their own business knowledge, and embed it on their site using one script tag.

The chatbot uses **Groq's LLaMA 3.3 70B model** — one of the fastest and most capable open-source AI models — to answer customer questions in real time based on the business's custom knowledge base.

---

## 🔄 How It Works — Step by Step

```
Customer visits website
        ↓
Clicks 💬 chat button (injected by chatBot.js)
        ↓
Types a question
        ↓
chatBot.js sends POST /api/chat with { message, ownerId }
        ↓
API fetches business settings from MongoDB using ownerId
        ↓
Builds a prompt with business knowledge + customer question
        ↓
Sends prompt to Groq AI (LLaMA 3.3 70B)
        ↓
Returns AI response back to the chat widget
        ↓
Customer sees the answer instantly
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Customer's Website                  │
│                                                     │
│   <script src="chatBot.js" data-owner-id="...">     │
│                     ↓                               │
│            Floating Chat Widget (UI)                │
└─────────────────────┬───────────────────────────────┘
                      │ POST /api/chat
                      ↓
┌─────────────────────────────────────────────────────┐
│              Apna AI (Next.js on Vercel)             │
│                                                     │
│   /api/chat                                         │
│      → Fetch settings from MongoDB                  │
│      → Build AI prompt                              │
│      → Call Groq API                                │
│      → Return response                              │
└──────────┬──────────────────────┬───────────────────┘
           ↓                      ↓
    ┌─────────────┐       ┌──────────────┐
    │   MongoDB   │       │   Groq API   │
    │  (Settings) │       │ LLaMA 3.3 70B│
    └─────────────┘       └──────────────┘
```

---

## 🧩 Core Components

### 1. `chatBot.js` (Public Widget)
- A self-contained JavaScript file served from `/public/chatBot.js`
- Injected into any website via a `<script>` tag
- Creates a floating chat button and chat window in the bottom-right corner
- Reads `data-owner-id` from the script tag to identify the business
- Sends messages to `/api/chat` and displays AI responses
- No dependencies — works on any website

### 2. `/api/chat` (AI Endpoint)
- Receives `{ message, ownerId }` from the widget
- Looks up the business settings in MongoDB using `ownerId`
- Builds a structured prompt with business knowledge
- Calls Groq API with LLaMA 3.3 70B model
- Returns the AI-generated response
- Handles errors gracefully with user-friendly messages

### 3. Dashboard (Business Owner Panel)
- Authenticated page for business owners
- Configure: Business Name, Support Email, Knowledge Base
- Knowledge base accepts free-form text (FAQs, pricing, policies, etc.)
- Settings saved to MongoDB and used by the AI in every chat

### 4. Embed Page
- Shows the business owner their unique `<script>` tag
- The `data-owner-id` is tied to their authenticated session
- One-click copy to clipboard

### 5. Auth (Scalekit)
- Handles login/logout/OAuth callback
- Session stored in cookies as `access_token`
- `getSession()` validates the token and returns user info on every protected page

---

## 🤖 AI Prompt Design

The AI is given a strict prompt to ensure it only answers based on the business's knowledge:

```
You are a professional customer support assistant for this business.
Use only the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.
If the question cannot be answered from the information provided,
reply exactly with: "Please contact our customer support for further assistance."

BUSINESS INFORMATION:
[business name, support email, knowledge base]

CUSTOMER QUESTION:
[customer's message]

ANSWER:
```

This ensures the AI never makes up information and always stays on-topic.

---

## 🗄️ Database Schema

### Settings Model (MongoDB)

| Field | Type | Description |
|-------|------|-------------|
| `ownerId` | String | Unique user ID from Scalekit auth |
| `businessName` | String | Name of the business |
| `supportEmail` | String | Fallback contact email |
| `knowledge` | String | Full knowledge base text |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-updated timestamp |

---

## 🔐 Security

- All dashboard and embed pages require authentication via Scalekit
- The `/api/chat` endpoint is public (required for embedded widgets) but scoped by `ownerId`
- Each business's data is isolated by their unique `ownerId`
- API keys are stored as environment variables, never exposed to the client
- CORS headers are set to allow cross-origin requests for the embedded widget

---

## ⚡ Performance

- **Groq API** is used for AI inference — it's the fastest LLM inference provider available, delivering responses in under 1 second
- **MongoDB** with `findOne` by indexed `ownerId` for fast settings lookup
- **Vercel Edge Network** for global low-latency deployment
- **chatBot.js** is a lightweight vanilla JS file with no external dependencies

---

## 📊 Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| Groq API | 14,400 requests/day, 30 req/min |
| MongoDB Atlas | 512 MB storage |
| Vercel | 100 GB bandwidth/month |

---

## 🛣️ Future Roadmap

- [ ] Chat history per customer session
- [ ] Multiple chatbot themes and colors
- [ ] Analytics dashboard (total chats, common questions)
- [ ] File/PDF upload for knowledge base
- [ ] Multi-language support
- [ ] WhatsApp & Telegram integration
- [ ] Custom chatbot name and avatar

---

## 👨💻 Built By

**Rohit** — Full Stack Developer  
Email: [rjdhav67@gmail.com](mailto:rjdhav67@gmail.com)  
Live: https://apnaaibyrohit.vercel.app
