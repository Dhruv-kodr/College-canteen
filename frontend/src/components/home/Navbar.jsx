import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

    const user = JSON.parse(localStorage.getItem("user"));
  

  return (
    <>
      {/* Fixed navbar with highest z-index */}
      <div
        className={`
        fixed top-0 left-0 w-full z-[9999] 
        px-8 py-4 flex flex-wrap justify-between items-center 
        text-white font-bold transition-all duration-500 ease-in-out
        ${
          scrolled
            ? "backdrop-blur-md bg-black/40 py-3 shadow-lg"
            : "bg-transparent py-6"
        }
      `}
      >
        {/* Logo - made sure it's above other elements */}
        <div
          style={{ fontFamily: "cursive" }}
          className="relative z-[10000] text-2xl text-gray-800 italic bg-amber-400 ps-8 pr-10 py-1 rounded-r-sm rounded-t-4xl text-center shadow-lg"
        >
          GLI Canteen
        </div>

        {/* Desktop Navigation - visible on large screens */}
        <div className="nav2 hidden lg:flex justify-end items-center gap-10">
          <Link
            to="/"
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            Register
          </Link>
          <Link
            to="/menu"
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            Menu
          </Link>
          <Link
            to="/admin"
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            Admin Login
          </Link>
        </div>

        {/* Search Bar - desktop */}
        <div className="hidden lg:flex justify-start gap-2 items-center">
          <div className="hover:bg-amber-300 rounded-full px-1 py-1 duration-300 cursor-pointer">
            🔎
          </div>
          <div>
            <input
              type="text"
              placeholder="Search product..."
              className="border-2 outline-none rounded-lg px-2 placeholder:text-sm bg-white/10 backdrop-blur-sm focus:bg-white/20 transition-all duration-300"
            />
          </div>
          <Link
            to={`/cart/${user.id}`}
            className="font-medium text-lg cursor-pointer active:scale-95 hover:text-amber-400 transition-colors duration-300"
          >
            cart
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden relative z-[10000]">
          <GiHamburgerMenu
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl cursor-pointer transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="absolute top-full left-0 right-0 mt-2 mx-4 z-[9999] lg:hidden">
              <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 py-4 px-4 shadow-2xl">
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="font-medium text-lg text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="font-medium text-lg text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="font-medium text-lg text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  Register
                </Link>
                <Link
                  to="/status"
                  onClick={handleLinkClick}
                  className="font-medium text-lg text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  Status
                </Link>
                <Link
                  to="/admin"
                  onClick={handleLinkClick}
                  className="font-medium text-lg text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  Admin Login
                </Link>

                {/* Mobile Search */}
                <div className="flex gap-2 items-center mt-2 pt-2 border-t border-white/20">
                  <div className="bg-white/20 rounded-full px-3 py-2 cursor-pointer hover:bg-white/30 transition-colors">
                    🔎
                  </div>
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="flex-1 border-2 border-white/30 outline-none rounded-lg px-3 py-2 placeholder:text-white/70 bg-white/10 backdrop-blur-sm focus:bg-white/20 transition-all duration-300 text-white"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20 w-full" />
    </>
  );
};

export default Navbar;
