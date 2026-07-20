import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "add-free-ai-chatbot-to-html-website",
  title: "How to Add a Free AI Chatbot to a Plain HTML Website (5-Minute, Copy-Paste)",
  description:
    "Add a free AI chatbot to any static HTML website in 5 minutes — copy-paste one ApnaAI script tag before </body> and your bot is live. No framework, no build, no coding.",
  keyword: "add free AI chatbot to HTML website",
  date: "2026-07-15",
  readingMinutes: 7,
  tags: ["HTML", "static site", "integration", "tutorial", "no-code", "AI chatbot"],
  related: [
    "how-to-add-free-ai-chatbot-to-website",
    "add-free-ai-chatbot-to-wordpress-website",
    "add-free-ai-chatbot-to-blogger-website",
    "add-free-ai-chatbot-to-wix-website",
  ],
  faqs: [
    {
      question: "Do I need any framework or build tool to install ApnaAI on HTML?",
      answer:
        "No. ApnaAI is a single script tag you paste before </body> in your index.html. Works on static HTML, Bootstrap templates, jQuery sites, plain PHP sites and any site where you control the HTML.",
    },
    {
      question: "Will the chatbot work on a free GitHub Pages or Netlify static site?",
      answer:
        "Yes. ApnaAI loads from its own origin, so it works on GitHub Pages, Netlify, Vercel, Cloudflare Pages and any static hosting — free or paid.",
    },
    {
      question: "Can I show the chatbot only on specific HTML pages?",
      answer:
        "Yes. Paste the script only in the HTML pages where you want the chat widget. Pages without the script will not show the bubble.",
    },
  ],
  content: `
## Plain HTML is still everywhere in India — and it's the easiest to add a chatbot to

Many Indian small business sites are plain HTML — a static template hosted on Hostinger, GoDaddy, GitHub Pages, or a custom PHP site. Adding a free AI chatbot to plain HTML is the simplest of all integrations: one paste, no framework, no build step.

This guide shows you how to install [ApnaAI](https://apnaai.online) on any HTML site in 5 minutes — **copy, paste, done**.

## Why plain HTML is the easiest

- No plugin, no app, no theme editor to learn
- No build step (no Webpack, no Vite, no npm)
- No framework conflict (works alongside Bootstrap, jQuery, Tailwind, anything)
- One self-contained script tag — paste before \`</body>\`

## Prerequisites

1. Access to edit your site's HTML (via FTP, cPanel File Manager, GitHub repo, or hosting dashboard)
2. Your ApnaAI owner ID (free — get it at [apnaai.online](https://apnaai.online) → [login](/api/auth/login))
3. Your knowledge base pasted into ApnaAI dashboard (FAQs, prices, hours)

If you have not trained your bot, follow the [main setup guide](/blog/how-to-add-free-ai-chatbot-to-website) first.

## Method — paste before </body>

1. Open your **index.html** (or your main template / header-footer file) in any editor
2. Scroll to the very bottom of the file
3. Find the closing \`</body>\` tag
4. Just **before** \`</body>\`, paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

5. Save the file
6. Upload back to your hosting (via FTP / cPanel / git push)
7. Open your live site in a new browser tab
8. The floating chat bubble appears bottom-right — test a question

Your final HTML should look like:

\`\`\`
<!DOCTYPE html>
<html>
<head>
  <title>Your Business</title>
</head>
<body>
  <!-- your existing content -->

  <script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
</body>
</html>
\`\`\`

## Replace YOUR_OWNER_ID with your real ID

Common mistake: copying the script above without replacing the placeholder. Your real owner ID is in the **Embed page** of your ApnaAI dashboard after login. It is tied to your authenticated session.

## Multi-page HTML sites

If your site has multiple HTML pages (index.html, about.html, services.html, contact.html):

- For chatbot on every page → paste the script in your **footer include** (footer.php, partial.html, or whichever file is included at the bottom of every page)
- For chatbot only on selected pages → paste the script only in those pages before \`</body>\`

## Bootstrap and Tailwind HTML templates

ApnaAI works perfectly with Bootstrap, Tailwind, Bulma, Foundation and any CSS framework. The chat widget is self-contained — no CSS conflict, no class name clashes.

## jQuery and vanilla JS sites

ApnaAI does not depend on jQuery or any library. It loads even on pages with no other JavaScript. No \`$\` conflict, no \`window.onload\` timing issues.

## PHP, ASP, JSP and other server-rendered sites

If your site renders HTML via PHP / ASP / JSP / Django templates / EJS / Pug, paste the script in your **footer partial** so it appears on every server-rendered page. The script tag is plain HTML — server-side rendering does not affect it.

## Static site generators — Hugo, Jekyll, Eleventy, Astro

For static generators, paste the script in your base layout template:

- **Hugo**: \`layouts/_default/baseof.html\` before \`</body>\`
- **Jekyll**: \`_layouts/default.html\` before \`</body>\`
- **Eleventy**: your base layout file before \`</body>\`
- **Astro**: \`src/layouts/Layout.astro\` before \`</body>\`

Rebuild and redeploy — the chatbot appears on every generated page.

## React, Vue, Next.js single-page apps

For SPAs, paste the script in your root layout's \`</body>\` (Next.js \`app/layout.tsx\` or Vue \`App.vue\` template). The chat widget persists across client-side route changes. See our [WordPress guide](/blog/add-free-ai-chatbot-to-wordpress-website) for the same pattern in a CMS context.

## Hosting platforms — where it works

ApnaAI works on every static hosting platform — free and paid:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Hostinger
- GoDaddy shared hosting
- Bluehost
- Any cPanel hosting
- Your own VPS / dedicated server

The script loads from \`apnaai.online\` — your hosting does not need any special config.

## Verify the chatbot is working

1. Open your live HTML site in an incognito window
2. Click the floating chat bubble bottom-right
3. Type a test question — "What are your business hours?"
4. The bot replies in under 1 second
5. If no reply: check your knowledge base is saved in ApnaAI dashboard

## Common issues and fixes

### Chat bubble not appearing

- You pasted inside a \`<p>\` or \`<div>\` block by mistake — paste raw before \`</body>\`
- Browser cache — hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- You uploaded to wrong folder — usually \`public_html\` on cPanel

### Bot replies "Please contact our customer support"

- Your knowledge base in ApnaAI dashboard is empty — paste your FAQs and prices
- Your question is not covered — add the answer in the dashboard, test again

### Mixed content warning (https vs http)

- If your site is HTTPS (it should be), the script loads from \`https://apnaai.online\` — no mixed content
- If your site is still HTTP, get a free Let's Encrypt SSL from your hosting

## SEO benefits of adding chatbot to HTML

- **Dwell time** up 30-60 seconds as visitors chat instead of bouncing
- **Lead capture** 24x7 — even at 11 PM when your office is closed
- **Lower support calls** — repetitive FAQs handled by the bot
- **Helpful content signal** — Google sees engaged visitors, not bounces

## Mobile-first important

Most Indian traffic is mobile. ApnaAI chat widget is mobile-optimized — floating bubble, full-screen chat on phone, fast load on 4G. Test on real Android Chrome, not just desktop.

## Speed and Core Web Vitals

ApnaAI script is <20KB and loads async — it does not affect your Lighthouse score or LCP. No layout shift, no render-blocking. Your HTML site stays fast.

## Next steps after install

1. Train 15 FAQs in your ApnaAI knowledge base
2. Add industry template from our [niche guides](/blog) — restaurant, CA, clinic, gym, salon, real estate and 40+ more
3. Test on mobile Chrome
4. Review missed questions weekly and update knowledge base

## Get started free

Open [ApnaAI](https://apnaai.online), [login](/api/auth/login), grab your owner ID and paste the script before \`</body>\` in your HTML before dinner.

For the full setup walkthrough, see [How to add a free AI chatbot to your website](/blog/how-to-add-free-ai-chatbot-to-website).
`,
};
