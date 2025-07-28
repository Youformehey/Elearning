import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Menu, X, Sparkles, Star, Zap, Trophy, Heart, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationRappelsStudent from "./NotificationRappelsStudent";
import { ThemeContext } from "../context/ThemeContext";

export default function HomeNavbarStudent({ userName = "Élève" }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef();
  const menuRef = useRef();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToSettings = () => {
    navigate("/student/profil");
  };

  // Close notif dropdown on outside click
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
    <motion.header 
      className={`flex items-center justify-between px-4 sm:px-10 py-4 shadow-2xl relative z-[999998] backdrop-blur-md ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-black'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Logo + Title avec animation */}
      <motion.div 
        className="flex items-center gap-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative"
        >
          <img
            src="/image pfe.png"
            alt="Logo LearnUp"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-2xl border-4 border-white"
          />
          <motion.div
            className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Star className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>
        
        <div className="flex flex-col">
          <motion.span 
            className={`text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            LEARNUP
          </motion.span>
          <motion.div 
            className="flex items-center gap-1 text-xs text-purple-600 font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Super Élève</span>
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Actions */}
      <nav className="hidden sm:flex items-center gap-6">
        {/* Notifications avec animation */}
        <div className="relative z-[999999]" ref={notifRef}>
          <motion.button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Afficher les notifications"
            className="relative p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-200 hover:to-purple-300 transition-all duration-300 shadow-2xl hover:shadow-3xl group"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="text-purple-700" size={26} />
            
            {/* Animation de notification */}
            <motion.span 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white bg-gradient-to-r from-red-500 to-pink-500"
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
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
                className={`absolute right-0 mt-4 w-96 border-2 rounded-2xl shadow-2xl p-6 z-[999999] backdrop-blur-md ${
                  darkMode ? 'bg-gray-800/95 border-purple-500' : 'bg-white/95 border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.h3 
                    className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-purple-800'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Bell className="w-5 h-5 text-purple-600" />
                    📌 Tes rappels
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
                  <NotificationRappelsStudent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={() => setDarkMode && setDarkMode(!darkMode)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl border-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-yellow-300 border-purple-600 hover:from-purple-700 hover:to-indigo-700' 
              : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-purple-700 border-yellow-300 hover:from-yellow-200 hover:to-orange-200'
          }`}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? "Clair" : "Sombre"}</span>
        </motion.button>

        {/* Username avec animation */}
        <motion.div 
          className={`flex items-center space-x-3 font-bold text-lg px-6 py-3 rounded-2xl shadow-xl border-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-purple-100 border-purple-600' 
              : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <User size={26} className={darkMode ? "text-purple-200" : "text-purple-600"} />
          </motion.div>
          <span>{userName}</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Paramètres avec animation */}
        <motion.button
          onClick={goToSettings}
          className={`flex items-center gap-3 px-6 py-3 border-2 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl ${
            darkMode 
              ? 'text-purple-200 border-purple-500 hover:bg-purple-700/50' 
              : 'text-purple-700 border-purple-500 hover:bg-purple-50'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Settings size={22} />
          </motion.div>
          <span>Profil</span>
        </motion.button>

        {/* Logout avec animation */}
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl group"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <LogOut size={22} />
          </motion.div>
          <span>Se déconnecter</span>
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
          className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-200 hover:from-pink-200 hover:to-purple-300 transition-all duration-300 shadow-2xl"
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
                <X size={30} className="text-purple-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={30} className="text-purple-700" />
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
              className={`absolute top-full right-4 mt-3 w-64 border-2 rounded-2xl shadow-2xl z-[999999] py-4 flex flex-col gap-2 backdrop-blur-md ${
                darkMode ? 'bg-gray-800/95 border-purple-500' : 'bg-white/95 border-pink-300'
              }`}
            >
              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  goToSettings();
                }}
                className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 rounded-xl mx-2 ${
                  darkMode 
                    ? 'text-purple-200 hover:bg-purple-700/50' 
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={22} />
                <span className="font-semibold">Profil</span>
                <Heart className="w-4 h-4 text-pink-500" />
              </motion.button>
              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 rounded-xl mx-2 ${
                  darkMode 
                    ? 'text-red-400 hover:bg-red-900/20' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={22} />
                <span className="font-semibold">Se déconnecter</span>
                <Zap className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
