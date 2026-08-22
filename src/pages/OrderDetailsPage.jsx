import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import {
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../api/orderApi";
import {
  IconArrowLeft,
  IconPackage,
  IconAlert,
  IconX,
  IconCheck,
} from "../utils/helpers";
import { showSuccess, showError, showPromise } from '../utils/toast';

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ORDER_STATUS_COLOR = {
  PENDING: "#FBBF24",
  CONFIRMED: "#38BDF8",
  SHIPPED: "#A78BFA",
  DELIVERED: "#4ADE80",
  CANCELLED: "#FB7185",
};

const PAYMENT_STATUS_COLOR = {
  PENDING: "#FBBF24",
  PAID: "#4ADE80",
  FAILED: "#FB7185",
  REFUNDED: "#38BDF8",
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";
  const isWarehouse = role === "WAREHOUSE_MANAGER";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError("Failed to load order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setSubmitting(true);
    try {
      await showPromise(cancelOrder(id), {
        loading: "Cancelling order...",
        success: "✅ Order cancelled successfully!",
        error: "Failed to cancel order",
      });
      await fetchOrder();
    } catch (err) {
      setError("Failed to cancel order");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!window.confirm(`Update order status to ${status}?`)) return;
    setSubmitting(true);
    try {
      await updateOrderStatus(id, status);
      await fetchOrder();
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentUpdate = async (status) => {
    if (!window.confirm(`Update payment status to ${status}?`)) return;
    setSubmitting(true);
    try {
      await updatePaymentStatus(id, status);
      await fetchOrder();
    } catch (err) {
      setError("Failed to update payment");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">{error || "Order not found"}</p>
        <Link
          to="/orders/my-orders"
          className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
        >
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Back button */}
        <Link
          to={
            role === "ADMIN" || role === "WAREHOUSE_MANAGER"
              ? "/orders/all"
              : "/orders/my-orders"
          }
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition mb-6"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        {/* Order Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <IconPackage className="h-6 w-6 text-[#FF6B1A]" />
                <h1
                  className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}
                >
                  Order #{order.orderNumber}
                </h1>
              </div>
              <p className="mt-1 text-sm text-[#8B93A1]">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`${FONT_MONO} text-xs rounded-full border px-3 py-1`}
                style={{
                  color: ORDER_STATUS_COLOR[order.status] || "#8B93A1",
                  borderColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}45`,
                  backgroundColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}16`,
                }}
              >
                {order.status}
              </span>
              <span
                className={`${FONT_MONO} text-xs rounded-full border px-3 py-1`}
                style={{
                  color: PAYMENT_STATUS_COLOR[order.paymentStatus] || "#8B93A1",
                  borderColor: `${PAYMENT_STATUS_COLOR[order.paymentStatus] || "#8B93A1"}45`,
                  backgroundColor: `${PAYMENT_STATUS_COLOR[order.paymentStatus] || "#8B93A1"}16`,
                }}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-6 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] p-5">
            <h3 className="text-sm font-semibold text-[#8B93A1]">
              Shipping Address
            </h3>
            <p className="mt-1 text-sm text-[#E8EAED]">
              {order.shippingAddress}
            </p>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#232A38]">
              <h3 className="text-sm font-semibold text-[#8B93A1]">Items</h3>
            </div>
            <div className="divide-y divide-[#232A38]">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-[#E8EAED]">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[#8B93A1]">
                      ₹{item.pricePerUnit} × {item.quantity}
                    </p>
                  </div>
                  <span
                    className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}
                  >
                    ₹{item.totalPrice}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#232A38] bg-[#0F131B] flex justify-between">
              <span className="text-sm font-semibold text-[#E8EAED]">
                Total
              </span>
              <span
                className={`${FONT_MONO} text-lg font-semibold text-[#E8EAED]`}
              >
                ₹{order.totalAmount}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#232A38]">
            {/* Cancel Order (Customer only) */}
            {role === "CUSTOMER" &&
              order.status !== "CANCELLED" &&
              order.status !== "DELIVERED" && (
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-[#FB7185]/20 border border-[#FB7185]/30 px-4 py-2 text-sm font-medium text-[#FB7185] hover:bg-[#FB7185]/30 transition disabled:opacity-50"
                >
                  <IconX className="h-4 w-4" />
                  Cancel Order
                </button>
              )}

            {/* Status Update (Admin/Warehouse) */}
            {(isAdmin || isWarehouse) &&
              order.status !== "CANCELLED" &&
              order.status !== "DELIVERED" && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#8B93A1]">Status:</span>
                  {["CONFIRMED", "SHIPPED", "DELIVERED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={submitting || order.status === status}
                      className={`text-xs rounded-md px-3 py-1 transition ${
                        order.status === status
                          ? "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30"
                          : "bg-[#0F131B] text-[#8B93A1] hover:text-[#E8EAED] border border-[#232A38]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}

            {/* Payment Update (Admin only) */}
            {isAdmin && order.paymentStatus !== "REFUNDED" && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#8B93A1]">Payment:</span>
                {["PAID", "FAILED", "REFUNDED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handlePaymentUpdate(status)}
                    disabled={submitting || order.paymentStatus === status}
                    className={`text-xs rounded-md px-3 py-1 transition ${
                      order.paymentStatus === status
                        ? "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30"
                        : "bg-[#0F131B] text-[#8B93A1] hover:text-[#E8EAED] border border-[#232A38]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
              <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
