import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getCurrentUser } from "../api/authApi";
import { logout } from "../store/slices/authSlice";
import {
  IconUser,
  IconCalendar,
  IconClock,
  IconShield,
  IconLogOut,
  IconEdit,
  IconArrowLeft,
  IconCheckCircle,
  IconMail
} from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ROLE_COLORS = {
  ADMIN: { bg: "bg-[#FF6B1A]/20", text: "text-[#FF6B1A]", border: "border-[#FF6B1A]/30", label: "Admin" },
  WAREHOUSE_MANAGER: { bg: "bg-[#34D1BF]/20", text: "text-[#34D1BF]", border: "border-[#34D1BF]/30", label: "Warehouse Manager" },
  CUSTOMER: { bg: "bg-[#5B8DEF]/20", text: "text-[#5B8DEF]", border: "border-[#5B8DEF]/30", label: "Customer" },
};

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser, role, isAuthenticated } = useSelector((state) => state.auth);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile. Please try again.");
        // ✅ Fallback to auth state if API fails
        if (authUser) {
          setUser({
            name: authUser.name,
            email: authUser.email,
            role: role,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, authUser, role]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Loading profile..." />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">{error}</p>
        <Link to="/app" className="text-sm text-[#8B93A1] hover:text-[#E8EAED] transition">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.CUSTOMER;
  const displayUser = user || authUser;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Back button */}
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-[#8B93A1] hover:text-[#E8EAED] transition mb-6"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Profile Card */}
        <div className="rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
          {/* Header with gradient line */}
          <div className="h-2" style={{ background: `linear-gradient(90deg, ${roleStyle.text}40, ${roleStyle.text})` }} />

          <div className="p-6 sm:p-8">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div
                className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 text-4xl font-bold ${roleStyle.bg} ${roleStyle.border}`}
                style={{ color: roleStyle.text }}
              >
                {displayUser?.name?.charAt(0).toUpperCase() || "👤"}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}>
                  {displayUser?.name || "User"}
                </h1>
                <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span
                    className={`${FONT_MONO} text-xs rounded-full border px-3 py-1 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                  >
                    {roleStyle.label}
                  </span>
                  <span className="text-xs text-[#8B93A1]">
                    {displayUser?.email || "No email"}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md bg-[#FB7185]/20 border border-[#FB7185]/30 px-4 py-2 text-sm font-medium text-[#FB7185] hover:bg-[#FB7185]/30 transition shrink-0"
              >
                <IconLogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            {/* User Details Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#232A38] bg-[#0F131B] p-4">
                <div className="flex items-center gap-3">
                  <IconMail className="h-4 w-4 text-[#8B93A1]" />
                  <div>
                    <p className="text-xs text-[#8B93A1]">Email</p>
                    <p className="text-sm font-medium text-[#E8EAED]">{displayUser?.email || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#232A38] bg-[#0F131B] p-4">
                <div className="flex items-center gap-3">
                  <IconShield className="h-4 w-4 text-[#8B93A1]" />
                  <div>
                    <p className="text-xs text-[#8B93A1]">Role</p>
                    <p className="text-sm font-medium text-[#E8EAED]">{roleStyle.label}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#232A38] bg-[#0F131B] p-4">
                <div className="flex items-center gap-3">
                  <IconCalendar className="h-4 w-4 text-[#8B93A1]" />
                  <div>
                    <p className="text-xs text-[#8B93A1]">Joined</p>
                    <p className="text-sm font-medium text-[#E8EAED]">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#232A38] bg-[#0F131B] p-4">
                <div className="flex items-center gap-3">
                  <IconClock className="h-4 w-4 text-[#8B93A1]" />
                  <div>
                    <p className="text-xs text-[#8B93A1]">Last Updated</p>
                    <p className="text-sm font-medium text-[#E8EAED]">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-based Quick Actions */}
            <div className="mt-8 pt-6 border-t border-[#232A38]">
              <h3 className="text-sm font-semibold text-[#8B93A1] mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {role === "CUSTOMER" && (
                  <>
                    <Link
                      to="/orders/place"
                      className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-[#0B0E14] hover:bg-[#FF7A30] transition"
                    >
                      🛒 Place Order
                    </Link>
                    <Link
                      to="/orders/my-orders"
                      className="inline-flex items-center gap-2 rounded-md bg-[#0F131B] border border-[#232A38] px-4 py-2 text-sm font-medium text-[#8B93A1] hover:text-[#E8EAED] transition"
                    >
                      📦 My Orders
                    </Link>
                  </>
                )}

                {role === "WAREHOUSE_MANAGER" && (
                  <>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 rounded-md bg-[#34D1BF] px-4 py-2 text-sm font-medium text-[#0B0E14] hover:bg-[#2BB8A6] transition"
                    >
                      📦 Manage Inventory
                    </Link>
                    <Link
                      to="/orders/all"
                      className="inline-flex items-center gap-2 rounded-md bg-[#0F131B] border border-[#232A38] px-4 py-2 text-sm font-medium text-[#8B93A1] hover:text-[#E8EAED] transition"
                    >
                      📋 All Orders
                    </Link>
                  </>
                )}

                {role === "ADMIN" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2 text-sm font-medium text-[#0B0E14] hover:bg-[#FF7A30] transition"
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="inline-flex items-center gap-2 rounded-md bg-[#0F131B] border border-[#232A38] px-4 py-2 text-sm font-medium text-[#8B93A1] hover:text-[#E8EAED] transition"
                    >
                      👥 Manage Users
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 rounded-md bg-[#0F131B] border border-[#232A38] px-4 py-2 text-sm font-medium text-[#8B93A1] hover:text-[#E8EAED] transition"
                    >
                      📦 Products
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;