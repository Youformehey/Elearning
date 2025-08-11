import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Sun, Moon, User, Power, X, Menu, Sparkles, Star, Heart,
  BookOpen, Calendar, Target, Trophy, Brain, Zap, Award, Clock,
  MessageSquare, Settings, Home, TrendingUp, BarChart3, Smile,
  Rainbow, Crown, Gem, Diamond, Rocket, Flower, Cloud, Music,
  Gamepad2, Palette, Calculator, Globe, Book, Heart as HeartIcon
} from "lucide-react";
import NotificationRappelsStudent from "./NotificationRappelsStudent";
import { ThemeContext } from "../context/ThemeContext";

const SIDEBAR_WIDTH = 300;

// Icônes amusantes pour les enfants avec des couleurs vives
const funIcons = [
  { 
    emoji: "📚", 
    label: "Mes Cours", 
    icon: BookOpen,
    color: "from-blue-400 to-purple-500",
    darkColor: "from-blue-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-100 to-purple-100",
    darkBgColor: "bg-gradient-to-br from-blue-900/30 to-purple-900/30",
    action: () => window.location.href = "/student/cours"
  },
  { 
    emoji: "📅", 
    label: "Planning", 
    icon: Calendar,
    color: "from-green-400 to-emerald-500",
    darkColor: "from-green-500 to-emerald-600",
    bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
    darkBgColor: "bg-gradient-to-br from-green-900/30 to-emerald-900/30",
    action: () => window.location.href = "/student/planning"
  },
  { 
    emoji: "🎯", 
    label: "Objectifs", 
    icon: Target,
    color: "from-purple-400 to-pink-500",
    darkColor: "from-purple-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
    darkBgColor: "bg-gradient-to-br from-purple-900/30 to-pink-900/30",
    action: () => window.location.href = "/student/notes"
  },
  { 
    emoji: "🏆", 
    label: "Progrès", 
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    darkColor: "from-yellow-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
    darkBgColor: "bg-gradient-to-br from-yellow-900/30 to-orange-900/30",
    action: () => window.location.href = "/student/formations"
  },
];

const HomeNavbarStudent = () => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeIcon, setActiveIcon] = React.useState(null);
  const notifRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const { darkMode, setDarkMode } = React.useContext(ThemeContext);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Élève" };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleIconClick = (icon, action) => {
    setActiveIcon(icon.label);
    setTimeout(() => {
      setActiveIcon(null);
      action();
    }, 300);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[999998] transition-all duration-500 backdrop-blur-xl shadow-2xl border-b-2 ${
        darkMode 
          ? "bg-gradient-to-r from-gray-900/95 via-purple-900/90 to-blue-900/95 border-purple-500/50" 
          : "bg-gradient-to-r from-white/95 via-blue-50/90 to-purple-50/95 border-blue-300/50"
      }`}
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ marginLeft: SIDEBAR_WIDTH, height: 120 }}
    >
      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-4 left-1/4 text-blue-400"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear",
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sparkles size={20} />
        </motion.div>
        <motion.div
          className="absolute top-6 right-1/3 text-purple-400"
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
            y: [0, 5, 0],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear",
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Star size={16} />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-1/3 text-green-400"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            x: [0, 3, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "linear",
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Heart size={18} />
        </motion.div>
      </div>

      <div className="flex items-center justify-between px-8 h-full relative z-10">
        {/* Section gauche - icônes fonctionnelles améliorées */}
        <div className="flex items-center gap-4">
          {funIcons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, -5, 5, 0],
                  y: -8,
                  boxShadow: darkMode 
                    ? "0 15px 35px rgba(147, 51, 234, 0.6)"
                    : "0 15px 35px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleIconClick(item, item.action)}
                className={`w-20 h-20 flex flex-col items-center justify-center rounded-3xl shadow-2xl border-3 backdrop-blur-sm transition-all duration-300 ${
                  darkMode 
                    ? `${item.darkBgColor} border-purple-400/60` 
                    : `${item.bgColor} border-blue-300/60`
                } ${
                  activeIcon === item.label 
                    ? darkMode 
                      ? 'ring-4 ring-purple-400 ring-opacity-80 shadow-purple-500/50' 
                      : 'ring-4 ring-blue-400 ring-opacity-60 shadow-blue-500/50' 
                    : ''
                }`}
                title={item.label}
              >
                <motion.div
                  animate={activeIcon === item.label ? { rotate: 360, scale: 1.3 } : {}}
                  transition={{ duration: 0.8 }}
                  className={`p-2 rounded-2xl ${item.color} text-white`}
                >
                  <IconComponent size={28} />
                </motion.div>
                <span className={`text-xs font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Section centrale - avatar et nom avec animations amusantes */}
        <div className="flex items-center gap-6">
          <motion.div
            className={`w-24 h-24 rounded-3xl shadow-2xl border-4 backdrop-blur-sm flex items-center justify-center ${
              darkMode 
                ? "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400/80" 
                : "bg-gradient-to-br from-blue-500 to-purple-500 border-blue-300/80"
            }`}
            animate={{ 
              rotate: [0, 3, -3, 0],
              scale: [1, 1.05, 1],
              y: [0, -2, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15, rotate: 360 }}
          >
            <User className="w-12 h-12 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <motion.span 
              className={`font-bold text-3xl ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(147,51,234,0)",
                  "0 0 20px rgba(147,51,234,0.6)",
                  "0 0 0px rgba(147,51,234,0)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {userInfo.name || "Élève"}
            </motion.span>
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-4 h-4 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ type: "tween", duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
              <span className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Élève • En ligne
              </span>
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ type: "tween", duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeartIcon className="w-5 h-5 text-red-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ type: "tween", duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Smile className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Section droite - actions améliorées */}
        <nav className="flex items-center gap-4">
          {/* Notifications avec design amélioré */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Afficher les notifications"
              className={`w-16 h-16 rounded-3xl shadow-2xl border-3 backdrop-blur-sm flex items-center justify-center ${
                darkMode 
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white border-purple-400/80" 
                  : "bg-gradient-to-br from-blue-500 to-purple-500 text-white border-blue-300/80"
              }`}
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 12px 30px rgba(147, 51, 234, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={32} />
              <motion.span 
                className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center font-bold border-3 border-white shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
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
                  transition={{ duration: 0.3 }}
                  className={`absolute right-0 mt-4 w-96 rounded-3xl shadow-2xl p-6 backdrop-blur-xl border-2 z-50 ${
                    darkMode 
                      ? "bg-gray-800/95 border-purple-500/50" 
                      : "bg-white/95 border-blue-300/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className={`w-7 h-7 ${darkMode ? "text-purple-400" : "text-blue-600"}`} />
                    <span className={`font-bold text-xl ${
                      darkMode ? "text-purple-400" : "text-blue-700"
                    }`}>
                      Rappels
                    </span>
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <button 
                      onClick={() => setNotifOpen(false)} 
                      className={`ml-auto p-2 rounded-xl ${
                        darkMode 
                          ? "hover:bg-gray-700" 
                          : "hover:bg-blue-100"
                      }`}
                    >
                      <X size={20} className={darkMode ? "text-purple-400" : "text-blue-600"} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <NotificationRappelsStudent />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode sombre avec animations */}
          <motion.button
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            className={`w-16 h-16 rounded-3xl shadow-2xl border-3 backdrop-blur-sm flex items-center justify-center ${
              darkMode 
                ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-yellow-400/80" 
                : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 border-gray-300/80"
            }`}
            whileHover={{ 
              scale: 1.15,
              boxShadow: darkMode 
                ? "0 12px 30px rgba(245, 158, 11, 0.5)"
                : "0 12px 30px rgba(156, 163, 175, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            <motion.div
              animate={{ rotate: darkMode ? 360 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {darkMode ? <Sun size={32} /> : <Moon size={32} />}
            </motion.div>
          </motion.button>

          {/* Profil avec design amélioré */}
          <motion.button
            whileHover={{ 
              scale: 1.15,
              boxShadow: "0 12px 30px rgba(147, 51, 234, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            className={`w-16 h-16 rounded-3xl shadow-2xl border-3 backdrop-blur-sm flex items-center justify-center ${
              darkMode 
                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-400/80" 
                : "bg-gradient-to-br from-blue-400 to-purple-400 text-white border-blue-300/80"
            }`}
            title="Mon profil"
            onClick={() => window.location.href = "/student/profil"}
          >
            <User size={32} />
          </motion.button>

          {/* Déconnexion avec design amélioré */}
          <motion.button
            onClick={handleLogout}
            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-2xl border-3 border-white/90 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ 
              scale: 1.15,
              boxShadow: "0 12px 30px rgba(239, 68, 68, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            title="Déconnexion"
          >
            <Power size={32} />
          </motion.button>

          {/* Menu mobile amélioré */}
          <div className="sm:hidden flex items-center" ref={menuRef}>
            <motion.button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              className={`w-16 h-16 rounded-3xl shadow-2xl border-3 backdrop-blur-sm flex items-center justify-center ${
                darkMode 
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-400/80" 
                  : "bg-gradient-to-br from-blue-400 to-purple-400 text-white border-blue-300/80"
              }`}
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 12px 30px rgba(147, 51, 234, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={32} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu size={32} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default HomeNavbarStudent;
