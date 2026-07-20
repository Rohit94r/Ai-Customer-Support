import type { BlogPost } from "./types";

export const post: BlogPost = {
  slug: "add-free-ai-chatbot-to-wordpress-website",
  title: "How to Add a Free AI Chatbot to a WordPress Website (No Plugin, 5-Minute Setup)",
  description:
    "Add a free AI chatbot to your WordPress website in 5 minutes — no plugin, no coding. Paste one ApnaAI script tag into your theme footer and your bot is live. Step-by-step guide.",
  keyword: "add free AI chatbot to WordPress website",
  date: "2026-07-15",
  readingMinutes: 8,
  tags: ["WordPress", "integration", "tutorial", "no-code", "AI chatbot"],
  related: [
    "how-to-add-free-ai-chatbot-to-website",
    "add-free-ai-chatbot-to-shopify-store",
    "add-free-ai-chatbot-to-wix-website",
    "add-free-ai-chatbot-to-blogger-website",
    "add-free-ai-chatbot-to-html-website",
  ],
  faqs: [
    {
      question: "Do I need a WordPress plugin to install the ApnaAI chatbot?",
      answer:
        "No. ApnaAI is installed with a single script tag pasted into your theme footer (or a 'Custom HTML' block). No plugin needed, so no plugin conflicts and no performance drag.",
    },
    {
      question: "Will the chatbot work on WordPress.com free plans?",
      answer:
        "WordPress.com free and Personal plans do not allow custom JavaScript. You need a Business or Commerce plan, or a self-hosted WordPress.org site, to embed the ApnaAI script.",
    },
    {
      question: "Can I show the chatbot only on specific WordPress pages?",
      answer:
        "Yes. Use a 'Custom HTML' block inside the WordPress block editor on the pages where you want the chat widget, instead of the global theme footer.",
    },
  ],
  content: `
## WordPress is the most popular CMS in India — your chatbot belongs there

WordPress powers more than 40% of all websites in India — small business sites, WooCommerce stores, coaching blogs, CA firm sites, restaurant pages. Adding a free AI chatbot to WordPress is the single highest-impact SEO and conversion move for most Indian small businesses.

This guide shows you how to install [ApnaAI](https://apnaai.online) on WordPress in 5 minutes — **no plugin, no coding, no paid plan needed beyond hosting**.

## Why no plugin is better

- No plugin conflict with your existing 15 plugins
- No plugin update breaking your chat widget every 3 months
- No performance drag — ApnaAI is one lightweight script
- No WordPress version compatibility anxiety
- One self-contained script, theme-independent

## Prerequisites

1. A self-hosted WordPress.org site OR WordPress.com Business / Commerce plan
2. Admin access to wp-admin
3. Your ApnaAI owner ID (free — get it at [apnaai.online](https://apnaai.online) → [login](/api/auth/login))
4. Your knowledge base pasted into ApnaAI dashboard (FAQs, prices, hours)

If you have not yet trained your bot, follow the [main setup guide](/blog/how-to-add-free-ai-chatbot-to-website) first.

## Method 1 — Theme footer (chatbot on every page, recommended)

This is the standard method. The chat bubble appears on every page of your WordPress site.

1. Login to **wp-admin**
2. Go to **Appearance → Theme File Editor** (or **Tools → Theme File Editor** on newer WordPress)
3. In the right sidebar, click **Theme Footer (footer.php)**
4. Just **before** the closing \`</body>\` tag, paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

5. Click **Update File**
6. Open any page of your site in a new browser tab
7. The floating chat bubble appears bottom-right — test a question

## Method 2 — Custom HTML block (chatbot on selected pages only)

If you want the chatbot only on Contact, Services or Pricing pages:

1. Open the page in **WordPress block editor (Gutenberg)**
2. Click the **+** block inserter
3. Search **Custom HTML** block and add it
4. Paste your ApnaAI script:

\`\`\`
<script src="https://apnaai.online/chatBot.js" data-owner-id="YOUR_OWNER_ID"></script>
\`\`\`

5. Click **Publish** or **Update**
6. View the page — chat bubble appears only on that page

## Method 3 — Header and Footer plugin (no theme file editing)

If you are not comfortable editing footer.php:

1. Install the free **WPCode** or **Insert Headers and Footers** plugin
2. Go to **Settings → Insert Headers and Footers** (or WPCode snippet area)
3. Paste your ApnaAI script in the **Footer** section
4. Save
5. Chat bubble appears site-wide

## WooCommerce stores — special note

For WooCommerce, use **Method 1** so the chatbot appears on shop, product, cart and checkout pages. Customers ask "is this in stock?" and "EMI options?" — answering instantly lifts conversion.

WooCommerce tip: train your ApnaAI knowledge base with shipping pincodes, COD rules, return policy and bestseller stock. See our [ecommerce chatbot guide](/blog/free-ai-chatbot-for-ecommerce-website).

## Replace YOUR_OWNER_ID with your real ID

Common mistake: copying the script above without replacing the placeholder. Your real owner ID is in the **Embed page** of your ApnaAI dashboard after login. It is tied to your authenticated session.

## Verify the chatbot is working

1. Open your live WordPress site in an incognito window
2. Click the floating chat bubble bottom-right
3. Type a test question — "What are your business hours?"
4. The bot replies in under 1 second
5. If no reply: check your knowledge base is saved in ApnaAI dashboard

## Common issues and fixes

### Chat bubble not appearing

- You pasted the script inside a \`<p>\` or \`<div>\` block — paste raw in Custom HTML block or footer.php
- WordPress.com free plan blocks JavaScript — upgrade to Business
- Caching plugin serving old HTML — clear **WP Rocket / W3 Total Cache / LiteSpeed Cache**

### Bot replies "Please contact our customer support"

- Your knowledge base in ApnaAI dashboard is empty — paste your FAQs and prices
- Your question is not covered — add the answer in the dashboard, test again

### Chat widget slow on mobile

- WordPress theme loads 10 plugins — disable unused plugins
- ApnaAI script itself is <20KB and loads in milliseconds — the bottleneck is your theme

## SEO benefits of adding chatbot to WordPress

- **Dwell time** up 30-60 seconds as visitors chat instead of bouncing
- **Pages per session** up as the bot links to relevant services
- **Lead capture** 24x7 — even at 11 PM when your office is closed
- **Lower support calls** — repetitive FAQs handled by the bot
- Google's Helpful Content signal — visitors stay and engage

## Mobile-first important

Most Indian WordPress traffic is mobile. ApnaAI chat widget is mobile-optimized — floating bubble, full-screen chat on phone, fast load on 4G. Test on real Android Chrome, not just desktop.

## Backup before editing footer.php

If you use Method 1, take a quick backup:

- **UpdraftPlus** plugin → Backup Now
- Or your hosting cPanel → File Manager → download footer.php

This protects you if you paste in the wrong place. Method 2 and 3 are non-destructive — no backup needed.

## Multi-site WordPress networks

If you run a multisite network (one WordPress, many subsites), each subsite needs its own ApnaAI owner ID and its own knowledge base. Paste each site's script in that site's theme footer.

## Caching and CDN setup

After installing the script:

- **Cloudflare / BunnyCDN** — no special config needed, ApnaAI loads from its own origin
- **WP Rocket** — add \`apnaai.online\` to " excluded JavaScript" if the bot loads but doesn't open
- **LiteSpeed Cache** — purge cache after install

## Page builders — Elementor, Divi, Brizy

If you use Elementor or Divi, use **Method 2** with a Custom HTML widget on the page, or **Method 1** with theme footer. Page builders do not block the ApnaAI script.

## Next steps after install

1. Train 15 FAQs in your ApnaAI knowledge base
2. Add industry template from our [niche guides](/blog) — restaurant, CA, clinic, gym, salon, real estate and 40+ more
3. Test on mobile Chrome
4. Share your site on WhatsApp status — "Now live with 24x7 chatbot"
5. Review missed questions weekly and update knowledge base

## Get started free

Open [ApnaAI](https://apnaai.online), [login](/api/auth/login), grab your owner ID and paste the script into your WordPress footer before dinner.

For the full setup walkthrough, see [How to add a free AI chatbot to your website](/blog/how-to-add-free-ai-chatbot-to-website).
`,
};
