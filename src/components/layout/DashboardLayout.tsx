import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Upload,
  LayoutDashboard,
  History,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuthStore } from "@/lib/auth-store";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/credits", label: "Credits", icon: Zap },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
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
              onClick={() => setIsMobileMenuOpen(false)}
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
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SnapCut AI" className="h-7 w-7" />
          <span className="font-display text-base font-bold">
            Snap<span className="gradient-text">Cut</span> AI
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-card border-r border-border flex flex-col animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-[calc(100vh-64px)] md:min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
