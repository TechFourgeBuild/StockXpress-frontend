import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getProductById, deleteProduct } from "../api/productApi";
import {
  IconArrowRight,
  IconEdit,
  IconTrash,
  IconBox,
  IconAlert,
  IconArrowLeft,
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";
  const isWarehouse = role === "WAREHOUSE_MANAGER";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Product not found or failed to load.");
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product?.name}"?`)) return;
    try {
      await deleteProduct(id);
      navigate("/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const isLowStock = (quantity) => quantity < 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading product details…" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">{error || "Product not found"}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
        >
          <IconArrowLeft className="h-4 w-4" />
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

        {/* Product Card */}
        <div className="rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
          {/* Image */}
          <div className="aspect-video bg-[#0F131B] overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.src = '';
                  e.target.className = 'h-full w-full flex items-center justify-center text-[#8B93A1] text-6xl';
                  e.target.alt = '📦';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl text-[#8B93A1]">
                📦
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
                  {product.name}
                </h1>
                <p className="mt-1 text-sm text-[#8B93A1]">{product.category || "Uncategorized"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`${FONT_MONO} text-xl font-semibold text-[#E8EAED]`}>
                  ₹{product.price}
                </span>
                <span
                  className={`${FONT_MONO} text-xs rounded-full border px-3 py-1 ${
                    isLowStock(product.availableQuantity)
                      ? "border-[#FB7185]/30 bg-[#FB7185]/20 text-[#FB7185]"
                      : "border-[#4ADE80]/30 bg-[#4ADE80]/20 text-[#4ADE80]"
                  }`}
                >
                  {product.availableQuantity} left
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-[#232A38] pt-6">
              <h2 className="text-sm font-semibold text-[#8B93A1]">Description</h2>
              <p className="mt-2 text-sm text-[#E8EAED] leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* Meta Info */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#232A38] pt-6 text-xs">
              <div>
                <span className="text-[#8B93A1]">Created</span>
                <p className="text-[#E8EAED]">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-[#8B93A1]">Last Updated</span>
                <p className="text-[#E8EAED]">{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-[#8B93A1]">Version</span>
                <p className={`${FONT_MONO} text-[#E8EAED]`}>{product.version || 0}</p>
              </div>
              <div>
                <span className="text-[#8B93A1]">Status</span>
                <p className={isLowStock(product.availableQuantity) ? "text-[#FB7185]" : "text-[#4ADE80]"}>
                  {isLowStock(product.availableQuantity) ? "⚠️ Low Stock" : "✅ In Stock"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-[#232A38] pt-6">
              {(isWarehouse || isAdmin) && (
                <Link
                  to={`/products/${product.id}/stock`}
                  className="inline-flex items-center gap-2 rounded-md bg-[#34D1BF]/20 border border-[#34D1BF]/30 px-4 py-2 text-sm font-medium text-[#34D1BF] hover:bg-[#34D1BF]/30 transition"
                >
                  <IconBox className="h-4 w-4" />
                  Update Stock
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md bg-[#38BDF8]/20 border border-[#38BDF8]/30 px-4 py-2 text-sm font-medium text-[#38BDF8] hover:bg-[#38BDF8]/30 transition"
                  >
                    <IconEdit className="h-4 w-4" />
                    Edit Product
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 rounded-md bg-[#FB7185]/20 border border-[#FB7185]/30 px-4 py-2 text-sm font-medium text-[#FB7185] hover:bg-[#FB7185]/30 transition"
                  >
                    <IconTrash className="h-4 w-4" />
                    Delete Product
                  </button>
                </>
              )}
            </div>

            {isLowStock(product.availableQuantity) && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#FB7185]/30 bg-[#FB7185]/10 px-4 py-3 text-sm text-[#FB7185]">
                <IconAlert className="h-4 w-4" />
                This product is running low on stock. Please restock soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;