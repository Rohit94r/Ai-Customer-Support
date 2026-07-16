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
import { post as dentist } from "./chatbot-for-dentist-clinic-website-india";
import { post as hotel } from "./chatbot-for-hotel-website-india";
import { post as lawyer } from "./chatbot-for-lawyer-website-india";
import { post as travel } from "./chatbot-for-travel-agency-website-india";
import { post as education } from "./chatbot-for-education-website-india";
import { post as carDealership } from "./chatbot-for-car-dealership-website-india";
import { post as wedding } from "./chatbot-for-wedding-planner-website-india";
import { post as benefits } from "./benefits-ai-chatbot-small-business";
import { post as liveChat } from "./free-live-chat-widget-website";
import { post as customerService } from "./ai-chatbot-customer-service-benefits";

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
  dentist,
  hotel,
  lawyer,
  travel,
  education,
  carDealership,
  wedding,
  benefits,
  liveChat,
  customerService,
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
