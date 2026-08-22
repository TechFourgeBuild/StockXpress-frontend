import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconArrowLeft, IconHome } from "../utils/helpers";

const FONT_DISPLAY = "font-['Space_Grotesk']";

const NotFoundPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center px-4 text-center">
      {/* 404 Illustration */}
      <div className="relative">
        <div className="text-9xl font-bold text-[#232A38] select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🔍
        </div>
      </div>

      {/* Message */}
      <h1 className={`${FONT_DISPLAY} mt-6 text-2xl font-semibold text-[#E8EAED] sm:text-3xl`}>
        Oops! Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#8B93A1]">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to={isAuthenticated ? "/app" : "/"}
          className="inline-flex items-center gap-2 rounded-md bg-[#FF6B1A] px-6 py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30]"
        >
          <IconHome className="h-4 w-4" />
          {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-md border border-[#232A38] bg-[#0F131B] px-6 py-2.5 text-sm font-medium text-[#8B93A1] transition-transform hover:-translate-y-0.5 hover:border-[#2A3244] hover:text-[#E8EAED]"
        >
          <IconArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-xs text-[#8B93A1]">
        If you believe this is a mistake, please contact support.
      </p>
    </div>
  );
};

export default NotFoundPage;