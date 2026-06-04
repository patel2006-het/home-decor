"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-cream/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            H
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-stone-900">
            Haven<span className="text-brand-600">Decor</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-brand-700"
          >
            Sign in
          </a>
          <Link
            href="/select-room"
            className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            Start Designing
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-stone-700 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-stone-200/80 bg-cream md:hidden ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 flex flex-col gap-2 border-t border-stone-200 pt-4">
            <a
              href="#"
              className="rounded-full px-3 py-2.5 text-center text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Sign in
            </a>
            <Link
              href="/select-room"
              className="rounded-full bg-brand-700 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-800"
              onClick={() => setMenuOpen(false)}
            >
              Start Designing
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
