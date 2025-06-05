import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
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
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Premium", href: "/premium", icon: Crown },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const dropdownRef = useRef();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

const fetchUser = async () => {
  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setLoadingUser(false);
  } else if (token) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  } else {
    setLoadingUser(false);
  }
};


    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
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

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex items-center space-x-2 transition-all duration-300",
                      isActive && "glow-effect"
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: "#9AC9DE",
                            color: "#1F1F1F",
                          }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {loadingUser ? null : user ? (
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
                    </div>
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
              // <Link to="/login">
                <Button variant="outline" className="space-x-2">
                  <User className="w-4 h-4" />
                  {/* <span>Login</span> */}
                </Button>
              // </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/50">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn("w-full justify-start space-x-2", isActive && "glow-effect")}
                    style={
                      isActive
                        ? {
                            backgroundColor: "#9AC9DE",
                            color: "#1F1F1F",
                          }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
