import React, { useState } from "react";
import { auth } from "../firebase";
import {
  FaHome,
  FaStar,
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userName = auth.currentUser ? auth.currentUser.displayName : "Guest";

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDashboardClick = () => {
    navigate("/dashboard"); // Navigate to the Dashboard page
  };

  const handleMealLogClick = () => {
    navigate("/food"); // Navigate to the Meal Log page
  };

  const handleRecommendationsClick = () => {
    navigate("/recommendations"); // Navigate to the Recommendations page
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the Profile page
  };

  return (
    <header className="bg-gray-800 text-gray-100 py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <button
          className="text-xl font-bold tracking-tight text-teal-400 focus:outline-none"
          onClick={() => navigate("/")}
        >
          Health<span className="text-cyan-400">AI</span>
        </button>
        {/* Hamburger Icon */}
        <button
          className="text-gray-100 text-2xl md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-gray-800 md:static md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 items-center md:items-center py-4 md:py-0">
            <li className="mb-2 md:mb-0">
              <button
                onClick={handleDashboardClick}
                className="flex items-center gap-2 hover:text-teal-400 transition duration-200"
              >
                <FaHome />
                Dashboard
              </button>
            </li>
            <li className="mb-2 md:mb-0">
              <button
                onClick={handleMealLogClick}
                className="flex items-center gap-2 hover:text-teal-400 transition duration-200"
              >
                <FaStar />
                Meal Log
              </button>
            </li>
            <li className="mb-2 md:mb-0">
              <button
                onClick={handleRecommendationsClick}
                className="flex items-center gap-2 hover:text-teal-400 transition duration-200"
              >
                <FaEnvelope />
                Recommendations
              </button>
            </li>
            <li className="relative">
              {/* Username with dropdown */}
              <button
                className="flex items-center gap-2 hover:text-teal-400 transition duration-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle />
                {userName}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-10 right-0 bg-gray-700 text-gray-100 shadow-lg rounded-md py-2 w-40">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
