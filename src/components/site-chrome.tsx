import Link from "next/link";
import { ArrowUpRight } from "./icons";
import { SITE, WA_DEFAULT_MESSAGE, waLink } from "@/lib/site";

const links = [
  { href: "/vehicles", label: "Inventory" },
  { href: "/track", label: "Track shipment" },
  { href: "/engagements", label: "Engagements" },
  { href: "/#costs", label: "KRA duty" },
  { href: "/#how-it-works", label: "How it works" },
];

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.7-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.8 3.3.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.4Z" />
      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-cream">
            <span className="display text-lg leading-none">B</span>
          </span>
          <span className="leading-none">
            <span className="block text-[17px] font-bold tracking-[0.16em] text-forest">BANDARI</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.26em] text-ink/45">
              Auto imports · Kenya
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-ink/70 transition hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${SITE.phoneTel}`}
            className="text-[13px] font-semibold text-forest underline decoration-line decoration-2 underline-offset-4 hover:decoration-moss"
          >
            {SITE.phoneDisplay}
          </a>
          <a
            href={waLink(WA_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-2 text-[12px] font-semibold text-[#128C42] transition hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <Link href="/vehicles" className="btn-primary !px-4 !py-2.5 text-[13px]">
            Order a vehicle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-line bg-white text-forest [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-line bg-cream p-3 shadow-xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-sand"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waLink(WA_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#128C42] hover:bg-sand"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp {SITE.phoneDisplay}
            </a>
            <Link href="/vehicles" className="btn-primary mt-2 w-full text-[13px]">
              Order a vehicle
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-forest text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-forest">
              <span className="display text-lg leading-none">B</span>
            </span>
            <span className="text-[17px] font-bold tracking-[0.16em]">BANDARI</span>
          </div>
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-cream/65">
            Vehicle import desk for Kenya. We source, inspect, ship and clear your car — and show you
            every milestone, including the KRA duty, on the way.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-cream/55">
            <span className="rounded-full border border-cream/20 px-3 py-1">JEVIC / QISJ</span>
            <span className="rounded-full border border-cream/20 px-3 py-1">KEBS compliant</span>
            <span className="rounded-full border border-cream/20 px-3 py-1">NTSA registered</span>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/45">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-cream/75">
            <li><Link className="hover:text-white" href="/vehicles">All inventory</Link></li>
            <li><Link className="hover:text-white" href="/vehicles?body=SUV">SUVs &amp; 4x4s</Link></li>
            <li><Link className="hover:text-white" href="/vehicles?body=Pickup">Pickups</Link></li>
            <li><Link className="hover:text-white" href="/vehicles?body=Sedan">Sedans</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/45">Client desk</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-cream/75">
            <li><Link className="hover:text-white" href="/track">Track a shipment</Link></li>
            <li><Link className="hover:text-white" href="/engagements">Share an engagement</Link></li>
            <li><Link className="hover:text-white" href="/#costs">KRA CRSP duty calculator</Link></li>
            <li><Link className="hover:text-white" href="/#faq">FAQs</Link></li>
            <li><Link className="hover:text-white" href="/admin">Staff sign-in</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/45">Mombasa · Nairobi</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-cream/75">
            <li>{SITE.addressNairobi}</li>
            <li>{SITE.addressMombasa}</li>
            <li><a className="font-semibold hover:text-white" href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></li>
            <li><a className="hover:text-white" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <a
            href={waLink(WA_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1fb757]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
          <p className="mt-4 text-[11px] leading-relaxed text-cream/40">
            Open Mon–Fri 8:00–17:30, Sat 9:00–13:00 EAT
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-3 py-6 text-[11px] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bandari Auto Imports Ltd. All rights reserved.</p>
          <p>
            KRA figures follow the revised CRSP schedule and are indicative until confirmed on the
            customs assessment.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink(WA_DEFAULT_MESSAGE)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-[12.5px] font-semibold text-white shadow-[0_16px_32px_-12px_rgba(37,211,102,0.7)] transition hover:bg-[#1fb757]"
      aria-label={`WhatsApp us on ${SITE.phoneDisplay}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
    </a>
  );
}
