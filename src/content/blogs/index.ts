import type { BlogPost } from "./types";
import { post as howToAdd } from "./how-to-add-free-ai-chatbot-to-website";
import { post as restaurant } from "./free-chatbot-for-restaurant-website";
import { post as coaching } from "./chatbot-for-coaching-institute-website";
import { post as ecommerce } from "./free-ai-chatbot-for-ecommerce-website";
import { post as realEstate } from "./chatbot-for-real-estate-website-india";
import { post as hospital } from "./chatbot-for-hospital-clinic-website-india";
import { post as bestFree } from "./best-free-ai-chatbot-small-business-india-2026";
import { post as smallBusiness } from "./ai-chatbot-for-small-business-india-free";
import { post as gym } from "./chatbot-for-gym-fitness-website-india";
import { post as salon } from "./chatbot-for-salon-parlour-website-india";

export const blogPosts: BlogPost[] = [
  howToAdd,
  restaurant,
  coaching,
  ecommerce,
  realEstate,
  hospital,
  bestFree,
  smallBusiness,
  gym,
  salon,
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.related
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));
}

export type { BlogPost, BlogFaq } from "./types";
