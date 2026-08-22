import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconLayers,
  IconLock,
  IconBolt,
  IconShield,
  IconUsers,
  IconClipboard,
  IconBox,
  IconAlert,
  IconChart,
  IconCheck,
  IconMenu,
  IconX,
} from "../utils/helpers"; // ← adjust to wherever your icons actually live

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

/* ------------------------------------ Kicker ------------------------------------ */
/* Small uppercase label used above every section heading — the recurring
   typographic motif that ties the page together. */
function Kicker({ children, color = "#34D1BF" }) {
  return (
    <p className={`${FONT_MONO} flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] sm:text-xs`} style={{ color }}>
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </p>
  );
}

const TOTAL_STOCK = 5;

function useFlashSaleSim() {
  const [stock, setStock] = useState(TOTAL_STOCK);
  const [reqCount, setReqCount] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setReqCount((r) => r + Math.floor(Math.random() * 180) + 60);
      setStock((s) => (s > 0 ? s - 1 : s));
    }, 900);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (stock === 0 && !locked) {
      setLocked(true);
      const reset = setTimeout(() => {
        setStock(TOTAL_STOCK);
        setReqCount(0);
        setLocked(false);
      }, 3200);
      return () => clearTimeout(reset);
    }
  }, [stock, locked]);

  return { stock, reqCount, locked };
}

/* ----------------------------------- Nav ----------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = ["Features", "Roles", "How it works", "Trust"];

  return (
    <header className="sticky top-0 z-50 border-b border-[#232A38] bg-[#0B0E14]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#2A3244] bg-[#131720] text-[#34D1BF]">
            <IconLayers className="h-4 w-4" />
          </span>
          <span className={`${FONT_DISPLAY} text-base font-semibold tracking-tight text-[#E8EAED] sm:text-[17px]`}>
            StockXpress
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[#8B93A1] transition-colors hover:text-[#E8EAED]"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm text-[#8B93A1] transition-colors hover:text-[#E8EAED]">
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#232A38] text-[#E8EAED] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#232A38] bg-[#0B0E14] px-4 pb-5 pt-2 sm:px-6 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-[#8B93A1] hover:bg-[#131720] hover:text-[#E8EAED]"
              >
                {l}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#232A38] pt-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-center text-sm text-[#8B93A1] hover:bg-[#131720] hover:text-[#E8EAED]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-md bg-[#FF6B1A] px-4 py-2.5 text-center text-sm font-medium text-[#0B0E14]"
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ------------------------------- Hero + live demo ------------------------------- */

function FlashSaleSimulator() {
  const { stock, reqCount, locked } = useFlashSaleSim();
  const filled = TOTAL_STOCK - stock;

  return (
    <div className="w-full max-w-sm rounded-xl border border-[#232A38] bg-[#131720] p-5 sm:max-w-md sm:p-6">
      <div className="flex items-center justify-between border-b border-[#232A38] pb-4">
        <div>
          <p className={`${FONT_MONO} text-[10px] uppercase tracking-[0.18em] text-[#8B93A1] sm:text-[11px]`}>Live demand</p>
          <p className="mt-1 text-sm font-medium text-[#E8EAED]">Wireless Earbuds — Flash Deal</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${FONT_MONO} ${
            locked
              ? "border-[#34D1BF]/30 bg-[#34D1BF]/10 text-[#34D1BF]"
              : "border-[#FF6B1A]/30 bg-[#FF6B1A]/10 text-[#FF6B1A]"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-[#34D1BF]" : "bg-[#FF6B1A]"} animate-pulse`} />
          {locked ? "SOLD OUT · SAFE" : "SELLING"}
        </span>
      </div>

      <div className="py-5">
        <div className="flex items-end justify-between">
          <span className={`${FONT_MONO} text-4xl font-medium text-[#E8EAED] sm:text-5xl`}>{stock}</span>
          <span className={`${FONT_MONO} text-xs text-[#8B93A1] sm:text-sm`}>/ {TOTAL_STOCK} left</span>
        </div>

        <div className="mt-4 flex h-2 gap-1">
          {Array.from({ length: TOTAL_STOCK }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors duration-500 ${
                i < filled ? "bg-[#232A38]" : "bg-[#34D1BF]"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#232A38] bg-[#0B0E14] px-3.5 py-3 sm:px-4">
          <div className="flex items-center gap-2 text-[#8B93A1]">
            <IconBolt className="h-4 w-4 shrink-0 text-[#FF6B1A]" />
            <span className="text-xs">Shoppers checking out right now</span>
          </div>
          <span className={`${FONT_MONO} shrink-0 text-sm text-[#E8EAED]`}>{reqCount.toLocaleString()}</span>
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-[#8B93A1]">
          <IconLock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34D1BF]" />
          <span>Every last unit is protected — nobody ever checks out with stock that isn't really there.</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#8B93A1 1px, transparent 1px), linear-gradient(90deg, #8B93A1 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
        <div>
          <Kicker>For growing warehouses &amp; storefronts</Kicker>

          <h1 className={`${FONT_DISPLAY} mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-[#E8EAED] sm:text-4xl sm:leading-[1.1] lg:text-[3.75rem] lg:leading-[1.06]`}>
            Stock that <span className="text-[#34D1BF]">never lies</span>,
            <br className="hidden sm:block" /> no matter how busy it gets.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#8B93A1] sm:mt-6 sm:text-lg">
            StockXpress keeps your inventory accurate, your team in sync, and every order traceable —
            from the first unit on the shelf to the last one sold.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              to="/register"
              className="rounded-md bg-[#FF6B1A] px-6 py-3 text-center text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
            >
              Start free — create account
            </Link>
            <a
              href="#how-it-works"
              className="rounded-md border border-[#232A38] px-6 py-3 text-center text-sm font-medium text-[#E8EAED] transition-colors hover:bg-[#131720]"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <FlashSaleSimulator />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Stats strip --------------------------------- */

function StatsBar() {
  const stats = [
    { value: "13", label: "actions built for shoppers" },
    { value: "17", label: "tools for warehouse teams" },
    { value: "30", label: "controls for admins" },
    { value: "0", label: "oversells, even at peak demand" },
  ];
  return (
    <section className="border-y border-[#232A38] bg-[#0F131B]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-9 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label}>
            <p className={`${FONT_MONO} text-xl font-medium text-[#34D1BF] sm:text-2xl lg:text-3xl`}>{s.value}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-[#8B93A1] sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Features ---------------------------------- */

function Features() {
  const items = [
    {
      icon: IconLock,
      title: "Never oversell again",
      desc: "The moment stock hits zero, checkout stops instantly — even if a thousand people are buying at once.",
    },
    {
      icon: IconBolt,
      title: "Built for busy days",
      desc: "Sales, restocks, and returns keep moving smoothly, no matter how many people touch inventory at the same time.",
    },
    {
      icon: IconClipboard,
      title: "Order lifecycle, end to end",
      desc: "From placed to packed to delivered — status and payment stay updated and visible at every step.",
    },
    {
      icon: IconUsers,
      title: "Role-based team access",
      desc: "Customers, warehouse staff, and admins each see exactly what they need — nothing more, nothing less.",
    },
    {
      icon: IconAlert,
      title: "Low-stock alerts",
      desc: "Know before you run out. Products approaching zero surface automatically, so restocking is never a surprise.",
    },
    {
      icon: IconShield,
      title: "Secure by default",
      desc: "Every account, session, and password is protected using industry-standard safeguards, out of the box.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="max-w-xl">
        <Kicker>Features</Kicker>
        <h2 className={`${FONT_DISPLAY} mt-3 text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-3xl lg:text-4xl`}>
          Everything your inventory needs
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#8B93A1] sm:text-base">
          One platform to track stock, manage your team, and keep every order honest.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-xl border border-[#232A38] bg-[#131720] p-5 transition-all hover:-translate-y-1 hover:border-[#2A3244] sm:p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#232A38] bg-[#0B0E14] text-[#34D1BF]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className={`${FONT_DISPLAY} mt-4 text-base font-semibold tracking-tight text-[#E8EAED]`}>{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#8B93A1]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- Roles ----------------------------------- */

function Roles() {
  const roles = [
    {
      name: "Customer",
      tag: "Shop with confidence",
      count: "13 actions",
      abilities: ["Browse & filter by category", "Place & track orders", "Cancel orders anytime", "Full order history"],
    },
    {
      name: "Warehouse Manager",
      tag: "Keep shelves accurate",
      count: "17 tools",
      abilities: ["Update stock — single or bulk", "Manage every order's status", "Automatic low-stock detection", "Full inventory change history"],
      highlight: true,
    },
    {
      name: "Admin",
      tag: "See the whole picture",
      count: "30 controls",
      abilities: ["Full product catalog control", "Team & role management", "Revenue & order analytics", "Complete audit visibility"],
    },
  ];

  return (
    <section id="roles" className="border-t border-[#232A38] bg-[#0F131B]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <Kicker color="#FF6B1A">Roles &amp; access</Kicker>
          <h2 className={`${FONT_DISPLAY} mt-3 text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-3xl lg:text-4xl`}>
            The right access for everyone
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8B93A1] sm:text-base">
            Three roles, one platform — everyone sees exactly what their job needs.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <div
              key={r.name}
              className={`rounded-xl border p-5 sm:p-6 ${
                r.highlight ? "border-[#FF6B1A]/40 bg-[#131720]" : "border-[#232A38] bg-[#131720]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-[11px] uppercase tracking-[0.12em] ${r.highlight ? "text-[#FF6B1A]" : "text-[#8B93A1]"}`}>
                    {r.tag}
                  </p>
                  <h3 className={`${FONT_DISPLAY} mt-2 text-lg font-semibold tracking-tight text-[#E8EAED]`}>{r.name}</h3>
                </div>
                <span className={`${FONT_MONO} shrink-0 rounded-full border border-[#232A38] bg-[#0B0E14] px-2.5 py-1 text-[11px] text-[#8B93A1]`}>
                  {r.count}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {r.abilities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-[#8B93A1]">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34D1BF]" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ Flow ------------------------------------ */

function Flow() {
  const steps = [
    { id: "01", title: "Create your account", desc: "Sign up in seconds — no setup headaches, no waiting." },
    { id: "02", title: "Bring in your team", desc: "Invite warehouse staff and admins with the right access from day one." },
    { id: "03", title: "List your products", desc: "Add inventory and watch stock levels stay accurate automatically." },
    { id: "04", title: "Sell with confidence", desc: "Every order checks real stock in real time — no oversells, ever." },
    { id: "05", title: "Review the ledger", desc: "See exactly what changed, when, and who did it — always." },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="max-w-xl">
        <Kicker>Getting started</Kicker>
        <h2 className={`${FONT_DISPLAY} mt-3 text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-3xl lg:text-4xl`}>
          Up and running in minutes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#8B93A1] sm:text-base">
          The same simple flow, whether it's one order or ten thousand.
        </p>
      </div>

      <div className="relative mt-10 sm:mt-12">
        <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-[#232A38] sm:block" />
        <ol className="space-y-5 sm:space-y-6">
          {steps.map((s) => (
            <li key={s.id} className="relative flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-6">
              <span
                className={`${FONT_MONO} relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#232A38] bg-[#0F131B] text-sm text-[#34D1BF]`}
              >
                {s.id}
              </span>
              <div className="sm:pt-1.5">
                <h3 className={`${FONT_DISPLAY} text-base font-semibold tracking-tight text-[#E8EAED]`}>{s.title}</h3>
                <p className="mt-1 text-sm text-[#8B93A1]">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------- Trust strip ---------------------------------- */

function TrustStrip() {
  const badges = [
    { icon: IconLock, label: "Encrypted passwords" },
    { icon: IconShield, label: "Protected sessions" },
    { icon: IconClipboard, label: "Traceable actions" },
    { icon: IconUsers, label: "Controlled access" },
    { icon: IconChart, label: "Transparent reporting" },
    { icon: IconBox, label: "Accurate stock, always" },
  ];
  return (
    <section id="trust" className="border-y border-[#232A38] bg-[#0F131B]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <Kicker color="#FF6B1A">Trusted from day one</Kicker>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-6">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-[#232A38] bg-[#131720] px-3 py-2 text-xs text-[#E8EAED]"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#34D1BF]" />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------- CTA ------------------------------------- */

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="rounded-2xl border border-[#232A38] bg-gradient-to-br from-[#131720] to-[#0F131B] px-5 py-12 text-center sm:px-10 sm:py-14 lg:px-12">
        <h2 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-3xl lg:text-4xl`}>
          Ready to stop guessing your stock?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#8B93A1] sm:text-base">
          Create your workspace, bring in your team, and see accurate inventory from day one.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
          <Link
            to="/register"
            className="rounded-md bg-[#FF6B1A] px-6 py-3 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-[#232A38] px-6 py-3 text-sm font-medium text-[#E8EAED] transition-colors hover:bg-[#131720]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ Footer ------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-[#232A38]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-7 sm:flex-row sm:gap-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#232A38] bg-[#131720] text-[#34D1BF]">
            <IconLayers className="h-3.5 w-3.5" />
          </span>
          <span className={`${FONT_DISPLAY} text-sm font-semibold tracking-tight text-[#E8EAED]`}>StockXpress</span>
        </div>
        <p className="text-center text-xs text-[#8B93A1]">
          © {new Date().getFullYear()} StockXpress. Built for teams who can't afford to guess.
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------ Page ------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-[#E8EAED] antialiased">
      <Nav />
      <Hero />
      <StatsBar />
      <Features />
      <Roles />
      <Flow />
      <TrustStrip />
      <CTA />
      <Footer />
    </div>
  );
}