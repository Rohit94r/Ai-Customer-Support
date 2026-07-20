import type { Metadata } from "next";
import Link from "next/link";
import BlogShell from "@/components/BlogShell";
import { blogPosts } from "@/content/blogs";

export const metadata: Metadata = {
  title: "ApnaAI Blog — 50+ Free AI Chatbot Guides for Indian Small Businesses",
  description:
    "50+ practical guides on adding a free AI chatbot to your website — restaurants, ecommerce, coaching, clinics, real estate, dental, hotels, lawyers, travel, education, car dealerships, wedding planners, salons, gyms, pharmacy, CA, insurance, interior designer, photographer, event management, vet, jewellery, bakery, tiffin, grocery, mobile shop, tuition, dance, yoga, spa, makeup, catering, pathology, physio, astrologer, PG, furniture, stationery, florist, WordPress, Shopify, Wix, HTML, Blogger. Setup in minutes with ApnaAI.",
  alternates: { canonical: "https://apnaai.online/blog" },
  openGraph: {
    title: "ApnaAI Blog — 50+ Free AI Chatbot Guides for Indian Businesses",
    description:
      "50+ industry-specific guides on how to add a free AI chatbot to your website. Tutorials for Indian small businesses across 40+ niches and 5 website platforms.",
    url: "https://apnaai.online/blog",
    siteName: "ApnaAI",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApnaAI Blog — 50+ Free AI Chatbot Guides",
    description:
      "50+ industry-specific guides to add a free AI chatbot to your Indian small business website.",
    images: ["https://apnaai.online/og-image.png"],
  },
  robots: { index: true, follow: true },
  keywords: [
    "AI chatbot guide",
    "free chatbot India",
    "chatbot for small business",
    "restaurant chatbot",
    "ecommerce chatbot",
    "coaching chatbot",
    "clinic chatbot",
    "real estate chatbot",
    "dental chatbot",
    "hotel chatbot",
    "lawyer chatbot",
    "travel chatbot",
    "education chatbot",
    "car dealership chatbot",
    "wedding planner chatbot",
    "salon chatbot",
    "gym chatbot",
    "pharmacy chatbot",
    "CA chatbot",
    "insurance chatbot",
    "interior designer chatbot",
    "photographer chatbot",
    "event management chatbot",
    "vet chatbot",
    "jewellery chatbot",
    "bakery chatbot",
    "tiffin service chatbot",
    "grocery chatbot",
    "mobile shop chatbot",
    "tuition chatbot",
    "dance academy chatbot",
    "yoga center chatbot",
    "spa chatbot",
    "makeup artist chatbot",
    "catering chatbot",
    "pathology lab chatbot",
    "physiotherapist chatbot",
    "astrologer chatbot",
    "PG hostel chatbot",
    "furniture chatbot",
    "stationery chatbot",
    "florist chatbot",
    "WordPress chatbot",
    "Shopify chatbot",
    "Wix chatbot",
    "HTML chatbot",
    "Blogger chatbot",
  ],
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BlogStructuredData() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ApnaAI Blog — 50+ Free AI Chatbot Guides for Indian Small Businesses",
    description:
      "50+ practical guides on adding a free AI chatbot to websites for Indian small businesses across 40+ industries and 5 website platforms.",
    url: "https://apnaai.online/blog",
    about: {
      "@type": "Thing",
      name: "AI Chatbot for Small Business",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
    />
  );
}

export default function BlogIndexPage() {
  return (
    <BlogShell>
      <BlogStructuredData />
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            ApnaAI Blog
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Free AI chatbot guides for Indian websites
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            Practical, no-jargon tutorials so shop owners, coaches, clinics, and
            local businesses can add a{" "}
            <Link href="/" className="underline underline-offset-2">
              free ApnaAI chatbot
            </Link>{" "}
            in minutes. {blogPosts.length}+ industry-specific guides available — covering 40+ niches and 5 website platforms (WordPress, Shopify, Wix, HTML, Blogger).
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl divide-y divide-zinc-200 border-t border-zinc-200">
          {blogPosts.map((post) => (
            <article key={post.slug} className="py-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline underline-offset-2"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-zinc-600 leading-relaxed">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900"
              >
                Read guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center">
          <p className="text-lg font-semibold text-zinc-900">
            Ready to embed your free chatbot?
          </p>
          <p className="mt-2 text-zinc-600">
            Train ApnaAI on your FAQs and go live in under 5 minutes.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/api/auth/login"
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Get free chatbot
            </a>
            <Link
              href="/"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Visit homepage
            </Link>
          </div>
        </div>
      </section>
    </BlogShell>
  );
}
