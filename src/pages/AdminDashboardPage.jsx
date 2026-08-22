import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import {
  getDashboardStats,
  getRecentOrders, 
  getLowStockProductsList,
} from "../api/adminApi";
import { getAllInventoryLogs } from "../api/inventoryApi"; 
import {
  IconUsers,
  IconBox,
  IconClipboard,
  IconRupee,
  IconClock,
  IconAlert,
  IconArrowRight,
  IconLayers,
  IconNotebook,
  IconUserPlus,
  IconPlus,
  greeting,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

// Same color-coded system used across the app — each kind of data keeps its
// own hue everywhere it appears, so the dashboard stays consistent, not flat.
const ACCENT = {
  revenue: "#34D1BF",
  users: "#A78BFA",
  products: "#4ADE80",
  orders: "#F472B6",
  pending: "#FBBF24",
  lowStock: "#FB7185",
  tools: "#38BDF8",
  audit: "#818CF8",
};

const ORDER_STATUS_COLOR = {
  PENDING: "#FBBF24",
  CONFIRMED: "#38BDF8",
  SHIPPED: "#A78BFA",
  DELIVERED: "#4ADE80",
  CANCELLED: "#FB7185",
};

const LOG_TYPE_COLOR = {
  ADDED: "#4ADE80",
  DEDUCTED: "#FB7185",
  ADJUSTED: "#FBBF24",
};

const DAYS_LABEL = {
  1: "Last 24 hours",
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 3 months",
  365: "Last 1 year",
};

/* ------------------------------------ Kicker ------------------------------------ */

function Kicker({ children, color = "#34D1BF" }) {
  return (
    <p
      className={`${FONT_MONO} flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]`}
      style={{ color }}
    >
      <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </p>
  );
}

function Badge({ label, color }) {
  return (
    <span
      className={`${FONT_MONO} inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide`}
      style={{ color, borderColor: `${color}45`, backgroundColor: `${color}16` }}
    >
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/* ----------------------------------- Pieces ----------------------------------- */

const StatCard = ({ label, value, icon: Icon, color, to, tint = false }) => {
  const content = (
    <div
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border p-4 pt-[19px] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
      style={
        tint
          ? { backgroundColor: `${color}12`, borderColor: `${color}35` }
          : { backgroundColor: "#131720", borderColor: "#232A38" }
      }
    >
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: color }} />
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11"
        style={{ color, borderColor: `${color}45`, backgroundColor: `${color}1A` }}
      >
        <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-[#8B93A1]">{label}</p>
        <p className={`${FONT_MONO} mt-0.5 truncate text-base font-medium text-[#E8EAED] sm:text-lg`}>{value}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const QuickAction = ({ title, desc, icon: Icon, color, to }) => (
  <Link
    to={to}
    className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border p-4 transition-all hover:-translate-y-0.5 active:scale-[0.98] sm:gap-4"
    style={{ backgroundColor: "#131720", borderColor: "#232A38" }}
  >
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11"
      style={{ color, borderColor: `${color}45`, backgroundColor: `${color}1A` }}
    >
      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
    </span>
    <div className="min-w-0 flex-1">
      <h3 className="text-sm font-semibold text-[#E8EAED]">{title}</h3>
      <p className="mt-0.5 truncate text-xs text-[#8B93A1]">{desc}</p>
    </div>
    <IconArrowRight className="h-4 w-4 shrink-0 text-[#8B93A1] opacity-0 transition-opacity group-hover:opacity-100" />
  </Link>
);

const PanelHeader = ({ kicker, kickerColor, title, to, toLabel = "View all" }) => (
  <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
    <div className="min-w-0">
      <Kicker color={kickerColor}>{kicker}</Kicker>
      <h2 className={`${FONT_DISPLAY} mt-1.5 text-base font-semibold tracking-tight text-[#E8EAED] sm:text-lg lg:text-xl`}>
        {title}
      </h2>
    </div>
    {to && (
      <Link to={to} className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#8B93A1] hover:text-[#E8EAED]">
        {toLabel}
        <IconArrowRight className="h-3 w-3" />
      </Link>
    )}
  </div>
);

const EmptyRow = ({ text }) => (
  <div className="rounded-lg border border-dashed border-[#232A38] px-4 py-6 text-center text-xs text-[#8B93A1]">
    {text}
  </div>
);

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ---------------------------------- Sections ---------------------------------- */

function RecentOrders({ orders, loading, days, onDaysChange }) {
  return (
    <div className="rounded-xl border border-[#232A38] bg-[#131720] p-4 sm:p-6">
      <PanelHeader kicker={DAYS_LABEL[days] ?? "Recent"} kickerColor={ACCENT.orders} title="Recent orders" to="/orders/all" />

      {/* Timeline filter — stacks on mobile, inline from sm: up */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <label htmlFor="orders-range" className="shrink-0 text-xs text-[#8B93A1]">
          Show orders from:
        </label>
        <select
          id="orders-range"
          value={days}
          onChange={onDaysChange}
          className="w-full rounded-md border border-[#232A38] bg-[#0F131B] px-3 py-2 text-xs text-[#E8EAED] focus:border-[#FF6B1A] focus:outline-none sm:w-auto sm:py-1.5"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 3 months</option>
          <option value={365}>Last 1 year</option>
        </select>
      </div>

      <div className="mt-4 space-y-2.5">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader label="Loading recent orders…" />
          </div>
        ) : !orders?.length ? (
          <EmptyRow text="No orders placed in the selected period." />
        ) : (
          orders.slice(0, 6).map((o) => (
            <Link
              key={o.id ?? o.orderNumber}
              to={`/orders/${o.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#232A38] bg-[#0F131B] px-3.5 py-3 transition-colors hover:border-[#2A3244] sm:px-4"
            >
              <div className="min-w-0">
                <p className={`${FONT_MONO} truncate text-xs text-[#E8EAED]`}>#{o.orderNumber}</p>
                <p className="mt-0.5 truncate text-xs text-[#8B93A1]">User #{o.userId || "Unknown"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span className={`${FONT_MONO} hidden text-xs text-[#E8EAED] sm:inline`}>₹{o.totalAmount}</span>
                <Badge label={o.status} color={ORDER_STATUS_COLOR[o.status] ?? "#8B93A1"} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function InventoryAudit({ logs, loading }) {
  return (
    <div className="rounded-xl border border-[#232A38] bg-[#131720] p-4 sm:p-6">
      <PanelHeader kicker="Audit trail" kickerColor={ACCENT.audit} title="Inventory activity" to="/inventory/logs" />

      <div className="mt-4 space-y-2.5 sm:mt-5">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader label="Loading activity…" />
          </div>
        ) : !logs?.length ? (
          <EmptyRow text="No stock changes logged yet." />
        ) : (
          logs.slice(0, 6).map((log, i) => (
            <div
              key={log.id ?? i}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#232A38] bg-[#0F131B] px-3.5 py-3 sm:px-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: LOG_TYPE_COLOR[log.changeType] ?? "#8B93A1" }}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs text-[#E8EAED]">{log.productName ?? "Product"}</p>
                  <p className={`${FONT_MONO} mt-0.5 truncate text-[11px] text-[#8B93A1]`}>
                    {log.oldQuantity} → {log.newQuantity} · {log.changedBy ?? "system"}
                  </p>
                </div>
              </div>
              <span className={`${FONT_MONO} shrink-0 text-[11px] text-[#8B93A1]`}>{timeAgo(log.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LowStockList({ products, loading }) {
  return (
    <div className="rounded-xl border border-[#FB7185]/30 bg-[#131720] p-4 sm:p-6">
      <PanelHeader kicker="Restock soon" kickerColor={ACCENT.lowStock} title="Low stock" to="/products/low-stock" />

      <div className="mt-4 space-y-2.5 sm:mt-5">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader label="Checking stock levels…" />
          </div>
        ) : !products?.length ? (
          <EmptyRow text="Everything is well stocked. 🎉" />
        ) : (
          products.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#232A38] bg-[#0F131B] px-3.5 py-3 transition-colors hover:border-[#2A3244] sm:px-4"
            >
              <div className="min-w-0">
                <p className="truncate text-xs text-[#E8EAED]">{p.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-[#8B93A1]">{p.category}</p>
              </div>
              <span
                className={`${FONT_MONO} shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium`}
                style={{ color: ACCENT.lowStock, borderColor: `${ACCENT.lowStock}45`, backgroundColor: `${ACCENT.lowStock}16` }}
              >
                {p.availableQuantity} left
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function QuickActionsPanel() {
  const actions = [
    { title: "Create product", desc: "Add a new item to the catalog", icon: IconPlus, color: ACCENT.products, to: "/products/create" },
    { title: "Register team member", desc: "Add a warehouse manager or admin", icon: IconUserPlus, color: ACCENT.users, to: "/admin/register" },
    { title: "Bulk stock update", desc: "Revise multiple products at once", icon: IconLayers, color: ACCENT.tools, to: "/products/bulk-update" },
    { title: "Inventory logs", desc: "Full stock change history", icon: IconNotebook, color: ACCENT.audit, to: "/inventory/logs" },
    { title: "Manage orders", desc: "Update status & payment for any order", icon: IconClipboard, color: ACCENT.orders, to: "/orders/all" },
    { title: "Low stock report", desc: "See everything nearing zero", icon: IconAlert, color: ACCENT.lowStock, to: "/products/low-stock" },
  ];

  return (
    <div className="rounded-xl border border-[#232A38] bg-[#131720] p-4 sm:p-6">
      <Kicker color="#FF6B1A">Quick actions</Kicker>
      <h2 className={`${FONT_DISPLAY} mt-1.5 text-base font-semibold tracking-tight text-[#E8EAED] sm:text-lg lg:text-xl`}>
        Run the store
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2">
        {actions.map((a) => (
          <QuickAction key={a.title} {...a} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------- Page ------------------------------------- */

const AdminDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState({ stats: true, orders: true, lowStock: true, logs: true });
  const [days, setDays] = useState(7);

  const fetchRecentOrders = (daysCount) => {
    setLoading((s) => ({ ...s, orders: true }));
    getRecentOrders(daysCount)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, orders: false })));
  };

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setDays(value);
    fetchRecentOrders(value);
  };

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, stats: false })));

    fetchRecentOrders(7);

    getLowStockProductsList(5)
      .then((data) => setLowStock(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, lowStock: false })));

    getAllInventoryLogs()
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, logs: false })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-[#E8EAED]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#232A38] pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
          <div className="min-w-0">
            <p className="text-xs text-[#8B93A1]">
              {greeting()}, {user?.name || "Admin"}
            </p>
            <h1 className={`${FONT_DISPLAY} mt-1 text-xl font-semibold tracking-tight text-[#E8EAED] sm:text-2xl lg:text-3xl`}>
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-[#8B93A1]">Full control over your catalog, team, and every order.</p>
          </div>
          <Link
            to="/admin/register"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30] active:scale-[0.98] sm:w-fit"
          >
            <IconUserPlus className="h-4 w-4" />
            Register team member
          </Link>
        </div>

        {/* Stats strip — mobile-first: stacked full-width, then progressively denser */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Users" value={stats?.totalUsers ?? "—"} icon={IconUsers} color={ACCENT.users} to="/admin/users" tint={loading.stats} />
          <StatCard label="Products" value={stats?.totalProducts ?? "—"} icon={IconBox} color={ACCENT.products} to="/products" />
          <StatCard label="Orders" value={stats?.totalOrders ?? "—"} icon={IconClipboard} color={ACCENT.orders} to="/orders/all" />
          <StatCard label="Revenue" value={stats ? `₹${stats.totalRevenue}` : "—"} icon={IconRupee} color={ACCENT.revenue} />
          <StatCard label="Pending" value={stats?.pendingOrders ?? "—"} icon={IconClock} color={ACCENT.pending} to="/orders/all?status=pending" tint />
          <StatCard label="Low stock" value={stats?.lowStockProducts ?? "—"} icon={IconAlert} color={ACCENT.lowStock} to="/products/low-stock" tint />
        </div>

        {/* Main grid — single column until lg, then 2/3 + 1/3 split */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-2">
            <RecentOrders orders={orders} loading={loading.orders} days={days} onDaysChange={handleDaysChange} />
            <InventoryAudit logs={logs} loading={loading.logs} />
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            <LowStockList products={lowStock} loading={loading.lowStock} />
            <QuickActionsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;