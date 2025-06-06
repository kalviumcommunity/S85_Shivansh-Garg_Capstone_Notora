import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  BookOpen,
  Home,
  MessageCircle,
  Crown,
  User,
  Menu,
  X,
  LogOut,
  Shield,
  Scan,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const getNavigation = (isAdmin) => {
  const baseNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Notes", href: "/notes", icon: BookOpen },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "OCR", href: "/ocr", icon: Scan },
    { name: "Premium", href: "/premium", icon: Crown },
  ];

  if (isAdmin) {
    baseNav.push({ name: "Admin", href: "/admin", icon: Shield });
  }

  return baseNav;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = getNavigation(user?.role === 'admin');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      // Use the logout function from auth context
      logout();
      
      // Close dropdown
      setDropdownOpen(false);
      
      // Navigate to login
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#e2e8f0] shadow-md rounded-b-2xl transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{ background: "linear-gradient(to bottom right, #9AC9DE, #9AC9DE99)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Notora</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-[#bbd9e8] text-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle - Commented out
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-5 h-5" />
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl animate-fade-in">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700">
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="ml-2 text-xs text-blue-600">(Admin)</span>
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="space-x-2">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-[#bbd9e8] text-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
