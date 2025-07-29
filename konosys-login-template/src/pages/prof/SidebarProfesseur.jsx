import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Calendar,
  FileText,
  Award,
  GraduationCap,
  Bell,
  User,
  BookOpen,
  Clock,
  FolderKanban,
  FilePlus2,
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  Star,
  Crown,
  BookMarked,
  ClipboardList,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle,
  MessageCircle,
  UserCheck,
  Cog,
  Power,
  Search,
  Moon,
  Sun,
  Zap,
  Heart,
  Shield,
  Trophy,
  BookOpenCheck,
  CalendarCheck,
  FileCheck,
  MessageSquareMore,
  UserCog,
  Settings2
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { getStudentDashboard } from "../../services/studentService";

const SidebarProfesseur = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("accueil");
  const [dashboardData, setDashboardData] = useState(null);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Professeur" };

  // Récupération des données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getStudentDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Détecter l'élément actif basé sur l'URL
  useEffect(() => {
    const path = location.pathname;
    const currentItem = menuItems.find(item => item.path === path);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const menuItems = [
    { 
      id: "accueil", 
      icon: Home, 
      label: "Accueil", 
      path: "/prof", 
      description: "Tableau de bord principal",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "dashboard", 
      icon: BarChart3, 
      label: "Dashboard", 
      path: "/prof/dashboard", 
      description: "Vue d'ensemble complète",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "cours", 
      icon: BookOpen, 
      label: "Mes cours", 
      path: "/prof/cours", 
      description: "Gestion des cours",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "notes", 
      icon: ClipboardList, 
      label: "Notes", 
      path: "/prof/notes", 
      description: "Évaluation des élèves",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "absences", 
      icon: Clock, 
      label: "Absences", 
      path: "/prof/absences", 
      description: "Suivi des présences",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "planning", 
      icon: CalendarDays, 
      label: "Planning", 
      path: "/prof/planning", 
      description: "Emploi du temps",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "documents", 
      icon: FileSpreadsheet, 
      label: "Documents", 
      path: "/prof/documents", 
      description: "Ressources pédagogiques",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "rappels", 
      icon: Bell, 
      label: "Rappels", 
      path: "/prof/rappels", 
      description: "Notifications importantes",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "rappels-faits", 
      icon: CheckCircle, 
      label: "Rappels faits", 
      path: "/prof/rappels/1/faits", 
      description: "Historique des rappels",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "demandes", 
      icon: MessageCircle, 
      label: "Demandes", 
      path: "/prof/demandes", 
      description: "Communications",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "profil", 
      icon: UserCheck, 
      label: "Profil", 
      path: "/prof/profil", 
      description: "Informations personnelles",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "parametres", 
      icon: Settings2, 
      label: "Paramètres", 
      path: "/prof/parametres", 
      description: "Configuration",
      color: "from-blue-600 to-blue-700"
    }
  ];

  const quickStats = [
    { 
      icon: BookOpen, 
      label: "Cours", 
      value: dashboardData?.totalCourses || "8", 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      icon: Users, 
      label: "Élèves", 
      value: dashboardData?.totalStudents || "156", 
      color: "from-blue-600 to-blue-700" 
    },
    { 
      icon: Award, 
      label: "Moyenne", 
      value: dashboardData?.averageGrade ? `${dashboardData.averageGrade.toFixed(1)}` : "15.2", 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      icon: TrendingUp, 
      label: "Progression", 
      value: dashboardData?.attendanceRate ? `${dashboardData.attendanceRate}%` : "87%", 
      color: "from-blue-600 to-blue-700" 
    }
  ];

  const handleNavigation = (path, itemId) => {
    setActiveItem(itemId);
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-[110] md:hidden p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </motion.button>

      {/* Mobile Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: isCollapsed ? 90 : 320 }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-2xl z-50 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header avec Logo - Même hauteur que navbar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white shadow-xl border-2 border-white/30 flex items-center justify-center overflow-hidden">
                <img
                  src="/image pfe.png"
                  alt="LEARNUP Logo"
                  className="w-full h-full object-contain p-1"
                  style={{ background: 'none' }}
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">LEARNUP</h1>
                  <p className="text-xs text-white/90">Espace Professeur</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs text-yellow-200 font-bold">Premium</span>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 rounded-lg bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
              >
                <X className="w-4 h-4" />
              </motion.button>
              
              {/* Collapse Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 rounded-lg bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{userInfo.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Professeur • Connecté</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">En ligne</span>
                  <Heart className="w-3 h-3 text-red-500" />
                  <Star className="w-3 h-3 text-yellow-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu avec scroll amélioré */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-blue-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="p-3 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeItem === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-xl transform scale-105`
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg"
                }`}
              >
                <motion.div 
                  className={`p-2 rounded-lg ${
                    activeItem === item.id 
                      ? 'bg-white/20 shadow-lg' 
                      : 'bg-white shadow-md'
                  }`}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs opacity-80 mt-0.5">{item.description}</div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold text-white">Statistiques rapides</h3>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="rounded-lg p-2 border border-white/20 shadow-lg backdrop-blur-sm bg-white/10"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-white/20`}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {dashboardData ? stat.value : (
                          <div className="w-4 h-4 border-2 border-white border-t-blue-200 rounded-full animate-spin"></div>
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              {darkMode ? (
                <>
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sun className="w-3 h-3 text-white" />
                  </div>
                  {!isCollapsed && <span className="text-xs font-bold">Mode Clair</span>}
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <Moon className="w-3 h-3 text-white" />
                  </div>
                  {!isCollapsed && <span className="text-xs font-bold">Mode Sombre</span>}
                </>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation("/prof/parametres", "parametres")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              <Settings2 className="w-5 h-5" />
              {!isCollapsed && <span className="text-xs font-bold">Paramètres</span>}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 shadow-lg"
            >
              <Power className="w-5 h-5" />
              {!isCollapsed && <span className="text-xs font-bold">Déconnexion</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarProfesseur;

