import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full shadow-md bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Hamburger (Mobile) */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg"
              alt="StackOverflow"
              className="h-8"
            />
          </Link>
        </div>

        {/* CENTER SEARCH (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <input
            type="text"
            placeholder="Search…"
            className="w-full max-w-2xl px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/youtube-subscribe-bell-icon.png"
              alt="Notifications"
              className="h-5 w-5"
            />
          </Link>

          {/* Account */}
          <Link
            to="/account"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <img
              src="https://cdn-icons-png.freepik.com/512/9307/9307950.png"
              alt="Account"
              className="h-7 w-7 rounded-full"
            />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <div className="px-4 py-4 space-y-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>

            <a
              href="https://stackoverflow.co/"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              About
            </a>

            <a
              href="https://stackoverflow.co/internal/"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              For Teams
            </a>

            <Link
              to="/notifications"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Notifications
            </Link>

            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
