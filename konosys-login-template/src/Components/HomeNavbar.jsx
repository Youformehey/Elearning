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
          ? 'bg-blue-800/95 shadow-xl border-b border-blue-700' 
          : 'bg-gradient-to-r from-blue-800 to-blue-900 backdrop-blur-md'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ marginLeft: '320px', height: '140px' }}
    >
      {/* Barre de progression animée en haut */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      <div className="flex items-center justify-between px-8 h-full">
        {/* Section gauche - Barre de recherche */}
        <motion.div 
          className="flex-1 max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Effet de brillance */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Rechercher cours, élèves..."
              className="w-full pl-12 pr-16 py-4 rounded-2xl border-2 border-white/30 focus:border-white focus:ring-4 focus:ring-white/50 transition-all duration-300 bg-white/20 backdrop-blur-sm shadow-xl text-white placeholder-white/70"
            />
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section droite - Actions modernes */}
        <nav className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative z-[999999]" ref={notifRef}>
            <motion.button
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Afficher les notifications"
              className="relative p-5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="text-white" size={26} />
              
              {/* Badge de notification animé */}
              <motion.span 
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 8px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute right-0 mt-4 w-96 border rounded-2xl shadow-2xl p-6 z-[999999] bg-white/95 backdrop-blur-md border-white/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.h3 
                      className="text-lg font-bold flex items-center gap-2 text-gray-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Bell className="w-5 h-5 text-blue-600" />
                      📌 Mes Rappels
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                    </motion.h3>
                    <motion.button
                      onClick={() => setNotifOpen(false)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <NotificationRappels />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-5 py-5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className="hidden sm:inline">{darkMode ? "Clair" : "Sombre"}</span>
          </motion.button>

          {/* Settings - En bleu */}
          <motion.button
            onClick={goToSettings}
            className="flex items-center gap-3 px-5 py-5 rounded-xl font-medium transition-all duration-300 shadow-lg border border-white/30 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Settings size={24} />
            </motion.div>
            <span className="hidden sm:inline">Paramètres</span>
          </motion.button>

          {/* Logout - Déplacé à droite */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 shadow-xl group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LogOut size={24} />
            </motion.div>
            <span className="hidden sm:inline">Déconnexion</span>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.2 }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </nav>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center" ref={menuRef}>
          <motion.button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="p-3 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg border border-white/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
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
                  <X size={24} className="text-gray-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} className="text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                className="absolute top-full right-0 mt-3 w-80 border rounded-2xl shadow-2xl z-[999999] py-4 flex flex-col gap-2 backdrop-blur-md bg-white/95 border-white/30"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mx-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-600">Professeur Premium</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600">En ligne</span>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mx-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                {/* Menu Items */}
                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    goToSettings();
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors mx-2"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-800">Paramètres</span>
                  <Heart className="w-4 h-4 text-blue-500" />
                </motion.button>
                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 transition-colors mx-2"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-800">Déconnexion</span>
                  <Zap className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Animation de particules flottantes */}
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}
