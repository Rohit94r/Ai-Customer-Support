import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "add-free-ai-chatbot-to-blogger-website",
  title: "How to Add a Free AI Chatbot to a Blogger Blog (5-Minute Setup, No Coding)",
  description:
    "Add a free AI chatbot to your Blogger blog in 5 minutes — no coding. Paste one ApnaAI script tag into your Blogger theme body and your chatbot is live. Step-by-step guide.",
  keyword: "add free AI chatbot to Blogger website",
  date: "2026-07-15",
  readingMinutes: 7,
  tags: ["Blogger", "Blogspot", "integration", "tutorial", "no-code", "AI chatbot"],
  related: [
    "add-free-ai-chatbot-to-html-website",
    "add-free-ai-chatbot-to-wordpress-website",
    "add-free-ai-chatbot-to-wix-website",
    "how-to-add-free-ai-chatbot-to-website",
  ],
  faqs: [
    {
      question: "Can I install ApnaAI on a free Blogspot (blogspot.com) subdomain?",
      answer:
        "Yes. Blogger allows custom JavaScript in your theme HTML, even on the free .blogspot.com subdomain. No custom domain or paid plan needed.",
    },
    {
      question: "Will the chatbot appear on every Blogger post and page?",
      answer:
        "Yes. Pasting the script in your Blogger theme's body (before </body>) shows the chat bubble on the homepage, every blog post and every static page.",
    },
    {
      question: "Does Blogger's theme editor allow JavaScript?",
      answer:
        "Yes. Blogger's Edit HTML feature allows full theme editing including JavaScript. ApnaAI's script works directly — no widget workaround needed.",
    },
  ],
  content: `
## Blogger is still the easiest free blog platform for Indian small businesses

Blogger (Blogspot) is free, owned by Google, and requires no hosting or domain investment. Thousands of Indian small businesses — tuition teachers, astrologers, content writers, hobby bloggers — run their web presence on Blogger. Adding a free AI chatbot to Blogger turns a passive blog into a 24x7 lead-capture channel.

This guide shows you how to install [ApnaAI](https://apnaai.online) on Blogger in 5 minutes — **no coding, no paid plan, no custom domain needed**.

## Why Blogger is a great fit

- Free forever — no hosting, no domain cost
- Owned by Google — solid uptime and SEO indexing
- Allows custom JavaScript in theme HTML (unlike WordPress.com free)
- No plugin conflicts to manage
- One self-contained script tag works site-wide

## Prerequisites

1. A Blogger account and blog (free at blogger.com)
2. Admin access to your blog
3. Your ApnaAI owner ID (free — get it at [apnaai.online](https://apnaai.online) → [login](/api/auth/login))
4. Your knowledge base pasted into ApnaAI dashboard (FAQs, prices, hours)

If you have not trained your bot, follow the [main setup guide](/blog/how-to-add-free-ai-chatbot-to-website) first.

## Method — Blogger Theme Edit HTML

1. Login to **Blogger Dashboard** at blogger.com
2. In the left menu, click **Theme**
3. Click the **down arrow** next to the Customize button
4. Click **Edit HTML**
5. In the HTML editor, scroll to the bottom (or press Ctrl+F / Cmd+F and search \`</body>\`)
6. Just **before** the closing \`</body>\` tag, paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

7. Click **Save** (top right)
8. Open your live blog in a new browser tab
9. The floating chat bubble appears bottom-right — test a question

## Replace YOUR_OWNER_ID with your real ID

Common mistake: copying the script above without replacing the placeholder. Your real owner ID is in the **Embed page** of your ApnaAI dashboard after login. It is tied to your authenticated session.

## Add a HTML/JavaScript widget instead (alternative method)

If you don't want to edit theme HTML:

1. **Layout** (left menu)
2. Click **Add a Gadget** in the footer or sidebar area
3. Choose **HTML/JavaScript** gadget
4. Title: leave blank or "Chat"
5. Content: paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

6. Save
7. Save arrangement (top right)
8. Open your blog — chat bubble appears

This method is easier to remove later if needed.

## Verify the chatbot is working

1. Open your live Blogger blog in an incognito window
2. Click the floating chat bubble bottom-right
3. Type a test question — "What services do you offer?"
4. The bot replies in under 1 second
5. If no reply: check your knowledge base is saved in ApnaAI dashboard

## Common issues and fixes

### Chat bubble not appearing

- You pasted inside a \`<b:section>\` block by mistake — paste raw in theme HTML before \`</body>\`, or use the HTML/JavaScript widget method
- Browser cache — hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Theme reverted — re-paste and Save

### Bot replies "Please contact our customer support"

- Your knowledge base in ApnaAI dashboard is empty — paste your FAQs and prices
- Your question is not covered — add the answer in the dashboard, test again

### Theme editor saves but reverts

- Some Blogger themes reject raw script tags on Save — use the HTML/JavaScript widget method instead, which always works

## Custom domain (www.yoursite.com)

If you've connected a custom domain to Blogger, the same install works. ApnaAI loads from \`apnaai.online\` — no domain-specific config needed. Your owner ID is tied to your ApnaAI account, not your domain.

## SEO benefits of adding chatbot to Blogger

- **Dwell time** up 30-60 seconds as visitors chat instead of bouncing
- **Lead capture** 24x7 — even at 11 PM when you're offline
- **Lower email volume** — repetitive FAQs handled by the bot
- **Google SEO signal** — engaged visitors on a Google-owned platform = strong helpful content signal

## Mobile-first important

Most Indian blog traffic is mobile. ApnaAI chat widget is mobile-optimized — floating bubble, full-screen chat on phone, fast load on 4G. Test on real Android Chrome, not just desktop.

## Speed and Core Web Vitals

ApnaAI script is <20KB and loads async — it does not affect your Blogger Lighthouse score or LCP. Blogger themes are usually lightweight already, so the bot adds no perceptible load.

## Blogger vs WordPress for small business

Blogger is free and zero-maintenance. WordPress is more powerful but needs hosting and updates. If you are a solo tuition teacher, astrologer or hobby blogger who doesn't want hosting bills, Blogger + ApnaAI is a complete 24x7 web presence at zero cost.

## Tuition teacher and astrologer Blogger sites

Common Indian use cases:

- **Tuition teacher** — Blogspot site with classes, fees and a chatbot that books demo classes on WhatsApp. See our [tuition chatbot guide](/blog/chatbot-for-tuition-teacher-website-india).
- **Astrologer** — Blogspot site with consultation types and a chatbot that captures birth details. See our [astrologer chatbot guide](/blog/chatbot-for-astrologer-website-india).
- **Content writer / freelancer** — Blogspot portfolio with services and a chatbot that captures project briefs.

## Next steps after install

1. Train 15 FAQs in your ApnaAI knowledge base
2. Add industry template from our [niche guides](/blog)
3. Test on mobile Chrome
4. Add a "Chat with me" line in your blog sidebar
5. Review missed questions weekly and update knowledge base

## Get started free

Open [ApnaAI](https://apnaai.online), [login](/api/auth/login), grab your owner ID and paste the script into your Blogger theme before dinner.

For the full setup walkthrough, see [How to add a free AI chatbot to your website](/blog/how-to-add-free-ai-chatbot-to-website).
`,
};
