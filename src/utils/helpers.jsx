// Shared inline icon set — dependency-free, matches the StockXpress design tokens.
import {
  Filter,
  Box,
  Clipboard,
  Users,
  IndianRupee,
  Clock,
  AlertCircle,
  ArrowRight,
  Layers,
  Notebook,
  UserPlus,
  Plus,
  User,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Calendar,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Truck,
  PackageCheck,
  ArrowLeft,
  // User,
  // IconShoppingCart
  Mail
} from "lucide-react";

// ✅ Rename as per your usage
// export const IconFilter = Filter;
// export const IconBox = Box;
// export const IconClipboard = Clipboard;
// export const IconUsers = Users;
// export const IconRupee = IndianRupee;
// export const IconClock = Clock;
// export const IconAlert = AlertCircle;
// export const IconArrowRight = ArrowRight;
// export const IconLayers = Layers;
// export const IconNotebook = Notebook;
// export const IconUserPlus = UserPlus;
// export const IconPlus = Plus;
// export const IconUser = User;
// export const IconPackage = Package;
export const IconMail = Mail;
export const IconUser = User;
export const IconShoppingBag = ShoppingBag;
export const IconLogOut = LogOut;
export const IconMenu = Menu;
export const IconX = X;
export const IconHome = Home;
export const IconTrendingUp = TrendingUp;
export const IconCalendar = Calendar;
// export const IconShoppingCart = IconShoppingCart;
export const IconSearch = Search;
export const IconEye = Eye;
export const IconEdit = Edit;
export const IconTrash = Trash2;
export const IconCheckCircle = CheckCircle;
export const IconXCircle = XCircle;
export const IconShoppingCart = ShoppingCart;
export const IconTruck = Truck;
export const IconPackageCheck = PackageCheck;
export const IconArrowLeft = ArrowLeft;
export const IconPackage = Package;

export const IconLayers = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
    <path d="m3 13 9 5 9-5" strokeLinejoin="round" />
  </svg>
);

// export const IconHome = (p) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...p}>
//     <path d="M4 11.5 12 4l8 7.5" strokeLinejoin="round" />
//     <path d="M6 10v9a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1v-9" strokeLinejoin="round" />
//   </svg>
// );

export const IconBox = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
    <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
  </svg>
);

export const IconCart = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
    <path
      d="M2.5 3h2.4l2.1 11.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7.5H6"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconClipboard = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M9 11h6M9 15h6M9 19h3" />
  </svg>
);

export const IconNotebook = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 3v18M12 8h6M12 12h6M12 16h4" />
  </svg>
);

export const IconFilter = ({ className = "h-5 w-5", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
  </svg>
);

export const IconChart = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M4 20V10M11 20V4M18 20v-7" />
    <path d="M2.5 20h19" />
  </svg>
);

export const IconLogout = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5M21 12H9" strokeLinejoin="round" />
  </svg>
);

// export const IconMenu = (p) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...p}>
//     <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
//   </svg>
// );

// export const IconX = (p) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...p}>
//     <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
//   </svg>
// );

export const IconUsers = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c.7-3.4 3.2-5.5 6.5-5.5s5.8 2.1 6.5 5.5" />
    <circle cx="17.5" cy="8.5" r="2.4" />
    <path d="M21.5 20c-.4-2.2-1.5-3.9-3-4.8" />
  </svg>
);

export const IconRupee = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path
      d="M7 4h10M7 9h10M7 4c4 0 6 1.8 6 4.5S11 13 7 13h9M7 13l7 8"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconClock = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconAlert = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const IconBag = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconLock = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const IconBolt = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
  </svg>
);

export const IconShield = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path
      d="M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6L12 3Z"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCheck = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...p}
  >
    <path
      d="M4 12.5 9.5 18 20 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconPlus = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const IconUserPlus = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...p}
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c.7-3.4 3.2-5.5 6.5-5.5s5.8 2.1 6.5 5.5" />
    <path d="M18 8v5M15.5 10.5h5" strokeLinecap="round" />
  </svg>
);

export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
