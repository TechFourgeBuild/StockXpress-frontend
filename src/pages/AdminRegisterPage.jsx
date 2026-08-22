import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { adminRegisterUser } from "../api/adminApi";
import {
  IconArrowLeft,
  IconUserPlus,
  IconAlert,
  IconCheckCircle,
} from "../utils/helpers";
import { showSuccess, showError, showPromise } from "../utils/toast";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "WAREHOUSE_MANAGER", // ✅ Default
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

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
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await showPromise(adminRegisterUser(formData), {
        loading: "Registering user...",
        success: `✅ ${formData.name} registered as ${formData.role}!`,
        error: "Failed to register user",
      });
      setSuccess(true);
      setRegisteredUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      // ✅ Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "WAREHOUSE_MANAGER",
      });

      setTimeout(() => {
        setSuccess(false);
        setRegisteredUser(null);
      }, 5000);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data || "Failed to register user. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <IconAlert className="h-12 w-12 text-[#FB7185]" />
        <p className="text-[#FB7185] text-lg">
          You don't have permission to access this page.
        </p>
        <Link
          to="/app"
          className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Back button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition mb-6"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="border-b border-[#232A38] pb-6">
          <div className="flex items-center gap-3">
            <IconUserPlus className="h-6 w-6 text-[#FF6B1A]" />
            <h1
              className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}
            >
              Register Team Member
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Create a new{" "}
            <span className="text-[#FF6B1A]">WAREHOUSE_MANAGER</span> or{" "}
            <span className="text-[#FF6B1A]">ADMIN</span> account
          </p>
        </div>

        {/* Success Message */}
        {success && registeredUser && (
          <div className="mt-6 rounded-md bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-4 py-4 text-sm text-[#4ADE80] flex items-start gap-3">
            <IconCheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">User registered successfully!</p>
              <p className="text-xs text-[#8B93A1] mt-1">
                {registeredUser.name} ({registeredUser.email}) →{" "}
                {registeredUser.role}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
              Full Name <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Raj Kumar"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
              Email <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. raj@warehouse.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
              Password <span className="text-[#FB7185]">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A] transition"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[#E8EAED] mb-1.5"
            >
              Role <span className="text-[#FB7185]">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md px-4 py-2.5 text-sm text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A] transition"
            >
              <option value="WAREHOUSE_MANAGER">🏭 Warehouse Manager</option>
              <option value="ADMIN">👑 Admin</option>
            </select>
            <p className="mt-1.5 text-xs text-[#8B93A1]">
              {formData.role === "WAREHOUSE_MANAGER"
                ? "Can manage inventory, update stock, and view all orders."
                : "Full access to everything — dashboard, users, products, and orders."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
              <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconUserPlus className="h-4 w-4" />
              {loading ? "Registering..." : "Register User"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "WAREHOUSE_MANAGER",
                });
                setError(null);
              }}
              className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
