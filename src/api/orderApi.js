import axiosInstance from './axiosConfig';

// ============================================================
// 🔒 AUTHENTICATED — Place order
// ============================================================
/**
 * Place a new order
 * @param {Object} orderData - Order details
 * @param {string} orderData.shippingAddress - Shipping address
 * @param {Array} orderData.items - Array of items { productId, quantity }
 * @returns {Promise<Object>} Created order
 */
export const placeOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData);
  return response.data;
};

// ============================================================
// 🔒 AUTHENTICATED — Get current user's orders
// ============================================================
/**
 * Get all orders of the logged-in user
 * @returns {Promise<Array>} List of orders
 */
export const getMyOrders = async () => {
  const response = await axiosInstance.get('/orders/my-orders');
  return response.data;
};

// ============================================================
// 🔒 AUTHENTICATED — Get order by ID
// ============================================================
/**
 * Get a single order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`);
  return response.data;
};

// ============================================================
// 🔒 AUTHENTICATED — Get order by order number
// ============================================================
/**
 * Get a single order by order number
 * @param {string} orderNumber - Order number (e.g., ORD-ABC123)
 * @returns {Promise<Object>} Order details
 */
export const getOrderByNumber = async (orderNumber) => {
  const response = await axiosInstance.get(`/orders/number/${orderNumber}`);
  return response.data;
};

// ============================================================
// 🔒 AUTHENTICATED — Cancel order
// ============================================================
/**
 * Cancel an order (only if not delivered/cancelled)
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Updated order
 */
export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

// ============================================================
// 👑 ADMIN + WAREHOUSE — Get all orders
// ============================================================
/**
 * Get all orders (ADMIN or WAREHOUSE_MANAGER only)
 * @returns {Promise<Array>} List of all orders
 */
export const getAllOrders = async () => {
  const response = await axiosInstance.get('/orders/all');
  return response.data;
};

// ============================================================
// 👑 ADMIN + WAREHOUSE — Update order status
// ============================================================
/**
 * Update order status (ADMIN or WAREHOUSE_MANAGER only)
 * @param {number} orderId - Order ID
 * @param {string} status - PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.patch(
    `/orders/${orderId}/status?status=${status}`
  );
  return response.data;
};

// ============================================================
// 👑 ADMIN — Update payment status
// ============================================================
/**
 * Update payment status (ADMIN only)
 * @param {number} orderId - Order ID
 * @param {string} paymentStatus - PENDING, PAID, FAILED, REFUNDED
 * @returns {Promise<Object>} Updated order
 */
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  const response = await axiosInstance.patch(
    `/orders/${orderId}/payment?paymentStatus=${paymentStatus}`
  );
  return response.data;
};