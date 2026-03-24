import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApnaAI — Free AI Chatbot for Your Website | Embed in 1 Minute",
  description: "ApnaAI is a free AI-powered customer support chatbot you can embed on any website in minutes. No coding required. Add a smart chatbot to your website today and provide 24/7 instant support to your customers.",
  keywords: [
    "apnaai",
    "apna ai",
    "free chatbot",
    "free AI chatbot",
    "chatbot for website",
    "add chatbot to website",
    "embed chatbot",
    "AI customer support",
    "free customer support chatbot",
    "how to add chatbot in website",
    "website chatbot free",
    "AI chatbot embed",
    "customer support AI",
    "chatbot widget",
    "free chatbot builder",
  ],
  metadataBase: new URL("https://apnaai.online"),
  alternates: {
    canonical: "https://apnaai.online",
  },
  openGraph: {
    title: "ApnaAI — Free AI Chatbot for Your Website",
    description: "Embed a smart AI chatbot on any website in 1 minute. Free, no coding required. Provide 24/7 customer support powered by AI.",
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
    title: "ApnaAI — Free AI Chatbot for Your Website",
    description: "Embed a smart AI chatbot on any website in 1 minute. Free, no coding required.",
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
          src="https://apnaai.online/chatBot.js"
          data-owner-id="usr_116307440923836418"
        ></script>
      </body>
    </html>
  );
}
