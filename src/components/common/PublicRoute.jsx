import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // ✅ Wait for auth to load
  if (loading) {
    return (
      <>
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-200 overflow-hidden select-none">
          {/* Subtle background glow effect */}
          <div className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm shadow-2xl">
            <Loader />
            <span className="text-sm font-medium tracking-wider text-slate-400 animate-pulse">
              Logging in...
            </span>
          </div>
        </div>
      </>
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
