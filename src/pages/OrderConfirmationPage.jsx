import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import {
  IconCheckCircle,
  IconXCircle,
  IconPackage,
  IconArrowLeft,
  IconShoppingCart,
} from "../utils/helpers";

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

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // ✅ Get order from location state
    const orderData = location.state?.order;

    if (orderData) {
      setOrder(orderData);
      setLoading(false);
    } else {
      // ✅ If no order data, redirect to products
      setError("No order found. Please place an order first.");
      setLoading(false);
      setTimeout(() => {
        navigate("/products");
      }, 3000);
    }
  }, [location, navigate]);

  // ✅ Auto redirect countdown
  useEffect(() => {
    if (order && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (order && countdown === 0) {
      navigate(`/orders/${order.id}`);
    }
  }, [countdown, order, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Confirming your order..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4 p-6">
        <IconXCircle className="h-16 w-16 text-[#FB7185]" />
        <h2 className={`${FONT_DISPLAY} text-xl font-semibold text-[#FB7185]`}>
          Oops! Something went wrong
        </h2>
        <p className="text-sm text-[#8B93A1]">{error}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] hover:bg-[#FF7A30] transition"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Shopping
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const isSuccess = order.status !== "CANCELLED" && order.paymentStatus !== "FAILED";

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="text-center border-b border-[#232A38] pb-8">
          {isSuccess ? (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-[#4ADE80]/20 p-4">
                <IconCheckCircle className="h-16 w-16 text-[#4ADE80]" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-[#FB7185]/20 p-4">
                <IconXCircle className="h-16 w-16 text-[#FB7185]" />
              </div>
            </div>
          )}

          <h1 className={`${FONT_DISPLAY} text-3xl font-semibold tracking-tight`}>
            {isSuccess ? "🎉 Order Confirmed!" : "⚠️ Order Failed"}
          </h1>

          <p className="mt-2 text-sm text-[#8B93A1]">
            {isSuccess
              ? `Thank you, ${user?.name || "Customer"}! Your order has been placed successfully.`
              : "There was an issue with your order. Please try again."}
          </p>
        </div>

        {/* Order Details */}
        <div className="mt-6 space-y-5">
          {/* Order Number & Status */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-[#8B93A1]">Order Number</p>
                <p className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>
                  #{order.orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-[#8B93A1]">Status</p>
                  <span
                    className={`${FONT_MONO} text-xs rounded-full border px-3 py-1 inline-block mt-1`}
                    style={{
                      color: ORDER_STATUS_COLOR[order.status] || "#8B93A1",
                      borderColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}45`,
                      backgroundColor: `${ORDER_STATUS_COLOR[order.status] || "#8B93A1"}16`,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#8B93A1]">Payment</p>
                  <span
                    className={`${FONT_MONO} text-xs rounded-full border px-3 py-1 inline-block mt-1`}
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
          </div>

          {/* Items */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#232A38]">
              <h3 className="text-sm font-semibold text-[#8B93A1]">Order Items</h3>
            </div>
            <div className="divide-y divide-[#232A38]">
              {order.items?.map((item, index) => (
                <div key={index} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#E8EAED]">{item.productName}</p>
                    <p className="text-xs text-[#8B93A1]">
                      ₹{item.pricePerUnit} × {item.quantity}
                    </p>
                  </div>
                  <span className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>
                    ₹{item.totalPrice}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[#232A38] bg-[#0F131B] flex justify-between">
              <span className="text-sm font-semibold text-[#E8EAED]">Total</span>
              <span className={`${FONT_MONO} text-lg font-semibold text-[#E8EAED]`}>
                ₹{order.totalAmount}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] p-5">
            <h3 className="text-sm font-semibold text-[#8B93A1]">Shipping Address</h3>
            <p className="mt-1 text-sm text-[#E8EAED]">{order.shippingAddress}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#232A38]">
            <Link
              to={`/orders/${order.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] hover:bg-[#FF7A30] transition"
            >
              <IconPackage className="h-4 w-4" />
              View Order Details
            </Link>

            <Link
              to="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0F131B] border border-[#232A38] px-6 py-2.5 text-sm font-medium text-[#8B93A1] hover:text-[#E8EAED] transition"
            >
              <IconShoppingCart className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Auto Redirect */}
          <p className="text-center text-xs text-[#8B93A1]">
            Redirecting to order details in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;