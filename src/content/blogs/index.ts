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

// New industry-specific blogs
import { post as pharmacy } from "./chatbot-for-pharmacy-medical-store-website-india";
import { post as ca } from "./chatbot-for-ca-chartered-accountant-website-india";
import { post as insurance } from "./chatbot-for-insurance-agent-website-india";
import { post as interiorDesigner } from "./chatbot-for-interior-designer-website-india";
import { post as photographer } from "./chatbot-for-photographer-website-india";
import { post as eventManagement } from "./chatbot-for-event-management-company-website-india";
import { post as vetPetClinic } from "./chatbot-for-vet-pet-clinic-website-india";
import { post as jewellery } from "./chatbot-for-jewellery-store-website-india";
import { post as bakery } from "./chatbot-for-bakery-cake-shop-website-india";
import { post as tiffin } from "./chatbot-for-tiffin-service-website-india";
import { post as grocery } from "./chatbot-for-grocery-supermarket-website-india";
import { post as mobileShop } from "./chatbot-for-mobile-shop-website-india";
import { post as tuition } from "./chatbot-for-tuition-teacher-website-india";
import { post as dance } from "./chatbot-for-dance-academy-website-india";
import { post as yoga } from "./chatbot-for-yoga-meditation-center-website-india";
import { post as spa } from "./chatbot-for-spa-massage-center-website-india";
import { post as makeup } from "./chatbot-for-makeup-artist-website-india";
import { post as catering } from "./chatbot-for-catering-service-website-india";
import { post as pathology } from "./chatbot-for-pathology-lab-website-india";
import { post as physio } from "./chatbot-for-physiotherapist-website-india";
import { post as astrologer } from "./chatbot-for-astrologer-website-india";
import { post as pgHostel } from "./chatbot-for-pg-hostel-website-india";
import { post as furniture } from "./chatbot-for-furniture-store-website-india";
import { post as stationery } from "./chatbot-for-stationery-bookshop-website-india";
import { post as florist } from "./chatbot-for-florist-gift-shop-website-india";

// New platform-integration blogs
import { post as wordpress } from "./add-free-ai-chatbot-to-wordpress-website";
import { post as shopify } from "./add-free-ai-chatbot-to-shopify-store";
import { post as wix } from "./add-free-ai-chatbot-to-wix-website";
import { post as html } from "./add-free-ai-chatbot-to-html-website";
import { post as blogger } from "./add-free-ai-chatbot-to-blogger-website";

export const blogPosts: BlogPost[] = [
  // Original guides
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

  // Industry-specific guides
  pharmacy,
  ca,
  insurance,
  interiorDesigner,
  photographer,
  eventManagement,
  vetPetClinic,
  jewellery,
  bakery,
  tiffin,
  grocery,
  mobileShop,
  tuition,
  dance,
  yoga,
  spa,
  makeup,
  catering,
  pathology,
  physio,
  astrologer,
  pgHostel,
  furniture,
  stationery,
  florist,

  // Platform-integration guides
  wordpress,
  shopify,
  wix,
  html,
  blogger,
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
