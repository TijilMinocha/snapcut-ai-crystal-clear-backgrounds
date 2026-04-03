import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Upload,
  LayoutDashboard,
  History,
  CreditCard,
  Settings,
  Key,
  LogOut,
  Zap,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuthStore } from "@/lib/auth-store";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/credits", label: "Credits", icon: Zap },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SnapCut AI" className="h-8 w-8" />
            <span className="font-display text-lg font-bold">
              Snap<span className="gradient-text">Cut</span> AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Account</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full text-left"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
