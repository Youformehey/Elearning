import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Network,
  Globe,
  Zap,
  Star,
  Award,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    navigate("/");
  };

  const notifications = [
    {
      id: 1,
      type: "info",
      message: "Nouvel étudiant inscrit",
      time: "2 min",
      icon: User,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30"
    },
    {
      id: 2,
      type: "warning",
      message: "Mise à jour système disponible",
      time: "5 min",
      icon: Shield,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/30"
    },
    {
      id: 3,
      type: "success",
      message: "Sauvegarde automatique terminée",
      time: "10 min",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/30"
    },
    {
      id: 4,
      type: "error",
      message: "Erreur de connexion détectée",
      time: "15 min",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-100",
      darkBgColor: "dark:bg-red-900/30"
    }
  ];

  const systemStatus = [
    {
      name: "Serveur",
      status: "Online",
      icon: Server,
      color: "text-green-500",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/30"
    },
    {
      name: "Base de données",
      status: "Online",
      icon: Database,
      color: "text-green-500",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/30"
    },
    {
      name: "Réseau",
      status: "Online",
      icon: Network,
      color: "text-green-500",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/30"
    }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-lg shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent`}>
                  LearnUp Admin
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gestion système avancée
                </p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="relative hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-80 pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-purple-500'
                }`}
              />
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* System Status */}
            <motion.div 
              className="hidden lg:flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {systemStatus.map((status, index) => (
                <motion.div
                  key={status.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg ${status.bgColor} ${status.darkBgColor} border ${
                    darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                  }`}
                >
                  <status.icon className={`w-3 h-3 ${status.color}`} />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {status.name}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
              }`}
            >
              <Bell className="w-5 h-5" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
              }`}
            >
              <motion.div
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.div>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Super Admin
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userInfo.email || "admin@learnup.com"}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Super Administrateur
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {userInfo.email || "admin@learnup.com"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-500">En ligne</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                            : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Mon Profil</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                            : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Paramètres</span>
                      </motion.button>

                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute right-4 top-full mt-2 w-80 rounded-xl shadow-2xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Notifications
                </h3>
                <span className="text-xs text-gray-500">4 nouvelles</span>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${notification.bgColor} ${notification.darkBgColor}`}>
                      <notification.icon className={`w-4 h-4 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-center text-sm font-medium ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                Voir toutes les notifications
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 