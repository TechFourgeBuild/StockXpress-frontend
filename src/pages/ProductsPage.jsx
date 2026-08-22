import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import {
  getAllProducts,
  deleteProduct,
  getLowStockProducts,
} from "../api/productApi";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconAlert,
  IconBox,
  IconLayers,
  IconShoppingCart,
} from "../utils/helpers";
import { showSuccess, showError, showPromise } from "../utils/toast";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ProductsPage = () => {
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";
  const isWarehouse = role === "WAREHOUSE_MANAGER";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (showLowStock) {
        data = await getLowStockProducts(5);
      } else {
        data = await getAllProducts();
      }
      setProducts(data);
      setFilteredProducts(data);

      const uniqueCategories = [
        ...new Set(data.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [showLowStock]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await showPromise(deleteProduct(id), {
        loading: "Deleting product...",
        success: `✅ "${name}" deleted successfully!`,
        error: "Failed to delete product",
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const isLowStock = (quantity) => quantity < 5;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-[#232A38] pb-6">
          {/* ✅ Heading — Full Width */}
          <div>
            <h1
              className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}
            >
              📦 Products
            </h1>
            <p className="mt-1 text-sm text-[#8B93A1]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} in
              catalog
            </p>
          </div>

          {/* ✅ CUSTOMER — Place Order */}
          {role === "CUSTOMER" && (
            <Link
              to="/orders/place"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
            >
              <IconShoppingCart className="h-4 w-4" />
              Place Order
            </Link>
          )}

          {/* ✅ Buttons — Centered on Mobile, Right aligned on Desktop */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            {(isWarehouse || isAdmin) && (
              <Link
                to="/products/bulk-update"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#34D1BF] px-4 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#2BB8A6]"
              >
                <IconLayers className="h-4 w-4" />
                Bulk Update
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/products/create"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
              >
                <IconPlus className="h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-[#8B93A1] cursor-pointer">
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={() => setShowLowStock(!showLowStock)}
              className="accent-[#FF6B1A]"
            />
            Show low stock only
          </label>
        </div>

        {/* ✅ Products Grid — Wider Cards with Max Width */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader label="Loading products…" />
          </div>
        ) : !filteredProducts.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#232A38] px-6 py-16 text-center text-sm text-[#8B93A1]">
            {showLowStock
              ? "No low stock products found. 🎉"
              : "No products found. Try adjusting your filters."}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden transition-all hover:-translate-y-1 hover:border-[#2A3244] hover:shadow-lg hover:shadow-[#FF6B1A]/5"
              >
                {/* ✅ Image — 4:3 (Taller than wide, better for product) */}
                <Link
                  to={`/products/${product.id}`}
                  className="block aspect-[4/3] bg-[#0F131B] overflow-hidden"
                >
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
                </Link>

                {/* ✅ Content — More Padding */}
                <div className="p-4 sm:p-5">
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="text-base font-semibold text-[#E8EAED] line-clamp-1 hover:text-[#FF6B1A] transition">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-0.5 text-xs text-[#8B93A1] line-clamp-1">
                    {product.category || "Uncategorized"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`${FONT_MONO} text-lg font-medium text-[#E8EAED]`}
                    >
                      ₹{product.price}
                    </span>
                    <span
                      className={`${FONT_MONO} text-xs rounded-full px-2.5 py-0.5 ${
                        isLowStock(product.availableQuantity)
                          ? "bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30"
                          : "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30"
                      }`}
                    >
                      {product.availableQuantity} left
                    </span>
                  </div>

                  {/* ✅ Actions — 2 Rows (View + Stock in Row 1, Edit + Delete in Row 2 for Admin) */}
                  <div className="mt-4 flex flex-col gap-1.5 border-t border-[#232A38] pt-3.5">
                    {/* Row 1: View + Stock */}
                    <div className="flex items-center gap-1.5">
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
                          Stock
                        </Link>
                      )}
                    </div>

                    {/* Row 2: Edit + Delete (Admin only) */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#0F131B] px-2 py-1.5 text-xs text-[#38BDF8] hover:text-[#38BDF8]/80 transition"
                        >
                          <IconEdit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="flex-1 flex items-center justify-center gap-1 rounded-md bg-[#0F131B] px-2 py-1.5 text-xs text-[#FB7185] hover:text-[#FB7185]/80 transition"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isLowStock(product.availableQuantity) && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-md bg-[#FB7185]/10 border border-[#FB7185]/20 px-2.5 py-1.5 text-[10px] text-[#FB7185]">
                      <IconAlert className="h-3 w-3" />
                      Low stock! Restock soon.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
