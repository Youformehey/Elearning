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
      id: "dashboard", 
      icon: BarChart3, 
      label: "Dashboard", 
      path: "/prof/dashboard", 
      description: "Vue d'ensemble complète",
      color: "from-blue-700 to-blue-800"
    },
    { 
      id: "cours", 
      icon: BookOpen, 
      label: "Mes cours", 
      path: "/prof/cours", 
      description: "Gestion des cours",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "notes", 
      icon: ClipboardList, 
      label: "Notes", 
      path: "/prof/notes", 
      description: "Évaluation des élèves",
      color: "from-blue-700 to-blue-800"
    },
    { 
      id: "absences", 
      icon: UserCheck, 
      label: "Absences", 
      path: "/prof/absences", 
      description: "Suivi des présences",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "planning", 
      icon: CalendarDays, 
      label: "Planning", 
      path: "/prof/planning", 
      description: "Emploi du temps",
      color: "from-blue-700 to-blue-800"
    },
    { 
      id: "documents", 
      icon: FileCheck, 
      label: "Documents", 
      path: "/prof/documents", 
      description: "Ressources pédagogiques",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "rappels", 
      icon: Bell, 
      label: "Rappels", 
      path: "/prof/rappels", 
      description: "Notifications importantes",
      color: "from-blue-700 to-blue-800"
    },
    { 
      id: "rappels-faits", 
      icon: CheckCircle, 
      label: "Rappels faits", 
      path: "/prof/rappels/1/faits", 
      description: "Historique des rappels",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "demandes", 
      icon: MessageCircle, 
      label: "Demandes", 
      path: "/prof/demandes", 
      description: "Communications",
      color: "from-blue-700 to-blue-800"
    },
    { 
      id: "profil", 
      icon: UserCog, 
      label: "Profil", 
      path: "/prof/profil", 
      description: "Informations personnelles",
      color: "from-blue-600 to-blue-700"
    },
    { 
      id: "parametres", 
      icon: Settings2, 
      label: "Paramètres", 
      path: "/prof/parametres", 
      description: "Configuration",
      color: "from-blue-700 to-blue-800"
    }
  ];

  const quickStats = [
    { 
      icon: BookOpen, 
      label: "Cours", 
      value: dashboardData?.totalCourses || "8", 
      color: "from-blue-600 to-blue-700" 
    },
    { 
      icon: Users, 
      label: "Élèves", 
      value: dashboardData?.totalStudents || "156", 
      color: "from-blue-700 to-blue-800" 
    },
    { 
      icon: Award, 
      label: "Moyenne", 
      value: dashboardData?.averageGrade ? `${dashboardData.averageGrade.toFixed(1)}` : "15.2", 
      color: "from-blue-600 to-blue-700" 
    },
    { 
      icon: TrendingUp, 
      label: "Progression", 
      value: dashboardData?.attendanceRate ? `${dashboardData.attendanceRate}%` : "87%", 
      color: "from-blue-700 to-blue-800" 
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
        className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-800 dark:text-white shadow-2xl z-50 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header avec Logo - Hauteur agrandie */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-900/90 to-blue-700/80 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/80 shadow-2xl border-2 border-white/30 flex items-center justify-center overflow-hidden">
                <img
                  src="/image pfe.png"
                  alt="LEARNUP Logo"
                  className="w-full h-full object-contain p-1"
                  style={{ background: 'none' }}
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">LEARNUP</h1>
                  <p className="text-sm text-white/80 font-medium">Espace Professeur</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-4 h-4 text-yellow-300 drop-shadow" />
                    <span className="text-sm text-yellow-200 font-bold">Premium</span>
                    <Sparkles className="w-4 h-4 text-white" />
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
                className="md:hidden p-2 rounded-xl bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600 transition-all duration-300 shadow-xl"
              >
                <X className="w-4 h-4" />
              </motion.button>
              {/* Collapse Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 rounded-xl bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600 transition-all duration-300 shadow-xl"
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
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100/60 to-blue-300/40 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-blue-600/80 to-blue-700/80 rounded-full flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
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
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/70 scrollbar-track-blue-100/30 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-blue-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="p-3 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.03, x: 6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeItem === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-2xl transform scale-105 border border-white/30`
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-gray-700/60 hover:shadow-xl"
                }`}
              >
                <motion.div 
                  className={`p-3 rounded-xl ${
                    activeItem === item.id 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border border-white/20' 
                      : 'bg-gradient-to-r from-gray-100/80 to-gray-200/80 shadow-lg'
                  }`}
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <item.icon className={`w-7 h-7 ${
                    activeItem === item.id 
                      ? 'text-white' 
                      : 'text-blue-700'
                  }`} />
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
          <div className="p-5 border-t border-gray-200 dark:border-gray-700">
            <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-700/90 to-blue-800/80 p-6 backdrop-blur-lg border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
                <h3 className="text-sm font-bold text-white">Statistiques rapides</h3>
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="rounded-xl p-3 border border-white/20 shadow-lg backdrop-blur-sm bg-white/10"
                    whileHover={{ scale: 1.07, y: -2 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-white/20`}>
                          <stat.icon className="w-5 h-5 text-white" />
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
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100/60 to-blue-300/40 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg">
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-900 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-xl"
            >
              {darkMode ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  {!isCollapsed && <span className="text-xs font-bold">Mode Clair</span>}
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <Moon className="w-5 h-5 text-white" />
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
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-900 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-xl"
            >
              <Settings2 className="w-7 h-7" />
              {!isCollapsed && <span className="text-xs font-bold">Paramètres</span>}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/30 transition-all duration-300 shadow-xl"
            >
              <Power className="w-7 h-7" />
              {!isCollapsed && <span className="text-xs font-bold">Déconnexion</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarProfesseur;

