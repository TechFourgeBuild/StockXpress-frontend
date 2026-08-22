import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { getLowStockProductsList } from "../api/adminApi";
import {
  IconAlert,
  IconArrowRight,
  IconEye,
  IconBox,
  IconSearch,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const LowStockProductsPage = () => {
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";
  const isWarehouse = role === "WAREHOUSE_MANAGER";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLowStockProducts = async (thresholdValue = threshold) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLowStockProductsList(thresholdValue);
      setProducts(Array.isArray(data) ? data : []);
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load low stock products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, [threshold]);

  useEffect(() => {
    let filtered = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      );
    }
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleThresholdChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setThreshold(value);
    }
  };

  const isLowStock = (quantity) => quantity < threshold;

  if (!isAdmin && !isWarehouse) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">You don't have permission to view low stock products.</p>
        <Link to="/products" className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#232A38] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <IconAlert className="h-6 w-6 text-[#FB7185]" />
              <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
                Low Stock Products
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#8B93A1]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} below threshold
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
          >
            View all products
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
            <input
              type="text"
              placeholder="Search low stock products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-[#8B93A1]">Threshold:</label>
            <select
              value={threshold}
              onChange={handleThresholdChange}
              className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <button
              onClick={() => fetchLowStockProducts()}
              className="bg-[#FF6B1A] text-[#0B0E14] px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#FF7A30] transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader label="Loading low stock products..." />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185]">
            {error}
          </div>
        ) : !filteredProducts.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#232A38] px-6 py-16 text-center text-sm text-[#8B93A1]">
            <p className="text-4xl mb-3">🎉</p>
            <p>No products below the threshold of {threshold}.</p>
            <p className="mt-2 text-xs text-[#8B93A1]">Everything is well stocked!</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-[#FB7185]/30 bg-[#131720] overflow-hidden transition-all hover:-translate-y-1 hover:border-[#FB7185]/60 hover:shadow-lg hover:shadow-[#FB7185]/10"
              >
                {/* Image */}
                <Link to={`/products/${product.id}`} className="block aspect-video bg-[#0F131B] overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.className =
                          "h-full w-full flex items-center justify-center text-[#8B93A1] text-5xl bg-[#0F131B]";
                        e.target.alt = "📦";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-8xl text-[#8B93A1] bg-[#0F131B]">
                      📦
                    </div>
                  )}
                  {/* Low Stock Badge */}
                  <div className="absolute top-3 right-3 bg-[#FB7185] text-[#0B0E14] text-xs font-bold px-3 py-1 rounded-full">
                    ⚠️ {product.availableQuantity} left
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="text-sm font-semibold text-[#E8EAED] line-clamp-1 hover:text-[#FF6B1A] transition">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-0.5 text-xs text-[#8B93A1] line-clamp-1">
                    {product.category || "Uncategorized"}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={`${FONT_MONO} text-sm font-medium text-[#E8EAED]`}>
                      ₹{product.price}
                    </span>
                    <span
                      className={`${FONT_MONO} text-xs rounded-full px-2.5 py-0.5 bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30`}
                    >
                      {product.availableQuantity} left
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2 border-t border-[#232A38] pt-3">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#0F131B] px-2 py-1.5 text-xs text-[#8B93A1] hover:text-[#E8EAED] transition"
                    >
                      <IconEye className="h-3.5 w-3.5" />
                      View
                    </Link>

                    {(isWarehouse || isAdmin) && (
                      <Link
                        to={`/products/${product.id}/stock`}
                        className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#0F131B] px-2 py-1.5 text-xs text-[#34D1BF] hover:text-[#34D1BF]/80 transition"
                      >
                        <IconBox className="h-3.5 w-3.5" />
                        Restock
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockProductsPage;