import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { getMyOrders } from "../api/orderApi";
import { IconArrowRight, IconPackage, IconAlert } from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ORDER_STATUS_COLOR = {
  PENDING: "#FBBF24",
  CONFIRMED: "#38BDF8",
  SHIPPED: "#A78BFA",
  DELIVERED: "#4ADE80",
  CANCELLED: "#FB7185",
};

const MyOrdersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex items-center gap-3">
            <IconPackage className="h-6 w-6 text-[#FF6B1A]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              My Orders
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            {user?.name || "Customer"}, here are all your orders
          </p>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="mt-8 rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
            <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        ) : !orders.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#232A38] px-6 py-16 text-center text-sm text-[#8B93A1]">
            <p className="text-4xl mb-3">📦</p>
            <p>You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-block mt-4 text-[#FF6B1A] hover:text-[#FF7A30] transition"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
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
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
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

export default MyOrdersPage;