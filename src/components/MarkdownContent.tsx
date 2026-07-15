import Link from "next/link";
import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\)|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-zinc-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const label = match[2];
      const href = match[3];
      const external = href.startsWith("http");
      if (external) {
        nodes.push(
          <a
            key={`${keyPrefix}-a-${i}`}
            href={href}
            className="text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        );
      } else {
        nodes.push(
          <Link
            key={`${keyPrefix}-a-${i}`}
            href={href}
            className="text-zinc-900 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-900"
          >
            {label}
          </Link>
        );
      }
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.9em] font-mono text-zinc-800"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = match.index + token.length;
    i += 1;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function slugify(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={key++}
          className="my-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm text-zinc-100"
        >
          <code className={lang ? `language-${lang}` : undefined}>
            {codeLines.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      blocks.push(
        <h3
          key={key++}
          id={slugify(text)}
          className="mt-10 mb-3 text-xl font-semibold tracking-tight text-zinc-900"
        >
          {text}
        </h3>
      );
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push(
        <h2
          key={key++}
          id={slugify(text)}
          className="mt-12 mb-4 text-2xl font-bold tracking-tight text-zinc-900 scroll-mt-24"
        >
          {text}
        </h2>
      );
      i += 1;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i += 1;
      }
      blocks.push(
        <ul key={key++} className="my-5 list-disc space-y-2 pl-6 text-zinc-700">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ul-${key}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i += 1;
      }
      blocks.push(
        <ol key={key++} className="my-5 list-decimal space-y-2 pl-6 text-zinc-700">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item, `ol-${key}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-6 border-l-4 border-zinc-900 bg-zinc-50 px-5 py-4 text-zinc-700"
        >
          {quoteLines.map((q, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderInline(q, `q-${key}-${idx}`)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith("> ")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={key++} className="my-4 text-[1.05rem] leading-8 text-zinc-700">
        {renderInline(para.join(" "), `p-${key}`)}
      </p>
    );
  }

  return <div className="blog-prose">{blocks}</div>;
}
