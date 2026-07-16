import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/getSession";

export const metadata: Metadata = {
  title: "Free AI Chatbot for Website — Embed in 2 Minutes | ApnaAI",
  description:
    "Need a chatbot for your website? ApnaAI is 100% free — train on your FAQs, embed with one script tag, and answer customers 24/7 on WordPress, Shopify, or any site. Used by restaurants, clinics, coaching institutes, salons, hotels, and more.",
  alternates: { canonical: "https://apnaai.online" },
  openGraph: {
    title: "ApnaAI — Free AI Chatbot for Your Website",
    description: "100% free AI customer support chatbot for Indian small businesses. Live in 2 minutes. No coding required.",
    url: "https://apnaai.online",
    siteName: "ApnaAI",
    locale: "en_IN",
    type: "website",
  },
  keywords: [
    "free AI chatbot",
    "chatbot for website",
    "AI customer support India",
    "free chatbot for small business",
    "website chatbot no code",
  ],
};

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <HomeClient email={session?.user?.email ?? undefined} />
    </>
  );
}
