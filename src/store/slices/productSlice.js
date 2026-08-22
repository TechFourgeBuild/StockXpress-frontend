import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  bulkStockUpdate,
  getLowStockProducts,
} from '../../api/productApi';

// ============================================================
// ✅ ASYNC THUNKS
// ============================================================

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// ✅ Fetch product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product');
    }
  }
);

// ✅ Create product
export const createNewProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const data = await createProduct(productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create product');
    }
  }
);

// ✅ Update product
export const updateExistingProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const data = await updateProduct(id, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

// ✅ Delete product
export const deleteExistingProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

// ✅ Update stock
export const updateProductStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, quantity, reason }, { rejectWithValue }) => {
    try {
      const data = await updateStock(id, quantity, reason);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update stock');
    }
  }
);

// ✅ Bulk stock update
export const bulkUpdateStock = createAsyncThunk(
  'products/bulkUpdateStock',
  async (updates, { rejectWithValue }) => {
    try {
      await bulkStockUpdate(updates);
      return updates;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Bulk stock update failed');
    }
  }
);

// ✅ Fetch low stock products
export const fetchLowStockProducts = createAsyncThunk(
  'products/fetchLowStock',
  async (threshold = 5, { rejectWithValue }) => {
    try {
      const data = await getLowStockProducts(threshold);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch low stock products');
    }
  }
);

// ============================================================
// ✅ SLICE
// ============================================================

const initialState = {
  items: [],
  selectedProduct: null,
  lowStockItems: [],
  loading: false,
  error: null,
  totalProducts: 0,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLowStock: (state) => {
      state.lowStockItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalProducts = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create Product
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalProducts += 1;
      })

      // ✅ Update Product
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })

      // ✅ Delete Product
      .addCase(deleteExistingProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.totalProducts -= 1;
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })

      // ✅ Update Stock
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })

      // ✅ Bulk Stock Update
      .addCase(bulkUpdateStock.fulfilled, (state) => {
        // ✅ Refetch products to get updated stock
        // This will be handled by the component
      })

      // ✅ Fetch Low Stock Products
      .addCase(fetchLowStockProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockItems = action.payload;
      })
      .addCase(fetchLowStockProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct, clearError, clearLowStock } = productSlice.actions;
export default productSlice.reducer;