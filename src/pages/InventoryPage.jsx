import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import {
  getInventoryLogsByProduct,
  getInventoryLogsByUser,
  getInventoryLogsByChangeType,
  getLatestInventoryLog,
  getAllInventoryLogs,
} from "../api/inventoryApi";
import {
  IconBox,
  IconUsers,
  IconFilter,
  IconClock,
  IconArrowRight,
  IconNotebook,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const LOG_TYPE_COLOR = {
  ADDED: "#4ADE80",
  DEDUCTED: "#FB7185",
  ADJUSTED: "#FBBF24",
};

const LOG_TYPE_LABEL = {
  ADDED: "Added",
  DEDUCTED: "Deducted",
  ADJUSTED: "Adjusted",
};

function Badge({ label, color }) {
  return (
    <span
      className={`${FONT_MONO} inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide`}
      style={{
        color,
        borderColor: `${color}45`,
        backgroundColor: `${color}16`,
      }}
    >
      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

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

const InventoryPage = () => {
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, product, user, type
  const [filterValue, setFilterValue] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let data;
      switch (filterType) {
        case "product":
          data = await getInventoryLogsByProduct(parseInt(filterValue));
          break;
        case "user":
          data = await getInventoryLogsByUser(parseInt(filterValue));
          break;
        case "type":
          data = await getInventoryLogsByChangeType(filterValue);
          break;
        default:
          data = await getAllInventoryLogs();
          break;
      }
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch inventory logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterType, filterValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (filterType === "product" || filterType === "user") {
      const num = parseInt(searchInput);
      if (!isNaN(num) && num > 0) {
        setFilterValue(searchInput);
      } else {
        alert("Please enter a valid ID");
      }
    } else if (filterType === "type") {
      const validTypes = ["ADDED", "DEDUCTED", "ADJUSTED"];
      if (validTypes.includes(searchInput.toUpperCase())) {
        setFilterValue(searchInput.toUpperCase());
      } else {
        alert("Valid types: ADDED, DEDUCTED, ADJUSTED");
      }
    }
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterValue("");
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#232A38] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              📝 Inventory Logs
            </h1>
            <p className="mt-1 text-sm text-[#8B93A1]">
              Full stock change history — every addition, deduction, and adjustment.
            </p>
          </div>
          <span className="text-xs text-[#8B93A1]">
            {logs.length} {logs.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4 text-[#8B93A1]" />
            <span className="text-xs text-[#8B93A1]">Filter:</span>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue("");
                setSearchInput("");
              }}
              className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
            >
              <option value="all">All Logs</option>
              <option value="product">By Product ID</option>
              <option value="user">By User ID</option>
              <option value="type">By Change Type</option>
            </select>
          </div>

          {filterType !== "all" && (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  filterType === "product"
                    ? "Enter product ID..."
                    : filterType === "user"
                    ? "Enter user ID..."
                    : "ADDED / DEDUCTED / ADJUSTED"
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] w-48"
              />
              <button
                type="submit"
                className="bg-[#FF6B1A] text-[#0B0E14] px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#FF7A30] transition"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#8B93A1] hover:text-[#E8EAED] transition"
              >
                Reset
              </button>
            </form>
          )}
        </div>

        {/* Logs Table */}
        <div className="mt-6 rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader label="Loading logs…" />
            </div>
          ) : !logs.length ? (
            <div className="px-6 py-12 text-center text-sm text-[#8B93A1]">
              No inventory logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#232A38] bg-[#0F131B]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Old → New
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      By
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232A38]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0F131B] transition">
                      <td className="px-4 py-3">
                        <Link
                          to={`/products/${log.productId}`}
                          className="text-[#E8EAED] hover:text-[#FF6B1A] transition"
                        >
                          {log.productName || `Product #${log.productId}`}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={LOG_TYPE_LABEL[log.changeType] || log.changeType}
                          color={LOG_TYPE_COLOR[log.changeType] || "#8B93A1"}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#E8EAED]">
                        {log.oldQuantity} → {log.newQuantity}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8B93A1]">
                        {log.changeType}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8B93A1] max-w-xs truncate">
                        {log.reason || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8B93A1]">
                        {log.changedByName || `User #${log.changedBy}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8B93A1] whitespace-nowrap">
                        {timeAgo(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Note */}
        {!isAdmin && (
          <div className="mt-4 text-xs text-[#8B93A1] text-center border-t border-[#232A38] pt-4">
            🔒 Only <span className="text-[#FF6B1A]">ADMIN</span> can view all logs.
            Warehouse Managers can filter by product, user, or type.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;