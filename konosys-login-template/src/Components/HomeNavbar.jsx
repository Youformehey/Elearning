import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Menu, X, Search, Crown, ChevronDown, Sparkles, Star, Zap, Trophy, Heart, Moon, Sun, BookOpen, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import NotificationRappels from "./NotificationRappels";

export default function HomeNavbar({ userName = "Professeur" }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/prof/parametres");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-[999998] transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-blue-50/80 via-white/80 to-blue-100/80 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-800/80 shadow-lg'
          : 'bg-gradient-to-r from-blue-50/60 via-white/60 to-blue-100/60 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-800/60 backdrop-blur-xl'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ marginLeft: '320px', height: '90px' }}
    >
      <div className="flex items-center justify-between px-8 h-full">
        {/* Barre de recherche stylée */}
        <motion.div 
          className="flex-1 max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 dark:text-blue-300" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-gradient-to-r from-blue-100/60 via-white/60 to-blue-200/60 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 text-gray-700 dark:text-gray-200 placeholder-blue-400 dark:placeholder-blue-300 shadow-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Actions à droite */}
        <nav className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Afficher les notifications"
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-100/70 to-blue-300/70 dark:from-gray-800/80 dark:to-gray-900/80 text-blue-700 dark:text-blue-200 shadow-lg hover:shadow-xl transition-all duration-200 relative"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bell size={22} />
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold border-2 border-white shadow-md">3</span>
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 bg-gradient-to-br from-blue-50/90 to-blue-200/90 dark:from-gray-900/90 dark:to-gray-800/90"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-700 dark:text-blue-200">Rappels</span>
                    <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-blue-100 dark:hover:bg-gray-800">
                      <X size={16} className="text-blue-400 dark:text-blue-200" />
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <NotificationRappels />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-gradient-to-r from-yellow-100/70 to-yellow-300/70 dark:from-gray-800/80 dark:to-gray-900/80 text-yellow-700 dark:text-yellow-200 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={goToSettings}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-100/70 to-blue-300/70 dark:from-gray-800/80 dark:to-gray-900/80 text-blue-700 dark:text-blue-200 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            <Settings size={22} />
          </motion.button>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-gradient-to-r from-red-100/70 to-red-300/70 dark:from-gray-800/80 dark:to-gray-900/80 text-red-600 dark:text-red-300 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut size={22} />
          </motion.button>
        </nav>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center" ref={menuRef}>
          <motion.button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-100/90 to-blue-300/90 dark:from-gray-800/90 dark:to-gray-900/90 text-blue-700 dark:text-blue-200 shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.97 }}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-3 w-72 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50/90 to-blue-200/90 dark:from-gray-900/90 dark:to-gray-800/90 py-3"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-700 dark:text-blue-200">{userName}</p>
                    <p className="text-xs text-blue-400 dark:text-blue-300">Professeur</p>
                  </div>
                </div>
                {/* Search */}
                <div className="relative px-3 py-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 dark:text-blue-300" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-gradient-to-r from-blue-100/60 via-white/60 to-blue-200/60 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 text-blue-700 dark:text-blue-200 placeholder-blue-400 dark:placeholder-blue-300 shadow-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200"
                  />
                </div>
                {/* Menu Items */}
                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    goToSettings();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  <span className="font-medium text-blue-700 dark:text-blue-200">Paramètres</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900 transition-colors w-full text-left"
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600 dark:text-red-300">Déconnexion</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
