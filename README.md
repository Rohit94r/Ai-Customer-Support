# Apna AI - AI-Powered Customer Support Chatbot

> An intelligent, embeddable AI-powered customer support chatbot that brings 24/7 assistance to your website.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square)

## 🎯 Overview

Apna AI is a sophisticated customer support platform that enables businesses to embed intelligent AI chatbots on their websites. Powered by Google's Gemini AI, it delivers instant, knowledge-based responses to customer inquiries around the clock.

### ✨ Key Features

- 🤖 **AI-Powered Responses** - Google Gemini 2.0 Flash integration
- 📝 **Admin-Controlled Knowledge Base** - Full control over training data
- 🔐 **Enterprise Authentication** - Scalekit SSO integration  
- 💾 **Data Persistence** - MongoDB for reliable storage
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS & animations
- ⚡ **High Performance** - Next.js 16 with Turbopack
- 🔌 **Easy Integration** - Single script tag embed
- 📊 **Admin Dashboard** - Complete chatbot management
- 📱 **Mobile Responsive** - Perfect on all devices
- 🎬 **Typing Animation** - Visual feedback while processing

## 🛠️ Tech Stack

**Frontend:** Next.js 16.1.6 • React 19.2.3 • TypeScript • Tailwind CSS • Motion

**Backend:** Next.js API Routes • MongoDB • Mongoose • Google Gemini API • Scalekit SDK

## 📋 Prerequisites

- Node.js 18+
- MongoDB (Atlas free tier)
- Google Gemini API key  
- Scalekit account

## 🚀 Quick Start

```bash
# Clone and install
git clone <repo-url>
cd ai-support
npm install

# Create .env.local with credentials
# See section below for details

# Start development
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Environment Configuration

Create `.env.local`:

```env
# Database
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/database

# AI API
GEMINI_API_KEY=your_gemini_key

# Authentication  
SCALEKIT_ENVIRONMENT_URL=https://your-tenant.scalekit.dev
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_secret
NEXT_PUBLIC_SCALEKIT_REDIRECT_URI=http://localhost:3000

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CHATBOT_URL=http://localhost:3000
```

## 📖 How It Works

### Business Owner Flow
1. **Login** → Dashboard (`/dashboard`)
2. **Configure** → Add business info & knowledge base
3. **Deploy** → Copy embed code from `/embed`
4. **Integrate** → Paste script on website

### Customer Flow  
1. **Click** → Chat bubble (bottom right)
2. **Ask** → Type your question
3. **Get Response** → Instant AI answer

## 💻 Embedding

Add this before closing `</body>` tag:

```html
<script 
  src="http://localhost:3000/chatBot.js"
  data-owner-id="your_owner_id">
</script>
```

## 🔗 API Reference

### Chat API
**POST** `/api/chat`
```json
{
  "message": "What's your return policy?",
  "ownerId": "usr_12345"
}
```

### Settings API  
**GET** `/api/settings/get?ownerId=xxx`
**POST** `/api/settings`

### Authentication
- `GET /api/auth/login` - Start login flow
- `GET /api/auth/callback` - Handle redirect
- `GET /api/auth/logout` - End session

## 📁 Structure

```
src/
├── app/
│   ├── api/              # Backend routes
│   ├── dashboard/        # Admin panel
│   ├── embed/            # Embed page
│   └── page.tsx          # Home
├── components/           # React components
├── lib/                  # Utilities
├── model/                # Schemas
└── proxy.ts              # Middleware
```

## 🔐 Security

✅ Type-safe TypeScript  
✅ CORS protection  
✅ Environment variables  
✅ Input validation  
✅ Secure sessions  
✅ MongoDB pooling  

## 🚀 Deploy

### Vercel
```bash
git push  # Deploy automatically
```

### Docker
```bash
npm run build
docker build -t support-ai .
docker run -p 3000:3000 support-ai
```

## 🐛 Troubleshooting

**Chatbot not showing?**
- Check script placement before `</body>`
- Verify `data-owner-id` value
- Open DevTools (F12) for errors

**API quota exceeded?**
- Upgrade Gemini API plan
- Check usage at [ai.google.dev/rate-limit](https://ai.google.dev/rate-limit)

**MongoDB connection failed?**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Test credentials

**Auth issues?**
- Verify Scalekit configuration
- Check callback redirect URL
- Clear browser cookies

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

Then create a Pull Request.

## 📝 License

MIT License - See LICENSE file

## 🆘 Support

- 📧 **Email:** support@supportai.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- 📚 **Docs:** [Full Documentation](https://docs.supportai.com)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Custom chatbot branding
- [ ] Advanced analytics
- [ ] Conversation history
- [ ] Human agent handoff
- [ ] Sentiment analysis
- [ ] Mobile app
- [ ] API integrations

---

**Built with ❤️ for exceptional customer support**

Version 1.0.0 | Last Updated: February 27, 2026
