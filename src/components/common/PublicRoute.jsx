import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // ✅ Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="text-[#E8EAED]">Loading...</div>
      </div>
    );
  }

  // ✅ If authenticated → redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  // ✅ If not authenticated → show public page
  return <Outlet />;
};

export default PublicRoute;