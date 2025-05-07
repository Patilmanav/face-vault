"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, User, LogOut, Search, Upload, Settings, Users } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              FaceVault
            </Link>
          </div>

            {/* Scroll Message */}
          <div className="hidden md:block w-1/2 overflow-hidden mx-4">
            <div className="whitespace-nowrap animate-marquee text-sm text-yellow-300 font-medium">
              🔒 Facial recognition feature is temporarily offline. Fill out the Contact Us form for a demo — we’ll activate it via a private server.
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/search"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Link>
                <Link
                  href="/upload"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Link>
                <Link
                  href="/groups"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Face Groups
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <User className="w-4 h-4 mr-1" />
                    {user?.name || user?.email}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 border border-gray-700">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-blue-400 focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/search"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Search
                </Link>
                <Link
                  href="/upload"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Upload
                </Link>
                <Link
                  href="/groups"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Face Groups
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 