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
      className={`fixed top-0 left-0 right-0 z-[999998] transition-all duration-300 backdrop-blur-md ${
        isScrolled 
          ? 'bg-white/95 shadow-2xl border-b border-gray-200' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700'
      } ${darkMode ? 'bg-gray-900/95 text-white' : 'text-gray-800'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ marginLeft: '320px' }} // Ajustement pour le sidebar
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* Logo + Title avec animation */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white shadow-xl border-2 border-white/30 flex items-center justify-center overflow-hidden">
              <img
                src="/image pfe.png"
                alt="Logo LearnUp"
                className="w-full h-full object-contain p-1"
                style={{ background: 'none' }}
              />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GraduationCap className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col">
            <motion.span 
              className={`text-2xl sm:text-3xl font-bold tracking-wide text-white`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              LEARNUP
            </motion.span>
            <motion.div 
              className="flex items-center gap-1 text-xs text-white/90 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <BookOpen className="w-3 h-3" />
              <span>Professeur Premium</span>
              <Crown className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop Actions */}
        <nav className="hidden sm:flex items-center gap-4">
          {/* Search Bar avec animation */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher cours, élèves..."
              className="pl-12 pr-6 py-3 w-80 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg"
            />
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>

          {/* Notifications avec animation */}
          <div className="relative z-[999999]" ref={notifRef}>
            <motion.button
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Afficher les notifications"
              className="relative p-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-3xl group backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="text-white" size={26} />
              
              {/* Animation de notification */}
              <motion.span 
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full ring-2 ring-white bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3
              </motion.span>
              
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute right-0 mt-4 w-96 border-2 rounded-2xl shadow-2xl p-6 z-[999999] bg-white/95 backdrop-blur-md border-blue-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.h3 
                      className="text-lg font-bold flex items-center gap-2 text-blue-800"
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

          {/* Dark Mode Toggle avec animation */}
          <motion.button
            onClick={toggleDarkMode}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl border-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-yellow-300 border-blue-600 hover:from-blue-700 hover:to-blue-800' 
                : 'bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? "Clair" : "Sombre"}</span>
          </motion.button>

          {/* User Profile avec animation */}
          <motion.div 
            className={`flex items-center space-x-3 font-bold text-lg px-6 py-3 rounded-2xl shadow-xl border-2 bg-white/20 backdrop-blur-sm border-white/20`}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <User size={26} className="text-white" />
            </motion.div>
            <span className="text-white">{userName}</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-5 h-5 text-yellow-300" />
            </motion.div>
          </motion.div>

          {/* Settings avec animation */}
          <motion.button
            onClick={goToSettings}
            className={`flex items-center gap-3 px-6 py-3 border-2 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl bg-white/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/30`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Settings size={22} />
            </motion.div>
            <span>Paramètres</span>
          </motion.button>

          {/* Logout avec animation */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LogOut size={22} />
            </motion.div>
            <span>Déconnexion</span>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.2 }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </nav>

        {/* Mobile menu button avec animation */}
        <div className="sm:hidden flex items-center" ref={menuRef}>
          <motion.button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-2xl border border-white/20"
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
                  <X size={30} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={30} className="text-white" />
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
                className="absolute top-full right-4 mt-3 w-80 border-2 rounded-2xl shadow-2xl z-[999999] py-4 flex flex-col gap-2 backdrop-blur-md bg-white/95 border-blue-200"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl mx-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
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
      </div>
    </motion.header>
  );
}
