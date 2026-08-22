import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { getProductById, updateProduct } from "../api/productApi";
import { IconArrowLeft, IconEdit, IconAlert } from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    availableQuantity: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          availableQuantity: data.availableQuantity || "",
          category: data.category || "",
          imageUrl: data.imageUrl || "",
        });
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

    // ✅ Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      setSubmitting(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      setSubmitting(false);
      return;
    }

    if (!formData.availableQuantity || parseInt(formData.availableQuantity) < 0) {
      setError("Quantity cannot be negative");
      setSubmitting(false);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      setSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        availableQuantity: parseInt(formData.availableQuantity),
        category: formData.category.trim(),
        imageUrl: formData.imageUrl.trim() || null,
      };

      await updateProduct(id, productData);
      setSuccess(true);

      // ✅ Refresh product data
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
      setFormData({
        name: updatedProduct.name || "",
        description: updatedProduct.description || "",
        price: updatedProduct.price || "",
        availableQuantity: updatedProduct.availableQuantity || "",
        category: updatedProduct.category || "",
        imageUrl: updatedProduct.imageUrl || "",
      });

      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product. Please try again.");
      console.error("Product update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">You don't have permission to edit products.</p>
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
            <IconEdit className="h-6 w-6 text-[#38BDF8]" />
            <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              Edit Product
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Editing: <span className="text-[#E8EAED]">{product.name}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Product Name <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. iPhone 16 Pro Max"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition resize-y"
            />
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
                Price (₹) <span className="text-[#FB7185]">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
              />
            </div>

            <div>
              <label htmlFor="availableQuantity" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
                Quantity <span className="text-[#FB7185]">*</span>
              </label>
              <input
                id="availableQuantity"
                name="availableQuantity"
                type="number"
                min="0"
                required
                placeholder="0"
                value={formData.availableQuantity}
                onChange={handleChange}
                className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Category <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              placeholder="e.g. Electronics, Grocery, Fashion"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-[#E8EAED] mb-1.5">
              Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
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
              ✅ Product updated successfully! Redirecting...
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center gap-2 rounded-md bg-[#38BDF8] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#2BA0E0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconEdit className="h-4 w-4" />
              {submitting ? "Updating..." : "Update Product"}
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

export default EditProductPage;