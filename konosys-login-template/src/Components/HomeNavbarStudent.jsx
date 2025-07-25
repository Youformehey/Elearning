import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import NotificationRappels from "./NotificationRappels";

export default function HomeNavbarStudent({ userName = "Élève" }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/student/profil");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-[280px] right-0 z-[1000] flex items-center justify-between
        px-8 transition-all duration-300 backdrop-blur-sm
        ${
          isScrolled
            ? "bg-white/95 shadow-lg py-3 border-b border-gray-300"
            : "bg-white/75 py-4"
        }
      `}
      style={{
        minHeight: "56px",
        maxWidth: "calc(100% - 280px)",
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-4">
        <img
          src="/image pfe.png"
          alt="Logo LearnUp"
          className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500"
        />
        <span
          className="text-2xl font-bold text-cyan-600 select-none"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          LEARNUP
        </span>
      </div>

      {/* Desktop Actions */}
      <nav className="hidden sm:flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Afficher les notifications"
            className="relative p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 transition"
          >
            <BellIcon className="text-white w-6 h-6" />
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full ring-2 ring-white bg-red-500 animate-pulse"></span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-cyan-300 rounded-xl shadow-xl p-5 z-50"
              >
                <h3 className="text-sm font-semibold text-cyan-700 mb-3">📌 Tes rappels</h3>
                <NotificationRappels />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Username */}
        <div
          className="flex items-center space-x-3 text-cyan-600 font-semibold text-base select-none"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          <UserCircleIcon className="w-6 h-6" />
          <span>{userName}</span>
        </div>

        {/* Paramètres */}
        <button
          onClick={goToSettings}
          className="flex items-center gap-2 px-5 py-2 text-cyan-600 border border-cyan-600 rounded-full font-semibold hover:bg-cyan-600 hover:text-white transition-transform hover:scale-105"
          aria-label="Profil"
        >
          <Cog6ToothIcon className="w-6 h-6" />
          <span>Profil</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-transform hover:scale-105"
          aria-label="Se déconnecter"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
          <span>Se déconnecter</span>
        </button>
      </nav>

      {/* Mobile menu button */}
      <div className="sm:hidden flex items-center" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="p-3 rounded-md bg-cyan-600 hover:bg-cyan-700 transition"
        >
          {menuOpen ? (
            <XMarkIcon className="w-7 h-7 text-white" />
          ) : (
            <Bars3Icon className="w-7 h-7 text-white" />
          )}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-4 mt-2 w-56 bg-white border border-cyan-300 rounded-xl shadow-lg z-50 py-3 flex flex-col gap-2"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  goToSettings();
                }}
                className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-cyan-100 transition rounded"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                Profil
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 transition rounded"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Se déconnecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
