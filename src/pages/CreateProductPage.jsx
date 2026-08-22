import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct } from "../api/productApi";
import { IconArrowLeft, IconPlus } from "../utils/helpers";
import { showSuccess, showError, showPromise } from "../utils/toast";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // ✅ Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      setLoading(false);
      return;
    }

    if (
      !formData.availableQuantity ||
      parseInt(formData.availableQuantity) < 0
    ) {
      setError("Quantity cannot be negative");
      setLoading(false);
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

      await showPromise(createProduct(productData), {
        loading: "Creating product...",
        success: `✅ "${productData.name}" created successfully!`,
        error: "Failed to create product",
      });
      setSuccess(true);

      // ✅ Reset form after success
      setFormData({
        name: "",
        description: "",
        price: "",
        availableQuantity: "",
        category: "",
        imageUrl: "",
      });

      // ✅ Redirect after 2 seconds
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
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
          <h1
            className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}
          >
            ➕ Create Product
          </h1>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Add a new product to your catalog
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
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
              <label
                htmlFor="price"
                className="block text-sm font-medium text-[#E8EAED] mb-1.5"
              >
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
              <label
                htmlFor="availableQuantity"
                className="block text-sm font-medium text-[#E8EAED] mb-1.5"
              >
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
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
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
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
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

          {/* Error / Success Messages */}
          {error && (
            <div className="rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-4 py-3 text-sm text-[#4ADE80]">
              ✅ Product created successfully! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
