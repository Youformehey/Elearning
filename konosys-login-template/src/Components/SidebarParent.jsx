import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home,
  Calendar,
  FileText,
  Award,
  GraduationCap,
  Bell,
  User,
  Users,
  Settings,
  LogOut,
  Search,
  Heart,
  Star,
  Crown,
  Sparkles,
  BookOpen,
  Clock,
  MessageCircle,
  Shield,
  Trophy,
  BookMarked,
  ClipboardList,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle,
  UserCheck,
  Cog,
  Power,
  Moon,
  Sun,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Menu,
  X,
  UserCog,
  Settings2,
  HeartHandshake,
  Baby,
  School,
  BookOpenCheck,
  CalendarCheck,
  FileCheck,
  MessageSquareMore,
  Eye,
  CreditCard,
  AlertCircle,
  MessageSquare,
  UserPlus,
  Activity,
  PieChart,
  LineChart,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { parentService } from "../services/parentService";

export default function SidebarParent() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Récupérer les vraies données parent
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true);
        const data = await parentService.getParentStats();
        setParentData(data);
        setError(null);
      } catch (err) {
        console.error('Erreur récupération données parent:', err);
        setError(err.message);
        // Utiliser des données par défaut en cas d'erreur
        setParentData({
          profile: userInfo,
          stats: {
            totalChildren: 2,
            totalNotes: 15,
            totalAbsences: 3,
            totalFormations: 2,
            totalDemandes: 5,
            averageGrade: 15.2,
            attendanceRate: 92,
            recentNotifications: 3
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navigationLinks = [
    {
      to: "/parent/dashboard",
      icon: Home, 
      label: "Tableau de bord", 
      description: "Vue d'ensemble",
      color: "from-blue-500 via-blue-600 to-blue-700",
      bgColor: "from-blue-50 to-blue-100",
      darkBgColor: "from-blue-900/20 to-blue-800/20",
      accent: "blue",
      badge: null
    },
    {
      to: "/parent/absences",
      icon: Calendar, 
      label: "Absences", 
      description: "Suivi des présences",
      color: "from-emerald-500 via-emerald-600 to-emerald-700",
      bgColor: "from-emerald-50 to-emerald-100",
      darkBgColor: "from-emerald-900/20 to-emerald-800/20",
      accent: "emerald",
      badge: parentData?.stats?.totalAbsences?.toString() || "0"
    },
    {
      to: "/parent/notes",
      icon: Award, 
      label: "Notes", 
      description: "Progression scolaire",
      color: "from-yellow-500 via-yellow-600 to-yellow-700",
      bgColor: "from-yellow-50 to-yellow-100",
      darkBgColor: "from-yellow-900/20 to-yellow-800/20",
      accent: "yellow",
      badge: parentData?.stats?.totalNotes?.toString() || "0"
    },
    {
      to: "/parent/formations",
      icon: GraduationCap, 
      label: "Formations", 
      description: "Gestion des paiements",
      color: "from-purple-500 via-purple-600 to-purple-700",
      bgColor: "from-purple-50 to-purple-100",
      darkBgColor: "from-purple-900/20 to-purple-800/20",
      accent: "purple",
      badge: parentData?.stats?.totalFormations?.toString() || "0"
    },
    {
      to: "/parent/notifications",
      icon: Bell, 
      label: "Notifications", 
      description: "Alertes importantes",
      color: "from-red-500 via-red-600 to-red-700",
      bgColor: "from-red-50 to-red-100",
      darkBgColor: "from-red-900/20 to-red-800/20",
      accent: "red",
      badge: parentData?.stats?.recentNotifications?.toString() || "0"
    },
    {
      to: "/parent/demandes",
      icon: FileText, 
      label: "Demandes", 
      description: "Communications",
      color: "from-indigo-500 via-indigo-600 to-indigo-700",
      bgColor: "from-indigo-50 to-indigo-100",
      darkBgColor: "from-indigo-900/20 to-indigo-800/20",
      accent: "indigo",
      badge: parentData?.stats?.totalDemandes?.toString() || "0"
    },
    {
      to: "/parent/rappels",
      icon: Clock,
      label: "Rappels",
      description: "Rappels importants",
      color: "from-orange-500 via-orange-600 to-orange-700",
      bgColor: "from-orange-50 to-orange-100",
      darkBgColor: "from-orange-900/20 to-orange-800/20",
      accent: "orange",
      badge: "2"
    },
    {
      to: "/parent/profil",
      icon: User, 
      label: "Profil", 
      description: "Informations personnelles",
      color: "from-pink-500 via-pink-600 to-pink-700",
      bgColor: "from-pink-50 to-pink-100",
      darkBgColor: "from-pink-900/20 to-pink-800/20",
      accent: "pink",
      badge: null
    }
  ];

  const quickActions = [
    {
      icon: CalendarCheck,
      label: "Voir Absences",
      action: () => navigate("/parent/absences"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30"
    },
    {
      icon: Award,
      label: "Consulter Notes",
      action: () => navigate("/parent/notes"),
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-100",
      darkBgColor: "dark:bg-yellow-900/30"
    },
    {
      icon: MessageSquare,
      label: "Nouvelle Demande",
      action: () => navigate("/parent/demandes"),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      darkBgColor: "dark:bg-indigo-900/30"
    }
  ];

  const childrenStats = [
    { 
      label: "Enfants", 
      value: parentData?.stats?.totalChildren?.toString() || "0", 
      icon: Baby, 
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30",
      trend: "+0%",
      trendColor: "text-gray-500"
    },
    { 
      label: "Moyenne", 
      value: parentData?.stats?.averageGrade?.toString() || "0", 
      icon: Award, 
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      darkBgColor: "dark:bg-yellow-900/30",
      trend: "+2.1%",
      trendColor: "text-green-500"
    },
    { 
      label: "Présence", 
      value: `${parentData?.stats?.attendanceRate?.toString() || "100"}%`, 
      icon: CheckCircle, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      trend: "+5%",
      trendColor: "text-green-500"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "info",
      message: "Nouvelle note disponible",
      time: "2 min",
      icon: Award, 
      color: "text-yellow-500"
    },
    {
      id: 2,
      type: "warning",
      message: "Absence signalée",
      time: "5 min",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      id: 3,
      type: "success",
      message: "Paiement formation validé",
      time: "10 min",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 4,
      type: "info",
      message: "Nouveau message du professeur",
      time: "15 min",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      id: 5,
      type: "info",
      message: "Rappel: Réunion parents",
      time: "1h",
      icon: Calendar,
      color: "text-purple-500"
    }
  ];

  const isActive = (path) => location.pathname === path;

  const filteredLinks = navigationLinks.filter(link =>
    link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

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
                  className="p-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 10,
                    boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HeartHandshake className="w-6 h-6 text-white" />
                </motion.div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`}>
                      Espace Parent
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gestion scolaire avancée
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-500 font-bold">Premium</span>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
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
                    {parentData?.stats?.recentNotifications > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      />
                    )}
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
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-500'
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
                    {parentData?.profile?.name || userInfo.name || "Parent"}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {parentData?.profile?.email || userInfo.email || "parent@learnup.com"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-500">En ligne</span>
                    <Heart className="w-3 h-3 text-red-500 ml-2" />
                    <Star className="w-3 h-3 text-yellow-500" />
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
                    {link.badge && link.badge !== "0" && (
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

          {/* Children Statistics */}
      {!isCollapsed && (
            <motion.div 
              className="p-4 border-t border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Statistiques enfants
              </h3>
              <div className="space-y-2">
                {childrenStats.map((stat, index) => (
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
          )}

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

          {/* Settings */}
          <motion.button
                onClick={() => navigate("/parent/profil")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800/50 text-white hover:bg-gray-700/50' 
                    : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <motion.div
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'}`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Settings2 className="w-4 h-4" />
                </motion.div>
                {!isCollapsed && (
                  <span className="font-medium">Paramètres</span>
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
                  <div className="p-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-lg">
                    <HeartHandshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Espace Parent
                    </h1>
                    <p className="text-sm dark:text-gray-400 text-gray-600">
                      Gestion scolaire avancée
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