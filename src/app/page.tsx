import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/getSession";

export const metadata: Metadata = {
  title: "Free AI Chatbot for Website — Embed in 2 Minutes",
  description:
    "Need a chatbot for your website? ApnaAI is 100% free — train on your FAQs, embed with one script tag, and answer customers 24/7 on WordPress, Shopify, or any site.",
  alternates: { canonical: "https://apnaai.online" },
  openGraph: {
    title: "ApnaAI — Free AI Chatbot for Your Website",
    description: "100% free AI customer support chatbot. Live in 2 minutes. No coding.",
    url: "https://apnaai.online",
  },
};

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <HomeClient email={session?.user?.email ?? undefined} />
    </>
  );
}
