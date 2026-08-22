import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { bulkStockUpdate } from "../api/productApi";
import { getAllProducts } from "../api/productApi";
import { IconArrowLeft, IconLayers, IconPlus, IconTrash, IconAlert } from "../utils/helpers";
import Loader from "../components/common/Loader";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const BulkStockUpdatePage = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isAuthorized = role === "WAREHOUSE_MANAGER" || role === "ADMIN";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState(null);

  const [updates, setUpdates] = useState([
    { productId: "", quantity: "", reason: "" },
  ]);

  const [productOptions, setProductOptions] = useState([]);

  // ✅ Load products for dropdown
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setProductOptions(data.map((p) => ({ id: p.id, name: p.name })));
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    loadProducts();
  }, []);

  const handleAddRow = () => {
    setUpdates([...updates, { productId: "", quantity: "", reason: "" }]);
  };

  const handleRemoveRow = (index) => {
    if (updates.length <= 1) return;
    const newUpdates = updates.filter((_, i) => i !== index);
    setUpdates(newUpdates);
  };

  const handleUpdateChange = (index, field, value) => {
    const newUpdates = [...updates];
    newUpdates[index][field] = value;
    setUpdates(newUpdates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setResults(null);

    // ✅ Validation
    const validUpdates = updates.filter(
      (u) => u.productId && u.quantity && u.reason.trim()
    );

    if (validUpdates.length === 0) {
      setError("Please add at least one valid product update.");
      setSubmitting(false);
      return;
    }

    const formattedUpdates = validUpdates.map((u) => ({
      productId: parseInt(u.productId),
      quantity: parseInt(u.quantity),
      reason: u.reason.trim(),
    }));

    try {
      await bulkStockUpdate(formattedUpdates);
      setSuccess(true);
      setResults({
        total: formattedUpdates.length,
        message: "Bulk stock update completed successfully!",
      });

      // ✅ Reset form after success
      setUpdates([{ productId: "", quantity: "", reason: "" }]);
      await loadProducts(); // Refresh product list

      setTimeout(() => {
        navigate("/products");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Bulk stock update failed. Please try again.");
      console.error("Bulk update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">You don't have permission to bulk update stock.</p>
        <Link to="/products" className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition">
          Back to products
        </Link>
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
            <IconLayers className="h-6 w-6 text-[#34D1BF]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              Bulk Stock Update
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Update stock for multiple products in one go
          </p>
        </div>

        {/* Note */}
        <div className="mt-4 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-3 text-xs text-[#8B93A1]">
          <span className="text-[#38BDF8]">ℹ️</span> Each product update is atomic — if one fails, others will still continue.
          {role === "ADMIN" && <span className="ml-2 text-[#FF6B1A]">(Admin override enabled)</span>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Updates Table */}
          <div className="rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#232A38] bg-[#0F131B]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      New Quantity
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider w-12">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232A38]">
                  {updates.map((update, index) => (
                    <tr key={index} className="hover:bg-[#0F131B] transition">
                      <td className="px-4 py-3">
                        <select
                          value={update.productId}
                          onChange={(e) =>
                            handleUpdateChange(index, "productId", e.target.value)
                          }
                          className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
                        >
                          <option value="">Select product...</option>
                          {productOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          placeholder="Quantity"
                          value={update.quantity}
                          onChange={(e) =>
                            handleUpdateChange(index, "quantity", e.target.value)
                          }
                          className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Reason"
                          value={update.reason}
                          onChange={(e) =>
                            handleUpdateChange(index, "reason", e.target.value)
                          }
                          className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          disabled={updates.length <= 1}
                          className="text-[#FB7185] hover:text-[#FB7185]/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Row Button */}
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-2 text-sm text-[#34D1BF] hover:text-[#34D1BF]/80 transition"
          >
            <IconPlus className="h-4 w-4" />
            Add row
          </button>

          {/* Error / Success */}
          {error && (
            <div className="rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
              <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {success && results && (
            <div className="rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-4 py-3 text-sm text-[#4ADE80]">
              ✅ {results.message} ({results.total} products updated). Redirecting...
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={submitting || success || loading}
              className="inline-flex items-center gap-2 rounded-md bg-[#34D1BF] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#2BB8A6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconLayers className="h-4 w-4" />
              {submitting ? "Updating..." : "Update All"}
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

export default BulkStockUpdatePage;