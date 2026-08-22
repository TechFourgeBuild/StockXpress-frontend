import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";
import Layout from "./components/common/Layout";
import LandingPage from "./pages/LandingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import InventoryPage from "./pages/InventoryPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CreateProductPage from "./pages/CreateProductPage";
import StockUpdatePage from "./pages/StockUpdatePage";
import EditProductPage from "./pages/EditProductPage";
import BulkStockUpdatePage from "./pages/BulkStockUpdatePage";
import LowStockProductsPage from "./pages/LowStockProductsPage";

import PlaceOrderPage from "./pages/PlaceOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import AllOrdersPage from "./pages/AllOrdersPage";

import UserManagementPage from "./pages/UserManagementPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersRedirectPage from "./pages/OrdersRedirectPage";
import UserProfilePage from './pages/UserProfilePage';
import AdminRegisterPage from './pages/AdminRegisterPage';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ If authenticated → Home, else → Landing */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/app" replace /> : <LandingPage />
          }
        />

        {/* ✅ PUBLIC ROUTES — Redirect to /app if already authenticated */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ✅ Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/app" element={<HomePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/inventory/logs" element={<InventoryPage />} />
            <Route path="/products" element={<ProductsPage />} />

            {/* Product Details Route — WITH DYNAMIC ID */}
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/products/:id/stock" element={<StockUpdatePage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route
              path="/products/bulk-update"
              element={<BulkStockUpdatePage />}
            />
            <Route
              path="/products/low-stock"
              element={<LowStockProductsPage />}
            />

            {/* ORDER ROUTES  */}
            <Route path="/orders/place" element={<PlaceOrderPage />} />
            <Route path="/orders/my-orders" element={<MyOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/orders/all" element={<AllOrdersPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route
              path="/orders/confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="/orders" element={<OrdersRedirectPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
