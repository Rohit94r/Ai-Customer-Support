import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export default function BlogShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Apna <span className="text-zinc-400">AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/blog"
              className="hidden text-zinc-600 hover:text-zinc-900 sm:inline"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-zinc-600 hover:text-zinc-900"
            >
              Home
            </Link>
            <a
              href="/api/auth/login"
              className="rounded-full bg-black px-4 py-2 font-medium text-white transition hover:bg-zinc-800"
            >
              Get free chatbot
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
