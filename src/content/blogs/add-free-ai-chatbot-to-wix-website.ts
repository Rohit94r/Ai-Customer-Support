import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "add-free-ai-chatbot-to-wix-website",
  title: "How to Add a Free AI Chatbot to a Wix Website (5-Minute Setup, No Coding)",
  description:
    "Add a free AI chatbot to your Wix website in 5 minutes — no Velo coding. Paste one ApnaAI script tag into your site tracking footer and your bot is live. Step-by-step guide.",
  keyword: "add free AI chatbot to Wix website",
  date: "2026-07-15",
  readingMinutes: 7,
  tags: ["Wix", "integration", "tutorial", "no-code", "AI chatbot"],
  related: [
    "add-free-ai-chatbot-to-wordpress-website",
    "add-free-ai-chatbot-to-shopify-store",
    "add-free-ai-chatbot-to-blogger-website",
    "how-to-add-free-ai-chatbot-to-website",
  ],
  faqs: [
    {
      question: "Do I need Velo or a Wix app to install the ApnaAI chatbot?",
      answer:
        "No. ApnaAI is installed with a single script tag pasted into your Wix Marketing Tools → Custom Code section. No Velo coding, no app marketplace needed.",
    },
    {
      question: "Will the chatbot work on the free Wix plan?",
      answer:
        "Wix Free plan does not allow custom code and shows Wix ads. You need a paid Combo, Unlimited or Pro plan to embed the ApnaAI script and remove ads.",
    },
    {
      question: "Can I show the chatbot only on selected Wix pages?",
      answer:
        "Yes. Use Velo to add the script to a specific page's code, or use a custom HTML iframe on selected pages. Site-wide install is simpler and recommended for most businesses.",
    },
  ],
  content: `
## Wix is popular with Indian small businesses for its drag-and-drop simplicity

Wix powers many Indian small business sites — salons, gyms, photographers, restaurants, CA firms — because it requires no coding. The missing piece for most Wix sites is a 24x7 AI chatbot. This guide shows you how to install [ApnaAI](https://apnaai.online) on Wix in 5 minutes — **no Velo, no app marketplace, no coding**.

## Why no app is better

- No monthly app subscription (Wix chat apps cost Rs 300-1500 / month)
- No app conflict with Wix built-in apps
- No app update breaking your chat widget
- One self-contained script, theme-independent

## Prerequisites

1. A paid Wix plan — **Combo, Unlimited, Pro or VIP** (Free plan blocks custom code)
2. Owner / admin access to your Wix site
3. Your ApnaAI owner ID (free — get it at [apnaai.online](https://apnaai.online) → [login](/api/auth/login))
4. Your knowledge base pasted into ApnaAI dashboard (FAQs, prices, hours)

If you have not trained your bot, follow the [main setup guide](/blog/how-to-add-free-ai-chatbot-to-website) first.

## Method — Wix Custom Code (recommended)

1. Open your **Wix Dashboard**
2. Go to **Settings → Custom Code** (or **Marketing & SEO → Custom Code** on newer dashboards)
3. Click **+ Add Custom Code** (top right)
4. Fill in:

\`\`\`
Code snippet: <script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
Place in: Body - end (before </body>)
Apply to: All pages
Name: ApnaAI chatbot
\`\`\`

5. Click **Apply**
6. Click **Save** and **Publish** your site
7. Open your live Wix site in a new browser tab
8. The floating chat bubble appears bottom-right — test a question

## Replace YOUR_OWNER_ID with your real ID

Common mistake: copying the script above without replacing the placeholder. Your real owner ID is in the **Embed page** of your ApnaAI dashboard after login. It is tied to your authenticated session.

## Selected pages only — Velo method (optional)

If you want the chatbot only on specific pages (e.g. Contact and Services):

1. Open **Wix Editor**
2. Enable **Dev Mode** (top menu → toggle Dev Mode on)
3. Open the page where you want the bot
4. In the page code panel, add:

\`\`\`
$w.onReady(function () {
  const s = document.createElement('script');
  s.src = 'https://apnaai.online/chatBot.js';
  s.setAttribute('data-owner-id', 'YOUR_OWNER_ID');
  document.body.appendChild(s);
});
\`\`\`

5. Save and Publish
6. Repeat for each page where the bot should appear

Site-wide install is simpler and recommended unless you have a specific reason to limit the bot.

## Verify the chatbot is working

1. Open your live Wix site in an incognito window
2. Click the floating chat bubble bottom-right
3. Type a test question — "What are your business hours?"
4. The bot replies in under 1 second
5. If no reply: check your knowledge base is saved in ApnaAI dashboard

## Common issues and fixes

### Chat bubble not appearing

- You picked "Head" instead of "Body - end" — re-edit the custom code, change place to Body end
- Free Wix plan blocks custom code — upgrade to Combo or higher
- Site not published — click Publish in the editor

### Bot replies "Please contact our customer support"

- Your knowledge base in ApnaAI dashboard is empty — paste your FAQs and prices
- Your question is not covered — add the answer in the dashboard, test again

### Chat widget slow on mobile

- Wix loads heavy media — compress hero images and background videos
- ApnaAI script itself is <20KB and loads in milliseconds — the bottleneck is Wix media

## SEO benefits of adding chatbot to Wix

- **Dwell time** up 30-60 seconds as visitors chat instead of bouncing
- **Lead capture** 24x7 — even at 11 PM when your office is closed
- **Lower support calls** — repetitive FAQs handled by the bot
- **Wix SEO boost** — Google sees engaged visitors, helpful content signal

## Mobile-first important

Most Indian Wix traffic is mobile. ApnaAI chat widget is mobile-optimized — floating bubble, full-screen chat on phone, fast load on 4G. Test on real Android Chrome, not just desktop.

## Wix Editor X and Studio sites

The same Custom Code method works on Wix Studio and Editor X. Both support Settings → Custom Code with the same options.

## Wix Online Store and Bookings

If you run a Wix Store or Wix Bookings site, use the site-wide Custom Code method so the bot appears on product, cart, checkout and booking pages. Train ApnaAI with your store FAQs (shipping, COD, returns) or booking policies (cancellation, reschedule).

## Multi-language Wix sites

Wix Multilingual is supported. Start with English in your ApnaAI knowledge base, add Hindi / regional words later. Most Indian customers understand ecommerce English.

## Next steps after install

1. Train 15 FAQs in your ApnaAI knowledge base
2. Add industry template from our [niche guides](/blog) — salon, gym, photographer, restaurant, CA, clinic and 40+ more
3. Test on mobile Chrome
4. Review missed questions weekly and update knowledge base

## Get started free

Open [ApnaAI](https://apnaai.online), [login](/api/auth/login), grab your owner ID and paste the script into Wix Custom Code before dinner.

For the full setup walkthrough, see [How to add a free AI chatbot to your website](/blog/how-to-add-free-ai-chatbot-to-website).
`,
};
