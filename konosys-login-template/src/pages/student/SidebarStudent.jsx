import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getStudentDashboard, getStudentCourses } from "../../services/studentService";
import {
  User,
  BookOpen,
  Calendar,
  ClipboardList,
  MessageSquare,
  Menu,
  LogOut,
  GraduationCap,
  Clock,
  Target,
  Brain,
  Award,
  Moon,
  Sun,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Trophy,
  Zap,
  Bell,
  FileText,
  Users,
  TrendingUp,
  BarChart3,
  Settings,
  Power,
  MessageCircle,
  Settings2,
  Database,
  Home,
  BookOpenCheck,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle,
  UserCheck,
  BrainCircuit,
  MessageSquareText,
  HelpCircle,
  Library,
  Activity,
  Lightbulb,
  BookMarked,
  PenTool,
  Camera,
  Video,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Heart,
  Smile,
  Book,
  Calculator,
  Palette,
  Music,
  Globe,
  Gamepad2
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const SidebarStudent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("accueil");
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Élève" };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menuItems = [
    { 
      id: "accueil", 
      icon: Home, 
      label: "Accueil", 
      path: "/student", 
      description: "Tableau de bord",
      color: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    { 
      id: "cours", 
      icon: BookOpen, 
      label: "Mes cours", 
      path: "/student/cours", 
      description: "Vos cours",
      color: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    { 
      id: "notes", 
      icon: FileSpreadsheet, 
      label: "Mes Notes", 
      path: "/student/notes", 
      description: "Vos résultats",
      color: "bg-gradient-to-r from-purple-500 to-violet-600"
    },
    { 
      id: "planning", 
      icon: CalendarDays, 
      label: "Planning", 
      path: "/student/planning", 
      description: "Emploi du temps",
      color: "bg-gradient-to-r from-orange-500 to-red-600"
    },
    { 
      id: "rappels", 
      icon: ClipboardList, 
      label: "Rappels", 
      path: "/student/rappels", 
      description: "Tâches et devoirs",
      color: "bg-gradient-to-r from-pink-500 to-rose-600"
    },
    { 
      id: "absences", 
      icon: Clock, 
      label: "Absences", 
      path: "/student/absences", 
      description: "Suivi des présences",
      color: "bg-gradient-to-r from-indigo-500 to-blue-600"
    },
    { 
      id: "demandes", 
      icon: MessageSquareText, 
      label: "Demandes", 
      path: "/student/demandes", 
      description: "Communications",
      color: "bg-gradient-to-r from-teal-500 to-cyan-600"
    },
    { 
      id: "formations", 
      icon: Award, 
      label: "Formations", 
      path: "/student/formations", 
      description: "Formations disponibles",
      color: "bg-gradient-to-r from-yellow-500 to-orange-600"
    },
    { 
      id: "assistant", 
      icon: BrainCircuit, 
      label: "Assistant IA", 
      path: "/student/assistant", 
      description: "Aide intelligente",
      color: "bg-gradient-to-r from-violet-500 to-purple-600"
    },
    { 
      id: "profil", 
      icon: UserCheck, 
      label: "Profil", 
      path: "/student/profil", 
      description: "Informations personnelles",
      color: "bg-gradient-to-r from-slate-500 to-gray-600"
    }
  ];

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

  // Fetch des cours réels
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getStudentCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  // Déterminer l'élément actif basé sur l'URL actuelle
  useEffect(() => {
    const path = location.pathname;
    const currentItem = menuItems.find(item => item.path === path);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  const quickStats = [
    { 
      icon: BookOpen, 
      label: "Cours", 
      value: courses.length, 
      color: "from-blue-500 to-purple-600" 
    },
    { 
      icon: Award, 
      label: "Moyenne", 
      value: dashboardData?.averageGrade ? `${dashboardData.averageGrade.toFixed(1)}` : "-", 
      color: "from-green-500 to-emerald-600" 
    },
    { 
      icon: Clock, 
      label: "Présence", 
      value: dashboardData?.attendanceRate ? `${dashboardData.attendanceRate}%` : "-", 
      color: "from-purple-500 to-violet-600" 
    },
    { 
      icon: TrendingUp, 
      label: "Progression", 
      value: (typeof dashboardData?.completedAssignments === 'number' && typeof dashboardData?.upcomingAssignments === 'number')
        ? `${Math.round((dashboardData.completedAssignments / (dashboardData.completedAssignments + dashboardData.upcomingAssignments)) * 100)}%`
        : "-", 
      color: "from-orange-500 to-red-600" 
    }
  ];

  const handleNavigation = (path, itemId) => {
    setActiveItem(itemId);
    setIsMobileOpen(false);
    // Utiliser la navigation React Router
    navigate(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-[110] md:hidden p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: isCollapsed ? 90 : 320 }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-2xl z-50 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header avec Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo sans fond, encore plus grand */}
              <img
                src="/image pfe.png"
                alt="LEARNUP Logo"
                className="w-24 h-24 object-contain"
                style={{ background: 'none' }}
              />
              {!isCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-100 via-purple-200 to-pink-200 bg-clip-text text-transparent">LEARNUP</h1>
                  <p className="text-xs text-white/90">Plateforme étudiante</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-xs text-yellow-200 font-bold">Super Élève</span>
                    <Sparkles className="w-4 h-4 text-pink-200" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-3 rounded-xl bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              {/* Collapse Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-3 rounded-xl bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-lg"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{userInfo.name}</p>
                <p className="text-xs text-gray-700 dark:text-gray-200">Élève • Connecté</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">En ligne</span>
                  <Heart className="w-3 h-3 text-red-500" />
                  <Smile className="w-3 h-3 text-yellow-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu avec scroll amélioré */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 hover:scrollbar-thumb-purple-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div className="p-3 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeItem === item.id
                    ? `${item.color} text-white shadow-xl transform scale-105`
                    : "text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg"
                }`}
              >
                <motion.div 
                  className={`p-2 rounded-lg ${
                    activeItem === item.id 
                      ? 'bg-white/20 shadow-lg' 
                      : 'bg-white/60 dark:bg-gray-700/60 shadow-md'
                  }`}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <item.icon className="w-6 h-6" />
                </motion.div>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-bold text-base">{item.label}</div>
                    <div className="text-xs opacity-80 mt-1">{item.description}</div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold text-white">Mes statistiques</h3>
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
                        <div className={`p-2 rounded-lg bg-white/20`}>
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
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDarkMode && setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 shadow-lg"
            >
              {darkMode ? (
                <>
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sun className="w-3 h-3 text-white" />
                  </div>
                  {!isCollapsed && <span className="text-sm font-bold">Mode Clair</span>}
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <Moon className="w-3 h-3 text-white" />
                  </div>
                  {!isCollapsed && <span className="text-sm font-bold">Mode Sombre</span>}
                </>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation("/student/profil", "profil")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 shadow-lg"
            >
              <Settings2 className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-bold">Paramètres</span>}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50/20 dark:hover:bg-red-900/20 transition-all duration-300 shadow-lg"
            >
              <Power className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-bold">Déconnexion</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarStudent;
