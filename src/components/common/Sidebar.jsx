import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IconLayers,
  IconHome,
  IconBox,
  IconCart,
  IconClipboard,
  IconNotebook,
  IconChart,
  IconLogout,
  IconMenu,
  IconX,
  IconUsers,
  IconRupee,
  IconClock,
  IconAlert,
  IconArrowRight,
  IconUser,
  IconBag
} from "../../utils/helpers";

const ROLE_ACCENT = {
  ADMIN: '#FF6B1A',
  WAREHOUSE_MANAGER: '#34D1BF',
  CUSTOMER: '#5B8DEF',
};

const links = [
  { to: '/', label: 'Dashboard', icon: IconHome, roles: ['CUSTOMER', 'WAREHOUSE_MANAGER', 'ADMIN'] },
  { to: '/profile', label: 'Profile', icon: IconUser, roles: ['CUSTOMER', 'WAREHOUSE_MANAGER', 'ADMIN'] },
  { to: '/products', label: 'Products', icon: IconBox, roles: ['CUSTOMER', 'WAREHOUSE_MANAGER', 'ADMIN'] },
  { to: '/orders', label: 'Orders', icon: IconCart, roles: ['CUSTOMER'] },
  { to: '/orders/all', label: 'All Orders', icon: IconClipboard, roles: ['WAREHOUSE_MANAGER', 'ADMIN'] },
  { to: '/inventory/logs', label: 'Inventory Logs', icon: IconNotebook, roles: ['WAREHOUSE_MANAGER', 'ADMIN'] },
  { to: '/admin/dashboard', label: 'Admin Dashboard', icon: IconChart, roles: ['ADMIN'] },
];

const Sidebar = ({ open, onClose }) => {
  const { role } = useSelector((state) => state.auth);
  const accent = ROLE_ACCENT[role] ?? '#5B8DEF';
  const filteredLinks = links.filter((link) => link.roles.includes(role));

  return (
     <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-16 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}
 
      <aside
        className={`fixed inset-y-0 top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-[#232A38] bg-[#0B0E14] p-4 transition-transform duration-300 ease-in-out
          md:static md:top-0 md:z-0 md:h-auto md:min-h-[calc(100vh-4rem)] md:self-stretch md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-2 flex items-center justify-between md:hidden">
          <span className="text-xs uppercase tracking-[0.14em] text-[#8B93A1]">Menu</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#8B93A1] hover:bg-[#131720] hover:text-[#E8EAED]"
            aria-label="Close menu"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
 
        <nav className="space-y-1">
          {filteredLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-l-current bg-[#131720] text-[#E8EAED]'
                    : 'border-l-transparent text-[#8B93A1] hover:bg-[#131720] hover:text-[#E8EAED]'
                }`
              }
              style={({ isActive }) => (isActive ? { color: accent } : undefined)}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;