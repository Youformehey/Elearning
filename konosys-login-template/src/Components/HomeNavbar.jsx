import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

export default function HomeNavbar({ userName = "Utilisateur" }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();
  const { darkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/prof/parametres");
  };

  // Close menu dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`flex items-center justify-between px-3 sm:px-6 md:px-10 py-3 sm:py-4 shadow-md relative z-[999998] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      {/* Logo + Title */}
      <div className="flex items-center gap-2 sm:gap-4">
        <img
          src="/image pfe.png"
          alt="Logo LearnUp"
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover shadow-lg"
        />
        <span className={`text-lg sm:text-2xl md:text-3xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-blue-800'}`}>
          LEARNUP
        </span>
      </div>

      {/* Desktop Actions */}
      <nav className="hidden sm:flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <div className="relative z-[999999]" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Afficher les notifications"
            className="relative p-2 sm:p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Bell className="text-blue-700 sm:w-6 sm:h-6 md:w-7 md:h-7" size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full ring-2 ring-white bg-red-500 animate-ping"></span>
            <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                className={`absolute right-0 mt-4 w-96 border-2 rounded-2xl shadow-2xl p-6 z-[999999] ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-blue-800'}`}>
                    <Bell className="w-5 h-5 text-blue-600" />
                    📌 Vos rappels
                  </h3>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune notification pour le moment</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Username */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {userName}
            </p>
            <p className="text-xs text-gray-500">En ligne</p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToSettings}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Paramètres"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            aria-label="Déconnexion"
          >
            <LogOut className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className={`sm:hidden absolute top-full right-0 mt-2 w-64 border-2 rounded-2xl shadow-2xl p-4 z-[999999] ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-blue-200'
            }`}
            ref={menuRef}
          >
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-gray-500">En ligne</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setNotifOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => {
                    goToSettings();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Paramètres</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
