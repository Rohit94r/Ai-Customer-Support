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
  title: "Free AI Chatbot for Website | ApnaAI - Setup in 2 Minutes",
  description: "Add a free AI-powered chatbot to your website in 2 minutes. No coding required. Works on WordPress, Shopify, and any website.",
  keywords: [
    "free AI chatbot",
    "chatbot for website",
    "customer support AI",
    "website chatbot",
    "no code chatbot",
    "apnaai",
    "AI customer service bot",
    "embed chatbot on wordpress",
    "free website widget"
  ],
  metadataBase: new URL("https://apnaai.online"),
  alternates: {
    canonical: "https://apnaai.online",
  },
  openGraph: {
    title: "Free AI Chatbot for Your Website | ApnaAI",
    description: "Get a free AI chatbot live in 2 minutes - no coding needed. Provide 24/7 customer support powered by AI.",
    url: "https://apnaai.online",
    siteName: "ApnaAI",
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
    title: "Free AI Chatbot for Your Website | ApnaAI",
    description: "Get a free AI chatbot live in 2 minutes - no coding needed. Provide 24/7 customer support.",
    images: ["https://apnaai.online/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1Q914T23PR"
        strategy="beforeInteractive"
      />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-1Q914T23PR');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ApnaAI",
              url: "https://apnaai.online",
              description: "Free AI-powered customer support chatbot you can embed on any website in minutes. No coding required.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Person",
                name: "Rohit",
              },
            }),
          }}
        />
        <Script
          src={`${appUrl}/chatBot.js`}
          data-owner-id="usr_116307440923836418"
          strategy="afterInteractive"
        />
        <Script 
          src="https://cloud.umami.is/script.js" 
          data-website-id="f63efa30-2ceb-4765-ad64-0b473d28280b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
