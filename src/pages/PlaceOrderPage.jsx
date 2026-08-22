import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { placeOrder } from "../api/orderApi";
import { getAllProducts } from "../api/productApi";
import Loader from "../components/common/Loader";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconShoppingCart,
  IconAlert,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [shippingAddress, setShippingAddress] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!shippingAddress.trim()) {
      setError("Please enter shipping address");
      setSubmitting(false);
      return;
    }

    const validItems = items.filter(
      (item) => item.productId && item.quantity > 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one product");
      setSubmitting(false);
      return;
    }

    const orderData = {
      shippingAddress: shippingAddress.trim(),
      items: validItems.map((item) => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
      })),
    };

    try {
    const response = await placeOrder(orderData);
    setSuccess(true);
    
    // ✅ Redirect to confirmation page with order data
    navigate("/orders/confirmation", {
      state: { order: response },
      replace: true,
    });
  } catch (err) {
    setError(err.response?.data?.message || "Failed to place order. Please try again.");
    console.error("Order failed:", err);
  } finally {
    setSubmitting(false);
  }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition mb-6"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        {/* Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex items-center gap-3">
            <IconShoppingCart className="h-6 w-6 text-[#FF6B1A]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              Place Order
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            {user?.name || "Customer"}, fill in the details to place your order
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Shipping Address */}
          <div>
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Shipping Address <span className="text-[#FB7185]">*</span>
            </label>
            <textarea
              id="shippingAddress"
              rows="3"
              placeholder="Enter your full shipping address..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition resize-y"
            />
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#E8EAED]">
                Order Items <span className="text-[#FB7185]">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-sm text-[#34D1BF] hover:text-[#34D1BF]/80 transition"
              >
                <IconPlus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-[#232A38] bg-[#131720] p-4"
                >
                  {/* Product Select */}
                  <div className="flex-1 w-full">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(index, "productId", e.target.value)
                      }
                      className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-2 text-sm text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
                    >
                      <option value="">Select product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price} ({p.availableQuantity} left)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="w-32">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-2 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length <= 1}
                    className="text-[#FB7185] hover:text-[#FB7185]/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <IconTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
              <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-4 py-3 text-sm text-[#4ADE80]">
              ✅ Order placed successfully! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconShoppingCart className="h-4 w-4" />
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/products"
              className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderPage;