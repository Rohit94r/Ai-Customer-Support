import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ApnaAI — Free AI Chatbot for Website | Setup in 2 Minutes",
    template: "%s | ApnaAI",
  },
  description:
    "ApnaAI is a free AI customer support chatbot for any website. Embed in 2 minutes on WordPress, Shopify, or HTML. 24/7 answers trained on your business — no coding required.",
  applicationName: "ApnaAI",
  authors: [{ name: "Rohit Jadhav", url: "https://www.rohitjadhav.online/" }],
  creator: "Rohit Jadhav",
  publisher: "ApnaAI",
  category: "technology",
  keywords: [
    "free AI chatbot",
    "chatbot for website",
    "AI customer support",
    "website chatbot free",
    "embed chatbot",
    "no code chatbot",
    "apnaai",
    "apna ai chatbot",
    "customer service chatbot",
    "wordpress chatbot plugin free",
    "shopify chatbot",
    "india ai chatbot",
    "saas chatbot widget",
    "24/7 customer support bot",
    "llama chatbot for business",
  ],
  metadataBase: new URL("https://apnaai.online"),
  alternates: {
    canonical: "https://apnaai.online",
  },
  openGraph: {
    title: "ApnaAI — Free AI Chatbot for Your Website",
    description:
      "Add a free AI chatbot to your site in 2 minutes. Train it on your FAQs, pricing, and policies. Instant 24/7 customer support.",
    url: "https://apnaai.online",
    siteName: "ApnaAI",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://apnaai.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApnaAI - Free AI Chatbot for Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApnaAI — Free AI Chatbot for Websites",
    description: "Free AI customer support chatbot — embed on any website in 2 minutes. No coding.",
    images: ["https://apnaai.online/og-image.png"],
    creator: "@RohitJadhav9409",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN",
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ApnaAI",
    url: "https://apnaai.online",
    description:
      "Free AI customer support chatbot for websites. Embed in minutes without coding.",
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: "ApnaAI" },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ApnaAI",
    url: "https://apnaai.online",
    description:
      "Free AI-powered customer support chatbot you can embed on any website in minutes. No coding required.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    creator: {
      "@type": "Person",
      name: "Rohit Jadhav",
      url: "https://www.rohitjadhav.online/",
      sameAs: [
        "https://www.linkedin.com/in/rohit-jadhav94/",
        "https://github.com/Rohit94r",
        "https://x.com/RohitJadhav9409",
        "https://www.instagram.com/dev.by.rohit/",
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ApnaAI",
    url: "https://apnaai.online",
    logo: "https://apnaai.online/og-image.png",
    contactPoint: {
      "@type": "ContactPoint",
      email: "rjdhav67@gmail.com",
      contactType: "customer support",
    },
    sameAs: [
      "https://github.com/Rohit94r/Ai-Customer-Support",
      "https://www.linkedin.com/in/rohit-jadhav94/",
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1Q914T23PR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1Q914T23PR');
          `}
        </Script>
        <Script
          src={`${appUrl}/chatBot.js`}
          data-owner-id="usr_116307440923836418"
          strategy="lazyOnload"
        />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="f63efa30-2ceb-4765-ad64-0b473d28280b"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
