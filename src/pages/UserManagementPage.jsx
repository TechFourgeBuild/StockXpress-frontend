import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getAllUsers, updateUserRole, deleteUser } from "../api/adminApi";
import {
  IconUsers,
  IconEdit,
  IconTrash,
  IconSearch,
  IconAlert,
  IconArrowLeft,
} from "../utils/helpers";
import { showSuccess, showError, showPromise } from "../utils/toast";

const FONT_DISPLAY = "font-['Space_Grotesk']";
const FONT_MONO = "font-['JetBrains_Mono']";

const ROLE_COLORS = {
  ADMIN: {
    bg: "bg-[#FF6B1A]/20",
    text: "text-[#FF6B1A]",
    border: "border-[#FF6B1A]/30",
  },
  WAREHOUSE_MANAGER: {
    bg: "bg-[#34D1BF]/20",
    text: "text-[#34D1BF]",
    border: "border-[#34D1BF]/30",
  },
  CUSTOMER: {
    bg: "bg-[#5B8DEF]/20",
    text: "text-[#5B8DEF]",
    border: "border-[#5B8DEF]/30",
  },
};

const UserManagementPage = () => {
  const { role } = useSelector((state) => state.auth);
  const isAdmin = role === "ADMIN";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const [deleting, setDeleting] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term),
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    setUpdating(userId);
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (err) {
      setError("Failed to update user role");
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"?`))
      return;

    // ✅ Set deleting state
    setDeleting(userId);
    setError(null);

    try {
      await showPromise(deleteUser(userId), {
        loading: "Deleting user...",
        success: `✅ "${userName}" deleted successfully!`,
        error: "Failed to delete user",
      });
      await fetchUsers();
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FB7185]">
          You don't have permission to manage users.
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
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#232A38] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <IconUsers className="h-6 w-6 text-[#FF6B1A]" />
              <h1
                className={`${FONT_DISPLAY} text-2xl font-semibold tracking-tight sm:text-3xl`}
              >
                User Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#8B93A1]">
              {filteredUsers.length} users registered on the platform
            </p>
          </div>
          <Link
            to="/admin/register"
            className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-4 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
          >
            <IconUsers className="h-4 w-4" />
            Register User
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0F131B] border border-[#232A38] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#E8EAED] placeholder-[#8B93A1] focus:outline-none focus:border-[#FF6B1A]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A]"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
            <option value="CUSTOMER">Customer</option>
          </select>

          <button
            onClick={fetchUsers}
            className="bg-[#0F131B] border border-[#232A38] rounded-md px-3 py-1.5 text-xs text-[#8B93A1] hover:text-[#E8EAED] transition"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-md bg-[#FB7185]/10 border border-[#FB7185]/30 px-4 py-3 text-sm text-[#FB7185] flex items-start gap-2">
            <IconAlert className="h-4 w-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader label="Loading users..." />
          </div>
        ) : !filteredUsers.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#232A38] px-6 py-16 text-center text-sm text-[#8B93A1]">
            <p className="text-4xl mb-3">👥</p>
            <p>No users found.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[#232A38] bg-[#131720] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#232A38] bg-[#0F131B]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-[#8B93A1] uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232A38]">
                  {filteredUsers.map((user) => {
                    const isDeleting = deleting === user.id;
                    const isUpdating = updating === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-[#0F131B] transition"
                      >
                        <td className="px-4 py-3 text-xs text-[#E8EAED]">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#8B93A1]">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`${FONT_MONO} text-xs rounded-full border px-2.5 py-0.5 ${ROLE_COLORS[user.role]?.bg} ${ROLE_COLORS[user.role]?.text} ${ROLE_COLORS[user.role]?.border}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#8B93A1]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {/* Role Update Dropdown */}
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleUpdate(user.id, e.target.value)
                              }
                              disabled={isUpdating || isDeleting}
                              className="bg-[#0F131B] border border-[#232A38] rounded-md px-2 py-1 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF6B1A] disabled:opacity-50"
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="WAREHOUSE_MANAGER">
                                Warehouse
                              </option>
                              <option value="ADMIN">Admin</option>
                            </select>

                            {/* ✅ Delete Button with Loader */}
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
                              disabled={isDeleting || isUpdating}
                              className="text-[#FB7185] hover:text-[#FB7185]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? (
                                <Loader size="sm" />
                              ) : (
                                <IconTrash className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
