import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../../api/orderApi';

// ============================================================
// ✅ ASYNC THUNKS
// ============================================================

// ✅ Place order
export const placeNewOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await placeOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to place order');
    }
  }
);

// ✅ Get my orders
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMyOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// ✅ Get order by ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getOrderById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

// ✅ Get order by number
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumber(orderNumber);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order');
    }
  }
);

// ✅ Cancel order
export const cancelExistingOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const data = await cancelOrder(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order');
    }
  }
);

// ✅ Get all orders (Admin/Warehouse)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all orders');
    }
  }
);

// ✅ Update order status
export const updateOrderStatusById = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatus(id, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update order status');
    }
  }
);

// ✅ Update payment status
export const updatePaymentStatusById = createAsyncThunk(
  'orders/updatePayment',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const data = await updatePaymentStatus(id, paymentStatus);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update payment status');
    }
  }
);

// ============================================================
// ✅ SLICE
// ============================================================

const initialState = {
  myOrders: [],
  allOrders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  totalOrders: 0,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.myOrders = [];
      state.allOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Place Order
      .addCase(placeNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.unshift(action.payload);
        state.totalOrders += 1;
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
        state.totalOrders = action.payload.length;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Order by Number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Cancel Order
      .addCase(cancelExistingOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.myOrders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          state.myOrders[index] = updatedOrder;
        }
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })

      // ✅ Fetch All Orders (Admin/Warehouse)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
        state.totalOrders = action.payload.length;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update Order Status
      .addCase(updateOrderStatusById.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        // ✅ Update in myOrders
        const myIndex = state.myOrders.findIndex((o) => o.id === updatedOrder.id);
        if (myIndex !== -1) {
          state.myOrders[myIndex] = updatedOrder;
        }
        // ✅ Update in allOrders
        const allIndex = state.allOrders.findIndex((o) => o.id === updatedOrder.id);
        if (allIndex !== -1) {
          state.allOrders[allIndex] = updatedOrder;
        }
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      })

      // ✅ Update Payment Status
      .addCase(updatePaymentStatusById.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const myIndex = state.myOrders.findIndex((o) => o.id === updatedOrder.id);
        if (myIndex !== -1) {
          state.myOrders[myIndex] = updatedOrder;
        }
        const allIndex = state.allOrders.findIndex((o) => o.id === updatedOrder.id);
        if (allIndex !== -1) {
          state.allOrders[allIndex] = updatedOrder;
        }
        if (state.selectedOrder?.id === updatedOrder.id) {
          state.selectedOrder = updatedOrder;
        }
      });
  },
});

export const { clearSelectedOrder, clearError, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;