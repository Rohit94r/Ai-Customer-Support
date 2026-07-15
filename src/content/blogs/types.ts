export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  date: string;
  updated?: string;
  readingMinutes: number;
  tags: string[];
  related: string[];
  faqs: BlogFaq[];
  /** Markdown body (H2/H3, lists, paragraphs, links, bold) */
  content: string;
};
