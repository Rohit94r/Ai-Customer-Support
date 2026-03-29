import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <script
          src={`${appUrl}/chatBot.js`}
          data-owner-id="usr_116307440923836418"
        ></script>
      </body>
    </html>
  );
}
