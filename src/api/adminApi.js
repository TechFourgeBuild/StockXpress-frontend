import axiosInstance from './axiosConfig';

// ============================================================
// 📊 DASHBOARD STATS
// ============================================================

// ✅ Dashboard Stats
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/admin/dashboard');
  return response.data;
};

// ✅ Total Revenue
export const getTotalRevenue = async () => {
  const response = await axiosInstance.get('/admin/revenue');
  return response.data;
};

// ✅ Total Users
export const getTotalUsers = async () => {
  const response = await axiosInstance.get('/admin/users/count');
  return response.data;
};

// ✅ Total Products
export const getTotalProducts = async () => {
  const response = await axiosInstance.get('/admin/products/count');
  return response.data;
};

// ✅ Pending Orders
export const getPendingOrders = async () => {
  const response = await axiosInstance.get('/admin/orders/pending');
  return response.data;
};

// ✅ Low Stock Products Count
export const getLowStockProductsCount = async (threshold = 5) => {
  const response = await axiosInstance.get(`/admin/products/low-stock?threshold=${threshold}`);
  return response.data;
};

// ✅ 🆕 Low Stock Products List (for displaying products)
export const getLowStockProductsList = async (threshold = 5) => {
  const response = await axiosInstance.get(`/products/low-stock?threshold=${threshold}`);
  return response.data;
};

// ✅ Orders in Last N Days (Count)
export const getOrdersInLastDays = async (days = 7) => {
  const response = await axiosInstance.get(`/admin/orders/recent?days=${days}`);
  return response.data;
};

// ✅ 🆕 Recent Orders List (for displaying orders)
// ✅ Recent Orders — Handle both array and object
export const getRecentOrders = async (days = 7) => {
  const response = await axiosInstance.get(`/admin/orders/recent?days=${days}`);
  // ✅ If response is an array → return as is
  // ✅ If response is an object with count → return empty array
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // ✅ If response is a number (count) → fetch actual orders from /orders/all
  if (typeof response.data === 'number') {
    const ordersResponse = await axiosInstance.get('/orders/all');
    const allOrders = ordersResponse.data;
    // ✅ Filter orders from last N days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return allOrders.filter(o => new Date(o.createdAt) >= cutoff);
  }
  return [];
};

// ============================================================
// 👑 REGISTER USER WITH ROLE (ADMIN ONLY)
// ============================================================

/**
 * Register a new user with specific role (ADMIN only)
 * @param {Object} userData - { name, email, password, role }
 * @param {string} userData.name - Full name
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password (min 6 chars)
 * @param {string} userData.role - WAREHOUSE_MANAGER or ADMIN
 * @returns {Promise<string>} Success message
 */
export const adminRegisterUser = async (userData) => {
  const response = await axiosInstance.post('/admin/register', userData);
  return response.data;
};

// ============================================================
// 👥 USER MANAGEMENT (ADMIN ONLY)
// ============================================================

// ✅ Get all users
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

// ✅ Get user by ID
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/admin/users/${userId}`);
  return response.data;
};

// ✅ Update user role
export const updateUserRole = async (userId, role) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/role?role=${role}`
  );
  return response.data;
};

// ✅ Delete user
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
};