import axiosInstance from './axiosConfig';

// ============================================================
// 🔓 PUBLIC — Get all products
// ============================================================
/**
 * Get all products (Public)
 * @returns {Promise<Array>} List of all products
 */
export const getAllProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

// ============================================================
// 🔓 PUBLIC — Get product by ID
// ============================================================
/**
 * Get a single product by ID (Public)
 * @param {number} productId - The ID of the product
 * @returns {Promise<Object>} Product details
 */
export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

// ============================================================
// 🔓 PUBLIC — Get products by category
// ============================================================
/**
 * Get products filtered by category (Public)
 * @param {string} category - Category name
 * @returns {Promise<Array>} List of products in category
 */
export const getProductsByCategory = async (category) => {
  const response = await axiosInstance.get(`/products/category/${category}`);
  return response.data;
};

// ============================================================
// 🔓 PUBLIC — Get low stock products
// ============================================================
/**
 * Get products with low stock (Public)
 * @param {number} threshold - Stock threshold (default: 5)
 * @returns {Promise<Array>} List of low stock products
 */
export const getLowStockProducts = async (threshold = 5) => {
  const response = await axiosInstance.get(`/products/low-stock?threshold=${threshold}`);
  return response.data;
};

// ============================================================
// 👑 ADMIN — Create product
// ============================================================
/**
 * Create a new product (ADMIN only)
 * @param {Object} productData - Product details
 * @param {string} productData.name - Product name
 * @param {string} productData.description - Product description
 * @param {number} productData.price - Product price
 * @param {number} productData.availableQuantity - Initial stock
 * @param {string} productData.category - Product category
 * @param {string} productData.imageUrl - Product image URL
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};

// ============================================================
// 👑 ADMIN — Update product
// ============================================================
/**
 * Update an existing product (ADMIN only)
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product details
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.put(`/products/${productId}`, productData);
  return response.data;
};

// ============================================================
// 👑 ADMIN — Delete product
// ============================================================
/**
 * Delete a product (ADMIN only)
 * @param {number} productId - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`);
  return response.data;
};

// ============================================================
// 🏭 WAREHOUSE + ADMIN — Update stock
// ============================================================
/**
 * Update stock for a single product (WAREHOUSE_MANAGER or ADMIN)
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @param {string} reason - Reason for stock update
 * @returns {Promise<Object>} Updated product with new version
 */
export const updateStock = async (productId, quantity, reason) => {
  const response = await axiosInstance.patch(
    `/products/${productId}/stock?quantity=${quantity}&reason=${encodeURIComponent(reason)}`
  );
  return response.data;
};

// ============================================================
// 🏭 WAREHOUSE + ADMIN — Bulk stock update
// ============================================================
/**
 * Update stock for multiple products (WAREHOUSE_MANAGER or ADMIN)
 * @param {Array} updates - Array of stock update objects
 * @param {number} updates[].productId - Product ID
 * @param {number} updates[].quantity - New quantity
 * @param {string} updates[].reason - Reason for stock update
 * @returns {Promise<void>}
 */
export const bulkStockUpdate = async (updates) => {
  const response = await axiosInstance.patch('/products/stock/bulk', updates);
  return response.data;
};