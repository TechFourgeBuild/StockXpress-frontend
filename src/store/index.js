import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
// import productReducer from './slices/productSlice';
// import orderReducer from './slices/orderSlice';
// import adminReducer from './slices/adminSlice';

// ✅ Custom storage (localStorage)
const storage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value ? JSON.parse(value) : null);
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// ✅ 1. Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // products: productReducer,
  // orders: orderReducer,
  // admin: adminReducer,
});

// ✅ 2. Persist config
const persistConfig = {
  key: 'root',
  storage, // ✅ Custom storage use kar raha hai
  whitelist: ['auth'], // ✅ Sirf auth persist karo
};

// ✅ 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ 4. Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ✅ 5. Persistor
export const persistor = persistStore(store);