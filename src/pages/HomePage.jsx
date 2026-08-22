import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/adminApi";
import Loader from "../components/common/Loader";
import {
  IconLayers,
  IconBox,
  IconClipboard,
  IconUsers,
  IconRupee,
  IconClock,
  IconAlert,
  IconArrowRight,
  IconBag,
  greeting,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

/* --------------------------------- Role config --------------------------------- */

// Role badge colors stay fixed — these are already used across the Navbar/Sidebar,
// so they identify "who you are" consistently everywhere in the app.
const ROLE_STYLES = {
  ADMIN: {
    label: "Admin",
    color: "#FF6B1A",
    bg: "bg-[#FF6B1A]/10",
    border: "border-[#FF6B1A]/30",
    subtitle: "Here's the full picture — sales, stock, and your team, all in one place.",
  },
  WAREHOUSE_MANAGER: {
    label: "Warehouse Manager",
    color: "#34D1BF",
    bg: "bg-[#34D1BF]/10",
    border: "border-[#34D1BF]/30",
    subtitle: "Keep the shelves accurate — update stock and manage orders from here.",
  },
  CUSTOMER: {
    label: "Customer",
    color: "#5B8DEF",
    bg: "bg-[#5B8DEF]/10",
    border: "border-[#5B8DEF]/30",
    subtitle: "Pick up where you left off, or see what's new in stock.",
  },
};

// Beyond the role colors, each *type of data* gets its own distinct hue —
// this is what gives the dashboard its variety, the way a marketplace uses
// different colors per category, but tuned to sit on our dark ledger base.
const ACCENT = {
  revenue: "#34D1BF", // teal   — money / positive
  users: "#A78BFA", // violet — people
  products: "#4ADE80", // green  — stock / inventory
  orders: "#F472B6", // pink   — transactions
  pending: "#FBBF24", // amber  — needs action soon
  lowStock: "#FB7185", // rose   — needs action now
};

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
});

/* ------------------------------------ Kicker ------------------------------------ */

function Kicker({ children, color = "#34D1BF" }) {
  return (
    <p
      className={`${FONT_MONO} flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]`}
      style={{ color }}
    >
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </p>
  );
}

/* ----------------------------------- Pieces ----------------------------------- */

const StatCard = ({ label, value, icon: Icon, color = "#5B8DEF", to, tint = false }) => {
  const content = (
    <div
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border p-5 pt-[22px] transition-all hover:-translate-y-0.5"
      style={
        tint
          ? { backgroundColor: `${color}12`, borderColor: `${color}35` }
          : { backgroundColor: "#131720", borderColor: "#232A38" }
      }
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border"
        style={{ color, borderColor: `${color}45`, backgroundColor: `${color}1A` }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#8B93A1]">{label}</p>
        <p className={`${FONT_MONO} mt-0.5 truncate text-xl font-medium text-[#E8EAED]`}>{value}</p>
      </div>
      {to && (
        <IconArrowRight className="h-4 w-4 shrink-0 text-[#8B93A1] opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const RevenueBanner = ({ value }) => (
  <div className="relative overflow-hidden rounded-xl border border-[#34D1BF]/25 bg-gradient-to-br from-[#131720] to-[#0F1B19] p-6 pt-[26px] sm:p-7 sm:pt-[30px]">
    <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT.revenue }} />
    <div
      className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20 blur-3xl"
      style={{ backgroundColor: "#34D1BF" }}
    />
    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs text-[#8B93A1]">Total revenue</p>
        <p className={`${FONT_MONO} mt-2 text-4xl font-semibold text-[#E8EAED] sm:text-5xl`}>{value}</p>
      </div>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-lg border border-[#34D1BF]/40 bg-[#34D1BF]/10 text-[#34D1BF] sm:self-end">
        <IconRupee className="h-6 w-6" />
      </span>
    </div>
  </div>
);

const ActionCard = ({ title, desc, icon: Icon, color, to, featured = false }) => (
  <Link
    to={to}
    className="group relative flex items-start justify-between gap-4 overflow-hidden rounded-xl border p-6 pt-[26px] transition-all hover:-translate-y-0.5"
    style={
      featured
        ? { background: `linear-gradient(135deg, ${color}18, #131720 65%)`, borderColor: `${color}40` }
        : { backgroundColor: "#131720", borderColor: "#232A38" }
    }
  >
    <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
    {featured && (
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: color }}
      />
    )}
    <div className="relative flex items-start gap-4">
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg border ${featured ? "h-12 w-12" : "h-11 w-11"}`}
        style={{ color, borderColor: `${color}45`, backgroundColor: `${color}1A` }}
      >
        <Icon className={featured ? "h-6 w-6" : "h-5 w-5"} />
      </span>
      <div>
        <h3 className={`${featured ? "text-base" : "text-sm"} font-semibold text-[#E8EAED]`}>{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#8B93A1]">{desc}</p>
      </div>
    </div>
    <IconArrowRight className="relative mt-1 h-4 w-4 shrink-0 text-[#8B93A1] transition-transform group-hover:translate-x-1 group-hover:text-[#E8EAED]" />
  </Link>
);

/* ------------------------------------- Page ------------------------------------- */

const HomePage = () => {
  const { role, user } = useSelector((state) => state.auth);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      setLoadingStats(true);
      getDashboardStats()
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoadingStats(false));
    }
  }, [role]);

  if (!isRehydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14]">
        <Loader size="lg" label="Loading your dashboard…" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14]">
        <Loader size="lg" label="Loading your profile…" />
      </div>
    );
  }

  const roleStyle = ROLE_STYLES[role] ?? {
    label: role,
    color: "#8B93A1",
    bg: "bg-[#131720]",
    border: "border-[#232A38]",
    subtitle: "Here's what's happening today.",
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-[#E8EAED]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[#232A38] bg-gradient-to-br from-[#131720] to-[#0F131B] p-5 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#8B93A1 1px, transparent 1px), linear-gradient(90deg, #8B93A1 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: roleStyle.color }}
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#8B93A1]">
                <span>{greeting()}</span>
                <span className="h-1 w-1 rounded-full bg-[#232A38]" />
                <span className={FONT_MONO}>{TODAY}</span>
              </div>
              <h1
                className={`${FONT_DISPLAY} mt-2 text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-3xl lg:text-4xl`}
              >
                Welcome, {user?.name || "User"} 👋
              </h1>
              <p className="mt-2 max-w-md text-sm text-[#8B93A1] sm:text-base">{roleStyle.subtitle}</p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${roleStyle.bg} ${roleStyle.border}`}
              style={{ color: roleStyle.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: roleStyle.color }} />
              <span className={FONT_MONO}>{roleStyle.label}</span>
            </span>
          </div>
        </div>

        {/* Admin: stats */}
        {role === "ADMIN" &&
          (loadingStats ? (
            <div className="mt-8 flex justify-center py-16">
              <Loader label="Fetching dashboard stats…" />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <Kicker color="#FBBF24">Needs attention</Kicker>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <StatCard
                    label="Pending Orders"
                    value={stats?.pendingOrders}
                    icon={IconClock}
                    color={ACCENT.pending}
                    to="/orders/all?status=pending"
                    tint
                  />
                  <StatCard
                    label="Low Stock Products"
                    value={stats?.lowStockProducts}
                    icon={IconAlert}
                    color={ACCENT.lowStock}
                    to="/products/low-stock"
                    tint
                  />
                </div>
              </div>

              <div className="mt-8">
                <Kicker>Overview</Kicker>
                <div className="mt-4">
                  <RevenueBanner value={stats ? `₹${stats.totalRevenue}` : "—"} />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Total Users" value={stats?.totalUsers} icon={IconUsers} color={ACCENT.users} to="/admin/users" />
                  <StatCard label="Total Products" value={stats?.totalProducts} icon={IconBox} color={ACCENT.products} to="/products" />
                  <StatCard label="Total Orders" value={stats?.totalOrders} icon={IconClipboard} color={ACCENT.orders} to="/orders/all" />
                </div>
              </div>
            </>
          ))}

        {/* Warehouse manager: actions */}
        {role === "WAREHOUSE_MANAGER" && (
          <div className="mt-8">
            <Kicker color="#A78BFA">Quick actions</Kicker>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ActionCard
                title="Bulk stock update"
                desc="Revise multiple products in one locked batch — the fastest way to keep shelves accurate."
                icon={IconLayers}
                color={ACCENT.users}
                to="/products/bulk-update"
                featured
              />
              <div className="grid grid-cols-1 gap-4">
                <ActionCard title="Manage inventory" desc="Update stock levels product by product." icon={IconBox} color={ACCENT.products} to="/products" />
                <ActionCard title="View all orders" desc="Track status across every customer order." icon={IconClipboard} color={ACCENT.orders} to="/orders/all" />
              </div>
            </div>
          </div>
        )}

        {/* Customer: actions */}
        {role === "CUSTOMER" && (
          <div className="mt-8">
            <Kicker color="#4ADE80">Quick actions</Kicker>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ActionCard
                title="Browse products"
                desc="Explore what's in stock right now and find what you need."
                icon={IconBag}
                color={ACCENT.products}
                to="/products"
                featured
              />
              <ActionCard title="My orders" desc="Track deliveries and past purchases." icon={IconClipboard} color={ACCENT.orders} to="/orders/my-orders" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;