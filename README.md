# AI Customer Support Chatbot

A smart AI-powered chatbot that you can embed on any website to provide instant customer support 24/7.

## 🌟 Features

- **AI-Powered Responses** - Uses Google Gemini AI to answer customer questions
- **Easy Setup** - Just copy & paste one line of code to your website
- **Customizable** - Add your own business information and FAQs
- **24/7 Support** - Your chatbot never sleeps
- **Beautiful UI** - Modern floating chat widget

## 🚀 Live Demo

**Website:** https://apnaaibyrohit.vercel.app

## 📋 How It Works

1. **Sign Up** - Create your account
2. **Add Business Info** - Fill in your business details and knowledge base
3. **Get Embed Code** - Copy your unique chatbot script
4. **Add to Website** - Paste the code before `</body>` tag
5. **Done!** - Your AI chatbot is live

## 💻 Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **AI:** Google Gemini API
- **Auth:** Scalekit
- **Deployment:** Vercel

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Rohit94r/Ai-Customer-Support.git

# Navigate to project
cd ai-support

# Install dependencies
npm install

# Create .env.local file with:
MONGODB_URL=your_mongodb_url
GEMINI_API_KEY=your_gemini_api_key
SCALEKIT_CLIENT_ID=your_scalekit_client_id
SCALEKIT_CLIENT_SECRET=your_scalekit_client_secret
SCALEKIT_ENVIRONMENT_URL=your_scalekit_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SCALEKIT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Run development server
npm run dev
```

## 📦 How to Use on Your Website

Add this code to your website's HTML before the `</body>` tag:

```html
<script
  src="https://apnaaibyrohit.vercel.app/chatBot.js"
  data-owner-id="YOUR_OWNER_ID">
</script>
```

Get your `YOUR_OWNER_ID` from the dashboard after signing up.

## 📁 Project Structure

```
ai-support/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   └── embed/        # Embed code page
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── model/            # MongoDB models
├── public/
│   └── chatBot.js        # Chatbot widget script
└── README.md
```

## 🎯 Key Features Explained

### Dashboard
- Manage business name and support email
- Add knowledge base (FAQs, policies, etc.)
- Get embed code with your unique ID

### Chatbot Widget
- Floating button in bottom-right corner
- Clean chat interface
- Real-time AI responses
- Mobile responsive

### AI Integration
- Powered by Google Gemini
- Uses your custom knowledge base
- Provides accurate business-specific answers

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URL` | MongoDB connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SCALEKIT_CLIENT_ID` | Scalekit authentication client ID |
| `SCALEKIT_CLIENT_SECRET` | Scalekit authentication secret |
| `SCALEKIT_ENVIRONMENT_URL` | Scalekit environment URL |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## 📝 License

MIT License - feel free to use for your projects!

## 👨‍💻 Developer

Created by Rohit

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

For support, email: rjdhav67@gmail.com

---

**Made with ❤️ using Next.js and AI**
