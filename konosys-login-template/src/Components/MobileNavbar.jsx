import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Menu, X, Home, BookOpen, Calendar, ClipboardList, MessageSquare, Award, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

export default function MobileNavbar({ userName = "Utilisateur" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const mobileMenuItems = [
    { icon: Home, label: "Accueil", path: "/student", emoji: "🏠" },
    { icon: BookOpen, label: "Mes cours", path: "/student/cours", emoji: "📚" },
    { icon: Calendar, label: "Planning", path: "/student/planning", emoji: "📅" },
    { icon: ClipboardList, label: "Rappels", path: "/student/rappels", emoji: "🔔" },
    { icon: MessageSquare, label: "Demandes", path: "/student/demandes", emoji: "💬" },
    { icon: Award, label: "Formations", path: "/student/formations", emoji: "🏆" },
    { icon: Brain, label: "Assistant", path: "/student/assistant", emoji: "🤖" },
    { icon: User, label: "Profil", path: "/student/profil", emoji: "👤" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className={`sm:hidden flex items-center justify-between px-4 py-3 shadow-md relative z-[999998] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src="/image pfe.png"
            alt="Logo LearnUp"
            className="w-10 h-10 rounded-full object-cover shadow-lg"
          />
          <span className={`text-lg font-bold tracking-wide ${darkMode ? 'text-white' : 'text-blue-800'}`}>
            LEARNUP
          </span>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-lg"
          >
            <Bell className="text-blue-700" size={18} />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white bg-red-500 animate-ping"></span>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>

          {/* Menu Button */}
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[999999] sm:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[999999] sm:hidden ${
              darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
            } shadow-2xl`}
          >
            {/* Menu Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src="/image pfe.png"
                  alt="Logo LearnUp"
                  className="w-12 h-12 rounded-full object-cover shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-lg">LEARNUP</h3>
                  <p className="text-sm opacity-70">Bonjour, {userName}</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {mobileMenuItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-100' 
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Menu Footer */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/prof/parametres");
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-100' 
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <Settings size={18} />
                  <span className="font-medium">Paramètres</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Notifications */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={`absolute top-16 right-4 w-80 max-w-[90vw] border-2 rounded-2xl shadow-2xl p-4 z-[999999] sm:hidden ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-blue-800'}`}>
                <Bell className="w-4 h-4 text-blue-600" />
                📌 Vos rappels
              </h3>
              <button
                onClick={() => setNotifOpen(false)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <div className="text-center py-4 text-sm opacity-70">
                Aucune notification pour le moment
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 