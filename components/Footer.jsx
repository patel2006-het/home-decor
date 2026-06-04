import Link from "next/link";
import { footerLinks } from "@/lib/data";

const linkGroups = [
  { title: "Shop", links: footerLinks.shop },
  { title: "Company", links: footerLinks.company },
  { title: "Support", links: footerLinks.support },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
                aria-hidden="true"
              >
                H
              </span>
              <span className="font-display text-xl font-medium text-white">
                Haven<span className="text-brand-400">Decor</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Thoughtful home decor for every room and style. Quality pieces,
              expert guidance, and inspiration delivered to your door.
            </p>
            <form className="mt-6 flex max-w-md gap-2" action="#" method="post">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-full border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
              >
                Subscribe
              </button>
            </form>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-stone-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 sm:flex-row">
          <p className="text-sm text-stone-500">
            © {year} HavenDecor. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-stone-500 transition-colors hover:text-white"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
