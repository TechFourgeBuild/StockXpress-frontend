import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

const OrdersRedirectPage = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (role === "CUSTOMER") {
        navigate("/orders/my-orders", { replace: true });
      } else if (role === "WAREHOUSE_MANAGER" || role === "ADMIN") {
        navigate("/orders/all", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    }
  }, [role, isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <Loader label="Redirecting..." />
      </div>
    );
  }

  return null;
};

export default OrdersRedirectPage;