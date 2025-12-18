import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/useAuth";
import { Bell, Search, Menu, X, ChevronDown, User } from "lucide-react";
import api from "@/api/axios";
import { getCategories } from "@/api/apiService";

// Helper function to get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Evening";
};

export default function NavBar() {
  const { token, user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  // Check if link is active
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Navigation link component for consistent styling
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative text-[15px] tracking-wide transition-all duration-200 ease-out
        ${isActive(to) 
          ? "text-[#1a1a2e] font-semibold" 
          : "text-gray-600 font-medium hover:text-[#1a1a2e]"
        }
        after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#1a1a2e] 
        after:transition-all after:duration-200 after:ease-out
        ${isActive(to) ? "after:w-full" : "after:w-0 hover:after:w-full"}
      `}
    >
      {children}
    </Link>
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    getCategories()
      .then((res) => {
        const cats = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.categories-dropdown')) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const onSearch = () => {
    if (search) nav(`/search?keyword=${search}`);
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  // Fetch pending applications count for admin/manager
  useEffect(() => {
    if (token && (user?.role === "ADMIN" || user?.role === "MANAGER")) {
      api.get("/api/posts")
        .then(async (res) => {
          const jobs = Array.isArray(res.data) ? res.data : res.data.data || [];
          let total = 0;
          for (const job of jobs.slice(0, 10)) {
            try {
              const appRes = await api.get(`/api/applications/job/${job.id}`);
              const apps = Array.isArray(appRes.data) ? appRes.data : [];
              total += apps.filter(a => a.status === "PENDING").length;
            } catch (e) {}
          }
          setPendingCount(total);
        })
        .catch(() => {});
    }
  }, [token, user]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1
            className="text-2xl font-bold cursor-pointer text-[#1a1a2e] tracking-tight transition-opacity duration-200 hover:opacity-80"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.02em" }}
            onClick={() => nav("/")}
          >
            INTWORK
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <NavLink to="/">Home</NavLink>
            
            {/* Categories Dropdown */}
            <div className="relative categories-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoriesOpen(!isCategoriesOpen);
                }}
                className={`relative text-[15px] tracking-wide transition-all duration-200 ease-out flex items-center gap-1
                  ${location.pathname.startsWith("/posts") 
                    ? "text-[#1a1a2e] font-semibold" 
                    : "text-gray-600 font-medium hover:text-[#1a1a2e]"
                  }
                `}
              >
                Articles
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  {categories.filter(cat => cat.name !== "General" && cat.name !== "Jobs").map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/posts?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a1a2e] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>            
            <NavLink to="/jobs">Jobs</NavLink>
            {/* Admin Links */}
            {token && (user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <NavLink to="/admin">Dashboard</NavLink>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="pl-10 w-52 h-10 bg-gray-100/80 border-0 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              />
            </div>

            {/* Notification Bell for Admin/Manager */}
            {token && (user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <button 
                onClick={() => nav("/applications")}
                className="relative p-2 text-gray-500 hover:text-[#1a1a2e] transition-colors duration-200"
                title="Job Applications"
              >
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth Buttons */}
            {!token ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => nav("/login")}
                  className="text-[15px] font-medium text-gray-600 hover:text-[#1a1a2e] hover:bg-transparent transition-colors duration-200"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => nav("/register")}
                  className="bg-[#1a1a2e] text-white hover:bg-[#2d2d44] rounded-full px-6 h-10 text-[15px] font-medium transition-all duration-200"
                >
                  Register
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* User Avatar and Greeting - Clickable */}
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="My Profile">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs text-gray-500">{getGreeting()}</span>
                    <span className="text-sm font-medium text-[#1a1a2e]">{user?.username}</span>
                  </div>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="rounded-full px-6 h-10 text-[15px] font-medium border-gray-300 text-gray-600 hover:text-[#1a1a2e] hover:border-gray-400 hover:bg-transparent transition-all duration-200"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-1">
            {/* User greeting in mobile */}
            {token && user && (
              <Link to="/profile" className="px-6 py-3 flex items-center gap-3 border-b border-gray-100 mb-2 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </div>
                <div>
                  <span className="text-xs text-gray-500">{getGreeting()}</span>
                  <p className="text-sm font-medium text-[#1a1a2e]">{user?.username}</p>
                  <span className="text-xs text-gray-400">View Profile</span>
                </div>
              </Link>
            )}
            
            <Link 
              to="/" 
              className={`block px-6 py-3 text-[15px] font-medium transition-colors duration-200 ${
                isActive("/") ? "text-[#1a1a2e] bg-gray-50" : "text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            
            {/* Mobile Categories */}
            <div className="px-6 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Articles</p>
              {categories.filter(cat => cat.name !== "General" && cat.name !== "Jobs").map((cat) => (
                <Link 
                  key={cat.id}
                  to={`/posts?category=${encodeURIComponent(cat.name)}`}
                  className="block py-2 text-[14px] text-gray-500 hover:text-[#1a1a2e] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            
            <Link 
              to="/jobs" 
              className={`block px-6 py-3 text-[15px] font-medium transition-colors duration-200 ${
                isActive("/jobs") ? "text-[#1a1a2e] bg-gray-50" : "text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-50"
              }`}
            >
              Jobs
            </Link>
            
            {token && (user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <Link 
                to="/admin" 
                className={`block px-6 py-3 text-[15px] font-medium transition-colors duration-200 ${
                  isActive("/admin") ? "text-[#1a1a2e] bg-gray-50" : "text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
            )}

            <div className="px-6 pt-4 mt-2 border-t border-gray-100">
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 h-10 bg-gray-100/80 border-0 rounded-full text-sm"
                />
                <Button 
                  onClick={onSearch} 
                  size="sm"
                  className="bg-[#1a1a2e] text-white hover:bg-[#2d2d44] rounded-full px-5 h-10"
                >
                  Search
                </Button>
              </div>
              
              {!token ? (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => nav("/login")} 
                    className="flex-1 h-10 rounded-full border-gray-300 text-gray-600 hover:text-[#1a1a2e]"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => nav("/register")} 
                    className="flex-1 h-10 bg-[#1a1a2e] hover:bg-[#2d2d44] rounded-full"
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full h-10 rounded-full border-gray-300 text-gray-600 hover:text-[#1a1a2e]"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
