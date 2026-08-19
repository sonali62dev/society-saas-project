"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  Shield,
  Users,
  Wrench,
  Bell,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  Package,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Headphones,
  BookOpen,
  ShoppingCart,
  ShoppingBag,
  Truck,
  UserCheck,
  Scale,
  Receipt,
  Building,
  MessageCircle,
  PackageCheck,
  Car,
  CreditCard,
  History as HistoryIcon,
  User,
  Megaphone,
  QrCode,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useFeatureFlags } from "@/lib/hooks/use-feature-flags";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const allMenuItems = [
  // ==========================================
  // SUPER ADMIN ONLY - Simplified Control Center
  // ==========================================
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    badge: null,
    roles: [
      "super_admin",
      "admin",
      "resident",
      "guard",
      "vendor",
      "individual",
    ],
  },
  {
    title: "Admins",
    icon: Users,
    href: "/dashboard/super-admin/users/admins",
    roles: ["super_admin"],
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "/dashboard/super-admin/billing/invoices",
    roles: ["super_admin"],
  },
  {
    title: "Subscription Plans",
    icon: Package,
    href: "/dashboard/super-admin/billing/subscriptions",
    roles: ["super_admin"],
  },
  {
    title: "Setting",
    icon: Settings,
    href: "/dashboard/super-admin/settings",
    roles: ["super_admin"],
  },

  // ==========================================
  // GUARD / SECURITY STAFF
  // ==========================================
  {
    title: "Guard Station",
    icon: Shield,
    href: "/dashboard/guard",
    roles: ["guard"],
    submenu: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard/guard/dashboard",
      },
      {
        title: "Check-in Visitors",
        icon: UserCheck,
        href: "/dashboard/security/visitors",
      },
      {
        title: "Domestic Helpers",
        icon: Users,
        href: "/dashboard/staff/maids",
      },
      { title: "Parcels", icon: Package, href: "/dashboard/security/parcels" },
      {
        title: "Chat with Residents",
        icon: MessageCircle,
        href: "/dashboard/guard/chat",
      },
    ],
  },
  // ==========================================
  // VENDOR
  // ==========================================
  {
    title: "Vendor Hub",
    icon: LayoutDashboard,
    href: "/dashboard/vendor",
    roles: ["vendor"],
    submenu: [
      { title: "Dashboard Overview", icon: LayoutDashboard, href: "/dashboard/vendor" },
      { title: "My Leads & Orders", icon: ClipboardList, href: "/dashboard/vendor/leads" },
      { title: "Earning Stats & Revenue", icon: TrendingUp, href: "/dashboard/vendor/analytics" },
    ],
  },

  // ==========================================
  // RESIDENT ONLY
  // ==========================================
  {
    title: "My Unit",
    icon: Home,
    href: "/dashboard/my-unit",
    roles: ["resident"],
  },

  // ==========================================
  // SHARED (Admin, Resident, Guard - NOT Super Admin)
  // ==========================================
  {
    title: "SOS / Emergency",
    icon: AlertTriangle,
    href: "/dashboard/sos",
    badge: null,
    roles: ["resident", "guard"],
  },
  {
    title: "Updates & Guidelines",
    icon: BookOpen,
    href: "/dashboard/guidelines/updates",
    roles: ["resident", "admin", "individual", "vendor", "guard"],
  },
  {
    title: "Services",
    icon: Wrench,
    href: "/dashboard/services",
    roles: ["admin", "resident", "individual"],
  },
  {
    title: "QR Access",
    icon: Shield,
    href: "/dashboard/qr-access",
    roles: ["resident", "individual"],
  },
  {
    title: "Help & Support",
    icon: Headphones,
    href: "/dashboard/helpdesk",
    roles: ["super_admin", "admin", "resident", "committee"],
    submenu: [
      {
        title: "My Tickets",
        icon: ClipboardList,
        href: "/dashboard/helpdesk/tickets",
      },
      {
        title: "Live Chat",
        icon: MessageCircle,
        href: "/dashboard/helpdesk/chat",
      },
    ],
  },

  // ==========================================
  // SOCIETY ADMIN ONLY - Society Level Operations
  // ==========================================
  {
    title: "Financial",
    icon: Wallet,
    href: "/dashboard/financial",
    roles: ["admin"],
    submenu: [
      {
        title: "Billing",
        icon: FileText,
        href: "/dashboard/financial/billing",
      },
      {
        title: "Invoices",
        icon: FileText,
        href: "/dashboard/financial/invoices",
      },
      {
        title: "Payments",
        icon: TrendingUp,
        href: "/dashboard/financial/payments",
      },
      {
        title: "Wallet Management",
        icon: Wallet,
        href: "/dashboard/financial/wallets",
      },
      {
        title: "Billing Setup",
        icon: Settings,
        href: "/dashboard/financial/billing/config",
      },
      {
        title: "Platform Invoices",
        icon: Receipt,
        href: "/dashboard/financial/platform-invoices",
      },
    ],
  },
  {
    title: "Accounting",
    icon: BookOpen,
    href: "/dashboard/accounting",
    roles: ["admin"],
    submenu: [
      {
        title: "Income & Expense",
        icon: TrendingUp,
        href: "/dashboard/accounting/income-expense",
      },
      {
        title: "General Ledger",
        icon: BookOpen,
        href: "/dashboard/accounting/ledger",
      },
      {
        title: "Trial Balance",
        icon: Scale,
        href: "/dashboard/accounting/trial-balance",
      },
      {
        title: "Journal Entries",
        icon: FileText,
        href: "/dashboard/accounting/journal",
      },
      {
        title: "Bank Management",
        icon: Building,
        href: "/dashboard/accounting/bank",
      },
      {
        title: "Vendor Payments",
        icon: Receipt,
        href: "/dashboard/accounting/vendor-payments",
      },
    ],
  },
  {
    title: "Purchase",
    icon: ShoppingCart,
    href: "/dashboard/purchase",
    roles: ["admin"],
    submenu: [
      {
        title: "Purchase Requests",
        icon: FileText,
        href: "/dashboard/purchase/requests",
      },
      {
        title: "Purchase Orders",
        icon: ShoppingCart,
        href: "/dashboard/purchase/orders",
      },
      {
        title: "GR/SR",
        icon: PackageCheck,
        href: "/dashboard/purchase/receipts",
      },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    href: "/dashboard/security",
    badge: 3,
    roles: ["admin"],
    submenu: [
      { title: "Visitors", icon: Users, href: "/dashboard/security/visitors" },
      { title: "Vehicles", icon: Car, href: "/dashboard/security/vehicles" },
      { title: "Parcels", icon: Package, href: "/dashboard/security/parcels" },
      { title: "Gate QR", icon: QrCode, href: "/dashboard/security/gate-qr" },
      {
        title: "Incident Logs & Patrolling",
        icon: HistoryIcon,
        href: "/dashboard/security/security-logs",
      },
    ],
  },
  {
    title: "Parking",
    icon: Car,
    href: "/dashboard/parking",
    roles: ["admin"],
    submenu: [
      { title: "Slot Management", icon: Car, href: "/dashboard/parking/slots" },
      {
        title: "Payments",
        icon: CreditCard,
        href: "/dashboard/parking/payments",
      },
    ],
  },
  {
    title: "Staff Management",
    icon: Users,
    href: "/dashboard/staff",
    roles: ["admin"],
    submenu: [
      {
        title: "Security Guards",
        icon: Shield,
        href: "/dashboard/staff/guards",
      },
      {
        title: "Domestic Helpers",
        icon: Users,
        href: "/dashboard/staff/maids",
      },
    ],
  },
  {
    title: "Move In/Out",
    icon: Truck,
    href: "/dashboard/move-management",
    roles: ["admin", "resident"],
  },

  // ==========================================
  // RESIDENT - Community Features
  // ==========================================
  {
    title: "Community Feed",
    icon: MessageSquare,
    href: "/dashboard/resident/community",
    roles: ["resident"],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    href: "/dashboard/resident/market",
    roles: ["resident"],
  },
  {
    title: "Property / Investment",
    icon: Building2,
    href: "/dashboard/residents/property-leads",
    roles: ["resident", "individual"],
  },
  {
    title: "Rental Agreements",
    icon: FileText,
    href: "/dashboard/residents/rental-agreements",
    roles: ["resident", "individual"],
  },
  {
    title: "Amenities",
    icon: Calendar,
    href: "/dashboard/residents/amenities",
    roles: ["resident"],
  },
  {
    title: "Society Dues",
    icon: CreditCard,
    href: "/dashboard/residents/dues",
    roles: ["resident"],
  },


  // ==========================================
  // SOCIETY ADMIN - Resident Management
  // ==========================================
  {
    title: "Residents",
    icon: Users,
    href: "/dashboard/residents",
    roles: ["admin"],
    submenu: [
      {
        title: "Directory",
        icon: Users,
        href: "/dashboard/residents/directory",
      },
      {
        title: "Amenities",
        icon: Calendar,
        href: "/dashboard/residents/amenities",
      },
      { title: "Events", icon: Calendar, href: "/dashboard/residents/events" },
      { title: 'Notices', icon: Bell, href: '/dashboard/residents/notices' },
    ],
  },
  {
    title: "Administration",
    icon: Wrench,
    href: "/dashboard/admin",
    roles: ["admin"],
    submenu: [
      { title: "Tenants", icon: UserCheck, href: "/dashboard/admin/tenants" },
      {
        title: "Complaints",
        icon: ClipboardList,
        href: "/dashboard/admin/complaints",
      },
      { title: "Assets", icon: Package, href: "/dashboard/admin/assets" },
      { title: "Vendors", icon: Users, href: "/dashboard/admin/vendors" },
      {
        title: "Defaulters",
        icon: AlertTriangle,
        href: "/dashboard/admin/defaulters",
      },
      { title: "Meetings", icon: Calendar, href: "/dashboard/admin/meetings" },
      {
        title: "Documents",
        icon: FileText,
        href: "/dashboard/admin/documents",
      },
      {
        title: "Facility Requests",
        icon: Building,
        href: "/dashboard/facilities/requests",
      },
      {
        title: "Property Leads",
        icon: Building2,
        href: "/dashboard/super-admin/property-leads",
      },
    ],
  },

  // ==========================================
  // SETTINGS - Role Specific
  // ==========================================
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    roles: ["admin", "resident", "guard", "individual"],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { enableVisitorPass, enableParcelTracking, enableBillingModule } = useFeatureFlags();

  // Filter menu items based on user role and global feature flags
  const menuItems = allMenuItems.filter((item) => {
    const roleMatches = item.roles?.includes((user?.role || "resident").toLowerCase());
    if (!roleMatches) return false;

    // Feature Flags Global Control Enforcement
    if (item.title === 'Check-in Visitors' && !enableVisitorPass) return false;
    if (item.title === 'Parcels' && !enableParcelTracking) return false;
    if (item.title === 'Billing' && !enableBillingModule) return false;

    return true;
  });

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#1e3a5f] dark:bg-card dark:border-r dark:border-border flex flex-col sticky top-0 shadow-xl print:hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-[#2d4a6f] dark:border-border flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white dark:text-foreground tracking-wide uppercase">
                  igatesecurity
                </h2>
                <p className="text-xs text-teal-300 dark:text-teal-400">
                  {user?.role?.toLowerCase() === "super_admin"
                    ? "Platform Admin"
                    : user?.role?.toLowerCase() === "admin"
                      ? "Community Admin"
                      : user?.role?.toLowerCase() === "guard"
                        ? "Gatekeeper"
                        : user?.role?.toLowerCase() === "vendor"
                          ? "Service Provider"
                          : user?.role?.toLowerCase() === "individual"
                            ? "Standalone User"
                            : "Resident App"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-full hover:bg-[#2d4a6f] dark:hover:bg-accent text-white/70 dark:text-muted-foreground hover:text-white dark:hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isExpanded = expandedMenus.includes(item.title);
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <div key={item.title}>
              <Link
                href={hasSubmenu ? "#" : item.href}
                onClick={(e) => {
                  if (hasSubmenu) {
                    e.preventDefault();
                    toggleMenu(item.title);
                  }
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                    : "text-white/70 dark:text-muted-foreground hover:bg-[#2d4a6f] dark:hover:bg-accent hover:text-white dark:hover:text-foreground",
                )}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-white"
                        : "text-white/70 dark:text-muted-foreground group-hover:text-white dark:group-hover:text-foreground",
                    )}
                  />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {!isCollapsed && item.badge && (
                  <span className="ml-auto flex-shrink-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}

                {!isCollapsed && hasSubmenu && (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 ml-auto text-white/50 dark:text-muted-foreground",
                      isExpanded && "rotate-90",
                    )}
                  />
                )}
              </Link>

              {/* Submenu */}
              <AnimatePresence>
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-1 space-y-1 overflow-hidden"
                  >
                    {item.submenu?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            isSubActive
                              ? "bg-teal-500/20 text-teal-300 dark:text-teal-400 font-medium"
                              : "text-white/60 dark:text-muted-foreground hover:bg-[#2d4a6f] dark:hover:bg-accent hover:text-white dark:hover:text-foreground",
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Support Link - Bottom of sidebar */}
      {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'resident') && (
        <div className="px-3 pb-2">
          <Link
            href="/dashboard/admin/support"
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
              pathname === '/dashboard/admin/support'
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                : "text-white/70 dark:text-muted-foreground hover:bg-[#2d4a6f] dark:hover:bg-accent hover:text-white dark:hover:text-foreground",
              isCollapsed && "justify-center"
            )}
          >
            <Headphones className={cn(
              "h-5 w-5 flex-shrink-0",
              pathname === '/dashboard/admin/support'
                ? "text-white"
                : "text-white/70 dark:text-muted-foreground group-hover:text-white dark:group-hover:text-foreground"
            )} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  Support
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-[#2d4a6f] dark:border-border">
        <div
          className={cn(
            "flex items-center p-3 rounded-xl bg-[#2d4a6f]/50 dark:bg-accent/50 hover:bg-[#2d4a6f] dark:hover:bg-accent transition-colors",
            isCollapsed && "justify-center",
          )}
        >
          <Avatar className="h-10 w-10 ring-2 ring-teal-400/50">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-semibold">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-white dark:text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-white/60 dark:text-muted-foreground truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-2 h-8 w-8 text-white/60 dark:text-muted-foreground hover:text-red-400 dark:hover:text-red-400 hover:bg-red-500/20"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
