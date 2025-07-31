import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  GraduationCap,
  Database,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Crown,
  Building,
  Sun,
  Moon,
  Bell,
  Search,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Star,
  Award,
  Target,
  Sparkles,
  UserPlus,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Zap
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function SidebarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navigationLinks = [
    {
      to: "/admin",
      icon: Home,
      label: "Dashboard",
      description: "Vue d'ensemble",
      color: "from-blue-500 via-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      darkBgColor: "from-blue-900/20 to-blue-800/20",
      accent: "blue",
      badge: null
    },
    {
      to: "/admin/students",
      icon: Users,
      label: "Étudiants",
      description: "Gestion des étudiants",
      color: "from-emerald-500 via-emerald-600 to-emerald-700",
      bgColor: "from-emerald-50 to-emerald-100",
      darkBgColor: "from-emerald-900/20 to-emerald-800/20",
      accent: "emerald",
      badge: "2"
    },
    {
      to: "/admin/teachers",
      icon: GraduationCap,
      label: "Professeurs",
      description: "Gestion des professeurs",
      color: "from-purple-500 via-purple-600 to-purple-700",
      bgColor: "from-purple-50 to-purple-100",
      darkBgColor: "from-purple-900/20 to-purple-800/20",
      accent: "purple",
      badge: "3"
    },
    {
      to: "/admin/classes",
      icon: Building,
      label: "Classes",
      description: "Gestion des classes",
      color: "from-orange-500 via-orange-600 to-orange-700",
      bgColor: "from-orange-50 to-orange-100",
      darkBgColor: "from-orange-900/20 to-orange-800/20",
      accent: "orange",
      badge: "2"
    },
    {
      to: "/admin/courses",
      icon: BookOpen,
      label: "Cours",
      description: "Gestion des cours",
      color: "from-indigo-500 via-indigo-600 to-indigo-700",
      bgColor: "from-indigo-50 to-indigo-100",
      darkBgColor: "from-indigo-900/20 to-indigo-800/20",
      accent: "indigo",
      badge: "5"
    },
    {
      to: "/admin/planning",
      icon: Calendar,
      label: "Planning",
      description: "Gestion des emplois du temps",
      color: "from-pink-500 via-pink-600 to-pink-700",
      bgColor: "from-pink-50 to-pink-100",
      darkBgColor: "from-pink-900/20 to-pink-800/20",
      accent: "pink",
      badge: "1"
    },
    {
      to: "/admin/parents",
      icon: User,
      label: "Parents",
      description: "Gestion des parents",
      color: "from-teal-500 via-teal-600 to-teal-700",
      bgColor: "from-teal-50 to-teal-100",
      darkBgColor: "from-teal-900/20 to-teal-800/20",
      accent: "teal",
      badge: "8"
    },
    {
      to: "/admin/settings",
      icon: Settings,
      label: "Paramètres",
      description: "Configuration système",
      color: "from-slate-500 via-slate-600 to-slate-700",
      bgColor: "from-slate-50 to-slate-100",
      darkBgColor: "from-slate-900/20 to-slate-800/20",
      accent: "slate",
      badge: null
    }
  ];

  const quickActions = [
    {
      icon: UserPlus,
      label: "Ajouter Étudiant",
      action: () => navigate("/admin/students"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30"
    },
    {
      icon: GraduationCap,
      label: "Ajouter Professeur",
      action: () => navigate("/admin/teachers"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30"
    },
    {
      icon: Building,
      label: "Créer Classe",
      action: () => navigate("/admin/classes"),
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/30"
    }
  ];

  const systemStats = [
    { 
      label: "Utilisateurs", 
      value: "5", 
      icon: Users, 
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30",
      trend: "+12%",
      trendColor: "text-green-500"
    },
    { 
      label: "Cours", 
      value: "6", 
      icon: BookOpen, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      trend: "+8%",
      trendColor: "text-green-500"
    },
    { 
      label: "Données", 
      value: "2.1GB", 
      icon: Database, 
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30",
      trend: "+5%",
      trendColor: "text-green-500"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "info",
      message: "Nouvel étudiant inscrit",
      time: "2 min",
      icon: UserPlus,
      color: "text-emerald-500"
    },
    {
      id: 2,
      type: "warning",
      message: "Mise à jour système disponible",
      time: "5 min",
      icon: Shield,
      color: "text-orange-500"
    },
    {
      id: 3,
      type: "success",
      message: "Sauvegarde automatique terminée",
      time: "10 min",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ];

  const isActive = (path) => location.pathname === path;

  const filteredLinks = navigationLinks.filter(link =>
    link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-md border ${
            darkMode 
              ? 'bg-gray-800/90 text-white border-gray-700' 
              : 'bg-white/90 text-gray-800 border-gray-200'
          }`}
        >
          <AnimatePresence mode="wait">
            {isMobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-500 ease-out ${
          isCollapsed ? 'w-20' : 'w-80'
        } ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-2xl border-r ${
          darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div 
            className={`p-6 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-xl shadow-lg"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent`}>
                      Administration
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gestion système avancée
                    </p>
                  </motion.div>
                )}
              </div>
              
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
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
                  
                  {/* Collapse Button */}
                  <motion.button
                    onClick={() => setIsCollapsed(true)}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
                        : 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Search Bar */}
          {!isCollapsed && (
            <motion.div 
              className="p-4 border-b border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-purple-500'
                  }`}
                />
              </div>
            </motion.div>
          )}

          {/* User Profile */}
          {!isCollapsed && (
            <motion.div 
              className="p-6 border-b border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 360,
                    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1">
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
            </motion.div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onHoverStart={() => setHoveredItem(link.to)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <motion.button
                  onClick={() => {
                    navigate(link.to);
                    setIsMobileOpen(false);
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 5,
                    boxShadow: isActive(link.to) 
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 relative ${
                    isActive(link.to)
                      ? `bg-gradient-to-r ${link.color} text-white shadow-lg`
                      : `${darkMode 
                          ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white' 
                          : 'hover:bg-gray-100/50 text-gray-700 hover:text-gray-800'
                        }`
                  }`}
                >
                  <motion.div
                    className={`p-2 rounded-lg relative ${
                      isActive(link.to) 
                        ? 'bg-white/20' 
                        : `${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}`
                    }`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 10,
                      boxShadow: isActive(link.to) 
                        ? "0 10px 15px -3px rgba(255, 255, 255, 0.2)" 
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      >
                        {link.badge}
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{link.label}</p>
                      <p className={`text-xs ${isActive(link.to) ? 'text-white/80' : 'opacity-60'}`}>
                        {link.description}
                      </p>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          {!isCollapsed && (
            <motion.div 
              className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Actions rapides
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${action.bgColor} ${action.darkBgColor} border ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* System Statistics
          {!isCollapsed && (
            <motion.div 
              className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Statistiques système
              </h3>
              <div className="space-y-2">
                {systemStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-3 rounded-lg ${stat.bgColor} ${stat.darkBgColor} border ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.darkBgColor}`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {stat.value}
                        </span>
                        <div className={`text-xs ${stat.trendColor}`}>
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )} */}

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-2">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/50 text-white hover:bg-gray-700/50' 
                    : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <motion.div
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'}`}
                >
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.div>
                {!isCollapsed && (
                  <span className="font-medium">Mode {darkMode ? 'Sombre' : 'Clair'}</span>
                )}
              </motion.button>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <motion.div
                  className="p-2 rounded-lg bg-red-600/50"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogOut className="w-4 h-4" />
                </motion.div>
                {!isCollapsed && (
                  <span className="font-medium">Déconnexion</span>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Collapse Button (when collapsed) */}
        {isCollapsed && (
          <motion.button
            onClick={() => setIsCollapsed(false)}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute -right-3 top-20 p-2 rounded-full shadow-lg backdrop-blur-md ${
              darkMode 
                ? 'bg-gray-800/90 text-white border border-gray-700/50' 
                : 'bg-white/90 text-gray-800 border border-gray-200/50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed left-80 top-20 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
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
                    <div className={`p-2 rounded-lg ${notification.color} bg-opacity-10`}>
                      <notification.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-80 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Mobile sidebar content - same as desktop but without collapse functionality */}
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-xl shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      Administration
                    </h1>
                    <p className="text-sm dark:text-gray-400 text-gray-600">
                      Gestion système avancée
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-2">
                {navigationLinks.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => {
                      navigate(link.to);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                      isActive(link.to)
                        ? `bg-gradient-to-r ${link.color} text-white shadow-lg`
                        : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 dark:text-gray-300 text-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive(link.to) 
                        ? 'bg-white/20' 
                        : 'bg-gray-100/50 dark:bg-gray-700/50'
                    }`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{link.label}</p>
                      <p className={`text-xs ${isActive(link.to) ? 'text-white/80' : 'opacity-60'}`}>
                        {link.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="p-2 rounded-lg bg-red-600/50">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 