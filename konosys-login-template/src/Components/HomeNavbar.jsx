import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationRappels from "./NotificationRappels";

export default function HomeNavbar({ userName = "Utilisateur" }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/prof/settings");
  };

  // Close notif dropdown on outside click
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

  return (
    <header className="flex items-center justify-between px-4 sm:px-10 py-4 bg-white shadow-md relative z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/image pfe.png"
          alt="Logo LearnUp"
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
        />
        <span className="text-xl sm:text-2xl font-bold text-blue-800 tracking-wide">
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
            className="relative p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
          >
            <Bell className="text-blue-700" size={22} />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 animate-ping"></span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📌 Vos rappels</h3>
                <NotificationRappels />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Username */}
        <div className="flex items-center space-x-2 text-blue-800 font-semibold text-lg">
          <User size={24} />
          <span>{userName}</span>
        </div>

        {/* Paramètres */}
        <button
          onClick={goToSettings}
          className="flex items-center gap-2 px-5 py-2 text-blue-700 border border-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-transform hover:scale-105"
        >
          <Settings size={20} />
          <span>Paramètres</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-semibold transition-transform hover:scale-105"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </nav>

      {/* Mobile menu button */}
      <div className="sm:hidden flex items-center" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="p-2 rounded-md bg-gray-100 hover:bg-blue-100 transition"
        >
          {menuOpen ? <X size={28} className="text-blue-700" /> : <Menu size={28} className="text-blue-700" />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-4 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-3 flex flex-col gap-2"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  goToSettings();
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 transition rounded"
              >
                <Settings size={20} />
                Paramètres
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition rounded"
              >
                <LogOut size={20} />
                Se déconnecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
