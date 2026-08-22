import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { IconLayers, IconLogout, IconMenu } from '../../utils/helpers'; // ← adjust path if icons live in utils/helpers
import Loader from './Loader'; // ← adjust to wherever Loader.jsx lives

const ROLE_STYLES = {
  ADMIN: { label: 'Admin', color: '#FF6B1A', bg: 'bg-[#FF6B1A]/10', border: 'border-[#FF6B1A]/30' },
  WAREHOUSE_MANAGER: { label: 'Warehouse Manager', color: '#34D1BF', bg: 'bg-[#34D1BF]/10', border: 'border-[#34D1BF]/30' },
  CUSTOMER: { label: 'Customer', color: '#5B8DEF', bg: 'bg-[#5B8DEF]/10', border: 'border-[#5B8DEF]/30' },
};

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const roleStyle = ROLE_STYLES[role] ?? ROLE_STYLES.CUSTOMER;
  const initials = (user?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {loggingOut && <Loader fullScreen label="Logging you out…" />}

      <nav className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#232A38] bg-[#0B0E14]/95 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-[#232A38] text-[#8B93A1] transition-colors hover:bg-[#131720] hover:text-[#E8EAED] md:hidden"
            aria-label="Open menu"
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#2A3244] bg-[#131720] text-[#34D1BF]">
              <IconLayers className="h-4 w-4" />
            </span>
            <span className="font-['Space_Grotesk'] text-lg font-semibold tracking-tight text-[#E8EAED]">
              StockXpress
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border font-['JetBrains_Mono'] text-xs font-medium ${roleStyle.bg} ${roleStyle.border}`}
              style={{ color: roleStyle.color }}
            >
              {initials}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-[#E8EAED]">{user?.name || 'User'}</p>
              <p className="text-xs" style={{ color: roleStyle.color }}>
                {roleStyle.label}
              </p>
            </div>
          </div>

          {/* Compact role pill for small screens */}
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full border font-['JetBrains_Mono'] text-xs font-medium sm:hidden ${roleStyle.bg} ${roleStyle.border}`}
            style={{ color: roleStyle.color }}
          >
            {initials}
          </span>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#232A38] px-2.5 py-1.5 text-xs font-medium text-[#8B93A1] transition-colors hover:border-[#FF6B1A]/40 hover:text-[#FF6B1A] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
          >
            <IconLogout className="h-4 w-4" />
            <span className="hidden sm:inline">{loggingOut ? 'Logging out…' : 'Logout'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;