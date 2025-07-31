import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Calendar,
  FileText,
  Award,
  GraduationCap,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreHorizontal,
  Eye,
  Heart,
  Star,
  Crown,
  Sparkles,
  BookOpen,
  Shield,
  Trophy,
  BookMarked,
  ClipboardList,
  CalendarDays,
  FileSpreadsheet,
  UserCheck,
  Cog,
  Power,
  Moon,
  Sun,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  UserCog,
  Settings2,
  HeartHandshake,
  Baby,
  School,
  BookOpenCheck,
  CalendarCheck,
  FileCheck,
  MessageSquareMore,
  CreditCard,
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
  Globe
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { parentService } from "../services/parentService";

export default function HomeNavbarParent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Récupérer les données parent pour les statistiques
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

  const quickActions = [
    {
      icon: CalendarCheck,
      label: "Voir Absences",
      action: () => navigate("/parent/absences"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      description: "Consulter les absences"
    },
    {
      icon: Award,
      label: "Consulter Notes",
      action: () => navigate("/parent/notes"),
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-100",
      darkBgColor: "dark:bg-yellow-900/30",
      description: "Voir les notes récentes"
    },
    {
      icon: MessageSquare,
      label: "Nouvelle Demande",
      action: () => navigate("/parent/demandes"),
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-100",
      darkBgColor: "dark:bg-indigo-900/30",
      description: "Créer une demande"
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => navigate("/parent/notifications"),
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-100",
      darkBgColor: "dark:bg-red-900/30",
      description: "Voir les alertes"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "info",
      message: "Nouvelle note disponible pour votre enfant",
      time: "2 min",
      icon: Award,
      color: "text-yellow-500",
      action: () => navigate("/parent/notes")
    },
    {
      id: 2,
      type: "warning",
      message: "Absence signalée aujourd'hui",
      time: "5 min",
      icon: AlertCircle,
      color: "text-red-500",
      action: () => navigate("/parent/absences")
    },
    {
      id: 3,
      type: "success",
      message: "Demande de formation approuvée",
      time: "10 min",
      icon: CheckCircle,
      color: "text-green-500",
      action: () => navigate("/parent/formations")
    },
    {
      id: 4,
      type: "info",
      message: "Rappel: Réunion parents-professeurs demain",
      time: "1h",
      icon: Clock,
      color: "text-blue-500",
      action: () => navigate("/parent/dashboard")
    }
  ];

  const childrenStats = [
    {
      label: "Enfants",
      value: parentData?.stats?.totalChildren?.toString() || "0",
      icon: Baby,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30"
    },
    {
      label: "Moyenne",
      value: parentData?.stats?.averageGrade?.toString() || "0",
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      darkBgColor: "dark:bg-yellow-900/30"
    },
    {
      label: "Présence",
      value: `${parentData?.stats?.attendanceRate?.toString() || "100"}%`,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30"
    }
  ];

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
        : 'bg-white/95 backdrop-blur-md border-gray-200'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo & Search */}
          <div className="flex items-center gap-6 flex-1">
            {/* Logo/Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600`}>
                <School className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  LearnUp Parent
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Espace Parent
                </p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher dans l'espace parent..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
              </motion.div>
            </div>
          </div>

          {/* Center - Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            {childrenStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className={`p-1.5 rounded-md ${stat.bgColor} ${stat.darkBgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <Plus className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {showQuickActions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-3">
                      <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Actions Rapides
                      </h3>
                      <div className="space-y-2">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={action.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              action.action();
                              setShowQuickActions(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md ${action.bgColor} ${action.darkBgColor}`}>
                              <action.icon className={`w-4 h-4 ${action.color}`} />
                            </div>
                            <div className="text-left flex-1">
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {action.label}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {action.description}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-all duration-200 relative ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bell className="w-5 h-5" />
                {parentData?.stats?.recentNotifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs text-white font-bold">
                      {parentData.stats.recentNotifications}
                    </span>
                  </motion.div>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border z-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className={`p-1 rounded-md ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              notification.action();
                              setShowNotifications(false);
                            }}
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <notification.icon className={`w-4 h-4 ${notification.color}`} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {userInfo.name || "Parent"}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {userInfo.email || "parent@learnup.com"}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-3 p-2 mb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {userInfo.name || "Parent"}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {userInfo.email || "parent@learnup.com"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            navigate("/parent/profil");
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          <span>Mon Profil</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate("/parent/dashboard");
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Home className="w-4 h-4" />
                          <span>Tableau de bord</span>
                        </button>
                        
                        <button
                          onClick={toggleDarkMode}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate("/parent/settings");
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Paramètres</span>
                        </button>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 