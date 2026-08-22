import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { getAllOrders } from "../api/orderApi";
import { IconArrowRight, IconPackage, IconAlert, IconSearch } from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ORDER_STATUS_COLOR = {
  PENDING: "#FBBF24",
  CONFIRMED: "#38BDF8",
  SHIPPED: "#A78BFA",
  DELIVERED: "#4ADE80",
  CANCELLED: "#FB7185",
};

const AllOrdersPage = () => {
  const { role } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(Array.isArray(data) ? data : []);
        setFilteredOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(term) ||
          o.userId?.toString().includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex items-center gap-3">
            <IconPackage className="h-6 w-6 text-[#FF6B1A]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              All Orders
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            {filteredOrders.length} orders in the system
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
            <input
              type="text"
              placeholder="Search by order number or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="mt-8 rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
            <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        ) : !filteredOrders.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#232A38] px-6 py-16 text-center text-sm text-[#8B93A1]">
            <p className="text-4xl mb-3">📦</p>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-xl border border-[#232A38] bg-[#131720] p-5 transition-all hover:-translate-y-0.5 hover:border-[#2A3244] hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className={`${FONT_MONO} text-sm text-[#E8EAED]`}>
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-[#8B93A1]">
                      User #{order.userId} · {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>
                      ₹{order.totalAmount}
                    </span>
                    <span
                      className={`${FONT_MONO} text-xs rounded-full border px-2.5 py-0.5`}
                      style={{
                        color: ORDER_STATUS_COLOR[order.status] || "#8B93A1",
                        borderColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}45`,
                        backgroundColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}16`,
                      }}
                    >
                      {order.status}
                    </span>
                    <IconArrowRight className="h-4 w-4 text-[#8B93A1] hover:text-[#E8EAED] transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersPage;