import axiosInstance from './axiosConfig';

// ============================================================
// 1️⃣ GET INVENTORY LOGS BY PRODUCT ID
// ============================================================
/**
 * Get all inventory logs for a specific product
 * @param {number} productId - The ID of the product
 * @returns {Promise<Array>} List of inventory logs
 */
export const getInventoryLogsByProduct = async (productId) => {
  const response = await axiosInstance.get(`/inventory/logs/product/${productId}`);
  return response.data;
};

// ============================================================
// 2️⃣ GET INVENTORY LOGS BY USER ID
// ============================================================
/**
 * Get all inventory logs performed by a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} List of inventory logs
 */
export const getInventoryLogsByUser = async (userId) => {
  const response = await axiosInstance.get(`/inventory/logs/user/${userId}`);
  return response.data;
};

// ============================================================
// 3️⃣ GET INVENTORY LOGS BY CHANGE TYPE
// ============================================================
/**
 * Get inventory logs filtered by change type
 * @param {string} changeType - ADDED, DEDUCTED, or ADJUSTED
 * @returns {Promise<Array>} List of inventory logs
 */
export const getInventoryLogsByChangeType = async (changeType) => {
  const response = await axiosInstance.get(`/inventory/logs/type/${changeType}`);
  return response.data;
};

// ============================================================
// 4️⃣ GET LATEST INVENTORY LOG FOR A PRODUCT
// ============================================================
/**
 * Get the most recent inventory log for a specific product
 * @param {number} productId - The ID of the product
 * @returns {Promise<Object>} Latest inventory log
 */
export const getLatestInventoryLog = async (productId) => {
  const response = await axiosInstance.get(`/inventory/logs/latest/${productId}`);
  return response.data;
};

// ============================================================
// 5️⃣ GET ALL INVENTORY LOGS (ADMIN ONLY)
// ============================================================
/**
 * Get all inventory logs (requires ADMIN role)
 * @returns {Promise<Array>} All inventory logs
 */
export const getAllInventoryLogs = async () => {
  const response = await axiosInstance.get('/inventory/logs/all');
  return response.data;
};