# 🤖 Apna AI — AI Customer Support Chatbot

> Embed a smart AI chatbot on any website in under 2 minutes. No coding required.

**Live App:** https://apnaaibyrohit.vercel.app

---

## ✨ What is Apna AI?

Apna AI lets any business owner add an AI-powered customer support chatbot to their website by pasting a single line of code. The chatbot is trained on your own business information and answers customer questions 24/7 — automatically.

---

## 🚀 Quick Start (For Website Owners)

### Step 1 — Sign Up
Go to https://apnaaibyrohit.vercel.app and sign in with your account.

### Step 2 — Configure Your Chatbot
Go to **Dashboard** and fill in:
- Business Name
- Support Email
- Knowledge Base (your products, pricing, FAQs, policies, etc.)

Click **Save**.

### Step 3 — Embed on Your Website
Go to **Embed ChatBot** and copy your unique script tag:

```html
<script
  src="https://apnaaibyrohit.vercel.app/chatBot.js"
  data-owner-id="YOUR_OWNER_ID">
</script>
```

Paste it before the `</body>` tag on your website. Done! 🎉

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| Frontend | React 19, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| Database | MongoDB (Mongoose) |
| AI | Groq API (LLaMA 3.3 70B) |
| Auth | Scalekit |
| Deployment | Vercel |

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB database
- Groq API key → https://console.groq.com
- Scalekit account → https://scalekit.com

### Setup

```bash
# Clone the repo
git clone https://github.com/Rohit94r/Ai-Customer-Support.git
cd Ai-Customer-Support

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URL=your_mongodb_connection_string
SCALEKIT_CLIENT_ID=your_scalekit_client_id
SCALEKIT_CLIENT_SECRET=your_scalekit_client_secret
SCALEKIT_ENVIRONMENT_URL=your_scalekit_environment_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SCALEKIT_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

```bash
# Start development server
npm run dev
```

Open http://localhost:3000

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for AI responses | ✅ |
| `MONGODB_URL` | MongoDB connection string | ✅ |
| `SCALEKIT_CLIENT_ID` | Scalekit auth client ID | ✅ |
| `SCALEKIT_CLIENT_SECRET` | Scalekit auth secret | ✅ |
| `SCALEKIT_ENVIRONMENT_URL` | Scalekit environment URL | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | ✅ |
| `NEXT_PUBLIC_SCALEKIT_REDIRECT_URI` | OAuth callback URL | ✅ |

---

## 📁 Project Structure

```
Ai-Customer-Support/
├── public/
│   └── chatBot.js          # Embeddable chatbot widget
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/       # AI chat endpoint
│   │   │   ├── settings/   # Save/get bot settings
│   │   │   └── auth/       # Login, logout, callback
│   │   ├── dashboard/      # Bot configuration page
│   │   ├── embed/          # Embed code page
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── HomeClient.tsx
│   │   ├── DashboardClient.tsx
│   │   └── EmbedClient.tsx
│   ├── lib/
│   │   ├── db.ts           # MongoDB connection
│   │   ├── getSession.ts   # Auth session helper
│   │   └── scalekit.ts     # Scalekit client
│   └── model/
│       └── settings.model.ts  # MongoDB settings schema
└── README.md
```

---

## 📡 API Reference

### `POST /api/chat`
Handles chatbot messages from embedded widgets.

**Request:**
```json
{
  "message": "What are your business hours?",
  "ownerId": "usr_xxxxxxxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "text": "Our business hours are Monday to Friday, 9 AM to 6 PM IST."
}
```

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in Vercel → Settings → Environment Variables.

---

## 👨‍💻 Author

Built by **Rohit** — [rjdhav67@gmail.com](mailto:rjdhav67@gmail.com)

---

## 📄 License

MIT License — free to use and modify.
