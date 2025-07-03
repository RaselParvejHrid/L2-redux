import React, { useState } from "react";
import { Link } from "react-router";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/favicon.png" // Replace with your logo/image URL
            alt="Library Logo"
            className="w-6 h-6 object-contain"
          />
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6">
        <Link
          to="/books"
          className="text-blue-600 text-base font-medium hover:underline"
        >
          Books
        </Link>
        <Link
          to="/create-book"
          className="text-blue-600 text-base font-medium hover:underline"
        >
          Create Book
        </Link>
        <Link
          to="/borrow-summary"
          className="text-blue-600 text-base font-medium hover:underline"
        >
          Borrow Summary
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-blue-600 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-100 border-b border-gray-200 flex flex-col items-center gap-4 py-4 md:hidden">
          <Link
            to="/books"
            className="text-blue-600 text-base font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Books
          </Link>
          <Link
            to="/create-book"
            className="text-blue-600 text-base font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Book
          </Link>
          <Link
            to="/borrow-summary"
            className="text-blue-600 text-base font-medium hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Borrow Summary
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
