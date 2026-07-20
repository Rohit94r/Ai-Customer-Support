import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "add-free-ai-chatbot-to-shopify-store",
  title: "How to Add a Free AI Chatbot to a Shopify Store (No App, 5-Minute Setup)",
  description:
    "Add a free AI chatbot to your Shopify store in 5 minutes — no paid app, no coding. Paste one ApnaAI script tag into your theme liquid and your bot is live. Step-by-step guide.",
  keyword: "add free AI chatbot to Shopify store",
  date: "2026-07-15",
  readingMinutes: 8,
  tags: ["Shopify", "ecommerce", "integration", "tutorial", "no-code", "AI chatbot"],
  related: [
    "add-free-ai-chatbot-to-wordpress-website",
    "free-ai-chatbot-for-ecommerce-website",
    "how-to-add-free-ai-chatbot-to-website",
    "add-free-ai-chatbot-to-wix-website",
  ],
  faqs: [
    {
      question: "Do I need a Shopify app to install the ApnaAI chatbot?",
      answer:
        "No. ApnaAI is installed with a single script tag pasted into your theme's theme.liquid file. No app needed, so no monthly app fee and no app conflict.",
    },
    {
      question: "Will the chatbot appear on product, cart and checkout pages?",
      answer:
        "Yes. Pasting the script in theme.liquid (before </body>) shows the chat bubble on every storefront page including product, collection, cart and checkout.",
    },
    {
      question: "Does Shopify Plus work the same way?",
      answer:
        "Yes. The same theme.liquid method works on Shopify Basic, Standard, Advanced and Plus. Plus stores can also use Script Editor for advanced flows.",
    },
  ],
  content: `
## Shopify is the fastest-growing D2C platform in India — your chatbot belongs there

Shopify powers thousands of Indian D2C brands — fashion, beauty, electronics, food, supplements. The biggest leak in a Shopify store is silent visitors who have product, pricing and shipping questions but no instant answer. They leave. A free AI chatbot plugged into Shopify fixes this in 5 minutes.

This guide shows you how to install [ApnaAI](https://apnaai.online) on Shopify — **no paid app, no coding, no monthly fee**.

## Why no app is better

- No monthly app fee (Shopify chat apps cost Rs 500-3000 / month)
- No app conflict with your existing 25 apps
- No app update breaking your chat widget
- No app store approval wait
- One self-contained script, theme-independent

## Prerequisites

1. A Shopify store with admin access
2. Your ApnaAI owner ID (free — get it at [apnaai.online](https://apnaai.online) → [login](/api/auth/login))
3. Your knowledge base pasted into ApnaAI dashboard (FAQs, prices, shipping)

If you have not trained your bot, follow the [main setup guide](/blog/how-to-add-free-ai-chatbot-to-website) first.

## Method 1 — Theme.liquid (chatbot on every page, recommended)

This is the standard method. The chat bubble appears on every storefront page.

1. Login to **Shopify Admin**
2. Go to **Online Store → Themes**
3. Click **Actions → Edit code** on your active theme
4. In the left layout sidebar, click **theme.liquid**
5. Scroll to the very bottom, just **before** the closing \`</body>\` tag, paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

6. Click **Save**
7. Open your storefront in a new browser tab
8. The floating chat bubble appears bottom-right — test a question

## Method 2 — Theme customisation (no code editing)

If your theme supports custom scripts in the theme editor:

1. **Online Store → Themes → Customise**
2. Go to **Theme settings → Custom CSS / Custom scripts** (varies by theme)
3. Paste your ApnaAI script in the footer scripts area
4. Save
5. Chat bubble appears site-wide

## Method 3 — App-embed section (Online Store 2.0 themes)

For Online Store 2.0 themes with App Embeds:

1. **Online Store → Themes → Customise**
2. **App embeds** (bottom of left sidebar)
3. Add a custom HTML block and paste your script
4. Save

## Replace YOUR_OWNER_ID with your real ID

Common mistake: copying the script above without replacing the placeholder. Your real owner ID is in the **Embed page** of your ApnaAI dashboard after login. It is tied to your authenticated session.

## Train your bot for ecommerce specifically

A generic FAQ bot is weak. Train ApnaAI with ecommerce-specific answers:

- Shipping pincodes and delivery time
- Free shipping threshold
- COD availability and fee
- Return / exchange policy
- Size chart guidance
- Bestseller stock status
- GST bill availability
- Care instructions (garments, electronics)

See our [ecommerce chatbot guide](/blog/free-ai-chatbot-for-ecommerce-website) for a full knowledge base template.

## Verify the chatbot is working

1. Open your live Shopify store in an incognito window
2. Click the floating chat bubble bottom-right
3. Type a test question — "Do you ship to 411057?"
4. The bot replies in under 1 second
5. If no reply: check your knowledge base is saved in ApnaAI dashboard

## Common issues and fixes

### Chat bubble not appearing

- You pasted inside a \`<div>\` block by mistake — paste raw in theme.liquid before \`</body>\`
- Theme cache — Shopify re-renders within 60 seconds, refresh after a minute
- A Shopify app like Minify or Speed Booster stripped the script — add \`apnaai.online\` to its exclusion list

### Bot replies "Please contact our customer support"

- Your knowledge base in ApnaAI dashboard is empty — paste your FAQs
- Your question is not covered — add the answer in the dashboard, test again

### Checkout page missing the bot

- Shopify's checkout.liquid is locked on Basic / Standard plans — the bot shows on all storefront pages except the new one-page checkout
- This is fine — checkout is not where customers ask questions

## SEO benefits of adding chatbot to Shopify

- **Dwell time** up 30-60 seconds as visitors chat instead of bouncing
- **Cart abandonment** down as the bot answers shipping and COD questions
- **Mobile conversion** up — most Indian Shopify traffic is mobile
- **Lower support email volume** — repetitive FAQs handled by the bot
- **24x7 lead capture** — even at 11 PM when your team is offline

## Mobile-first important

Most Indian Shopify traffic is mobile (70-85%). ApnaAI chat widget is mobile-optimized — floating bubble, full-screen chat on phone, fast load on 4G. Test on real Android Chrome, not just desktop.

## Speed and Core Web Vitals

ApnaAI script is <20KB and loads async — it does not affect your Shopify Lighthouse score or LCP. If you use a speed-optimisation app, exclude \`apnaai.online\` from JavaScript deferral.

## Multi-currency and multi-language stores

If you run a multi-currency Shopify store (INR + USD), train your bot with both currencies. If multi-language, start with English and add Hindi / regional words later — your customers already understand ecommerce English.

## Shopify Plus stores

Same theme.liquid method works. Plus stores can additionally use **Script Editor** and **Functions** for cart-level logic — but the chatbot itself needs no Script Editor.

## Headless Shopify (Hydrogen, custom storefronts)

If you run a headless Shopify on Hydrogen or a custom Next.js storefront, paste the ApnaAI script in your root layout's \`</body>\` — same as any custom site. See our [HTML website guide](/blog/add-free-ai-chatbot-to-html-website) for the pattern.

## Next steps after install

1. Train 20 ecommerce FAQs in your ApnaAI knowledge base
2. Add bestseller stock status (update weekly)
3. Test on mobile Chrome
4. Add a "Chat with us" link in your Shopify footer menu
5. Review missed questions weekly and update knowledge base

## Get started free

Open [ApnaAI](https://apnaai.online), [login](/api/auth/login), grab your owner ID and paste the script into your Shopify theme.liquid before dinner.

For the full setup walkthrough, see [How to add a free AI chatbot to your website](/blog/how-to-add-free-ai-chatbot-to-website).
`,
};
