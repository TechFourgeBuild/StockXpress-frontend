import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { getProductById, updateStock } from "../api/productApi";
import { IconArrowLeft, IconBox, IconAlert } from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const StockUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isWarehouse = role === "WAREHOUSE_MANAGER" || role === "ADMIN";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setFormData((prev) => ({
          ...prev,
          quantity: data.availableQuantity,
        }));
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const newQuantity = parseInt(formData.quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      setError("Quantity must be a valid number and cannot be negative.");
      setSubmitting(false);
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for stock update.");
      setSubmitting(false);
      return;
    }

    try {
      await updateStock(id, newQuantity, formData.reason.trim());
      setSuccess(true);

      // ✅ Refresh product data
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
      setFormData((prev) => ({
        ...prev,
        quantity: updatedProduct.availableQuantity,
      }));

      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock. Please try again.");
      console.error("Stock update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLowStock = (quantity) => quantity < 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">Product not found</p>
        <Link to="/products" className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition">
          Back to products
        </Link>
      </div>
    );
  }

  if (!isWarehouse) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">You don't have permission to update stock.</p>
        <Link to="/products" className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Back button */}
        <Link
          to={`/products/${id}`}
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition mb-6"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to product
        </Link>

        {/* Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex items-center gap-3">
            <IconBox className="h-6 w-6 text-[#34D1BF]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              Update Stock
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            {product.name} — Current stock: {product.availableQuantity}
          </p>
        </div>

        {/* Product Info */}
        <div className="mt-6 rounded-xl border border-[#232A38] bg-[#131720] p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#8B93A1]">Product</p>
              <p className="text-sm font-medium text-[#E8EAED] truncate">{product.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#8B93A1]">Price</p>
              <p className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>₹{product.price}</p>
            </div>
            <div>
              <p className="text-xs text-[#8B93A1]">Category</p>
              <p className="text-sm font-medium text-[#E8EAED]">{product.category}</p>
            </div>
            <div>
              <p className="text-xs text-[#8B93A1]">Version</p>
              <p className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>{product.version || 0}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              New Quantity <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              required
              placeholder="Enter new stock quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full bg-[#0F131B] border rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition ${
                error && !formData.quantity ? "border-[#FB7185]" : "border-[#232A38]"
              }`}
            />
            <p className="mt-1.5 text-xs text-[#8B93A1]">
              Current: <span className="text-[#E8EAED]">{product.availableQuantity}</span>
              {isLowStock(product.availableQuantity) && (
                <span className="ml-2 text-[#FB7185]">⚠️ Low stock!</span>
              )}
            </p>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Reason <span className="text-[#FB7185]">*</span>
            </label>
            <select
              id="reason"
              name="reason"
              required
              value={formData.reason}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A] transition"
            >
              <option value="">Select a reason...</option>
              <option value="Monthly restock">Monthly restock</option>
              <option value="New shipment arrived">New shipment arrived</option>
              <option value="Bulk order received">Bulk order received</option>
              <option value="Inventory correction">Inventory correction</option>
              <option value="Damaged items removed">Damaged items removed</option>
              <option value="Seasonal adjustment">Seasonal adjustment</option>
              <option value="Warehouse clearance">Warehouse clearance</option>
              <option value="Other">Other</option>
            </select>
            {formData.reason === "Other" && (
              <input
                type="text"
                name="reasonCustom"
                placeholder="Specify reason..."
                className="mt-2 w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              />
            )}
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
              ✅ Stock updated successfully! Redirecting...
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center gap-2 rounded-md bg-[#34D1BF] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#2BB8A6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconBox className="h-4 w-4" />
              {submitting ? "Updating..." : "Update Stock"}
            </button>

            <Link
              to={`/products/${id}`}
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

export default StockUpdatePage;