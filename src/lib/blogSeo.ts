import type { Metadata } from "next";
import type { BlogPost } from "@/content/blogs/types";

const SITE = "https://apnaai.online";

export function postUrl(slug: string) {
  return `${SITE}/blog/${slug}`;
}

export function buildPostMetadata(post: BlogPost): Metadata {
  const url = postUrl(post.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: [post.keyword, ...post.tags, "ApnaAI", "free AI chatbot"],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "ApnaAI",
      locale: "en_IN",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [
        {
          url: `${SITE}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildFaqJsonLd(post: BlogPost) {
  if (!post.faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      name: "Rohit Jadhav",
      url: "https://www.rohitjadhav.online/",
    },
    publisher: {
      "@type": "Organization",
      name: "ApnaAI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/og-image.png`,
      },
    },
    mainEntityOfPage: postUrl(post.slug),
    isPartOf: {
      "@type": "Blog",
      name: "ApnaAI Blog",
      url: `${SITE}/blog`,
    },
    about: {
      "@type": "SoftwareApplication",
      name: "ApnaAI",
      url: SITE,
    },
    keywords: [post.keyword, ...post.tags].join(", "),
  };
}
