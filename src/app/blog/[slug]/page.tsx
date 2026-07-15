import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import MarkdownContent from "@/components/MarkdownContent";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/content/blogs";
import {
  buildArticleJsonLd,
  buildFaqJsonLd,
  buildPostMetadata,
} from "@/lib/blogSeo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return buildPostMetadata(post);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const articleLd = buildArticleJsonLd(post);
  const faqLd = buildFaqJsonLd(post);

  return (
    <BlogShell>
      <article className="px-6 pt-14 pb-8">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-zinc-500">
            <Link href="/blog" className="hover:text-zinc-900">
              Blog
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-zinc-700 line-clamp-1">{post.keyword}</span>
          </nav>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl md:leading-tight">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
            {post.updated ? (
              <>
                <span aria-hidden>·</span>
                <span>Updated {formatDate(post.updated)}</span>
              </>
            ) : null}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            {post.description}
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-900 px-5 py-5 text-white">
            <p className="font-medium">
              Want this on your website today?
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              Train ApnaAI on your FAQs and embed a free chatbot in minutes.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/api/auth/login"
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                Get free chatbot
              </a>
              <a
                href="https://apnaai.online"
                className="rounded-full border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:border-zinc-400"
              >
                apnaai.online
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-2">
            <MarkdownContent content={post.content} />
          </div>

          {post.faqs.length > 0 ? (
            <section className="mt-14 border-t border-zinc-200 pt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Frequently asked questions
              </h2>
              <dl className="mt-6 space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold text-zinc-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 leading-relaxed text-zinc-700">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-14 border-t border-zinc-200 pt-10">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Related guides
              </h2>
              <ul className="mt-5 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="font-medium text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-14 mb-8 rounded-2xl border border-zinc-200 bg-white px-6 py-8 text-center">
            <h2 className="text-xl font-semibold text-zinc-900">
              Get your free ApnaAI chatbot
            </h2>
            <p className="mt-2 text-zinc-600">
              Sign in, paste your knowledge base, embed one script — done.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href="/api/auth/login"
                className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Login & start free
              </a>
              <Link
                href="/blog"
                className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                More blog posts
              </Link>
            </div>
          </section>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
    </BlogShell>
  );
}
