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
  Gamepad2,
  Plus,
  Bookmark,
  TrendingDown,
  Crown
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
      label: "Accueil", 
      path: "/student", 
      emoji: "🏠"
    },
    { 
      id: "cours", 
      label: "Mes cours", 
      path: "/student/cours", 
      emoji: "📚"
    },
    { 
      id: "notes", 
      label: "Mes Notes", 
      path: "/student/notes", 
      emoji: "📊"
    },
    { 
      id: "planning", 
      label: "Planning", 
      path: "/student/planning", 
      emoji: "📅"
    },
    { 
      id: "rappels", 
      label: "Rappels", 
      path: "/student/rappels", 
      emoji: "📝"
    },
    { 
      id: "absences", 
      label: "Absences", 
      path: "/student/absences", 
      emoji: "⏰"
    },
    { 
      id: "demandes", 
      label: "Demandes", 
      path: "/student/demandes", 
      emoji: "💬"
    },
    { 
      id: "formations", 
      label: "Formations", 
      path: "/student/formations", 
      emoji: "🏆"
    },
    { 
      id: "assistant", 
      label: "Assistant IA", 
      path: "/student/assistant", 
      emoji: "🤖"
    },
    { 
      id: "profil", 
      label: "Profil", 
      path: "/student/profil", 
      emoji: "👤"
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

  const handleNavigation = (path, itemId) => {
    setActiveItem(itemId);
    setIsMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-[110] md:hidden p-4 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <Menu size={30} />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 300 }}
        animate={{ width: isCollapsed ? 100 : 300 }}
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 border-r-2 border-blue-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header avec animations - même hauteur que navbar */}
        <div className="p-6 border-b-2 border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-3 bg-white rounded-xl shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ type: "tween", duration: 0.6 }}
              >
                <img
                  src="/image pfe.png"
                  alt="LEARNUP Logo"
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
              {!isCollapsed && (
                <div>
                  <motion.h1 
                    className="text-2xl font-bold text-white"
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 20px rgba(255,255,255,0.5)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    LEARNUP
                  </motion.h1>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                    <p className="text-xs text-white/90">Super Élève</p>
                    <motion.div
                      animate={{ scale: 1 }}
                      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Collapse Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-white" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* User Info avec animations */}
        <div className="p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
                          <motion.div 
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
            {!isCollapsed && (
              <div>
                <p className="text-lg font-bold text-gray-800">{userInfo.name}</p>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: 1 }}
                    transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                  ></motion.div>
                  <p className="text-xs text-gray-600">Élève • En ligne</p>
                  <motion.div
                    animate={{ rotate: 0 }}
                    transition={{ type: "tween", duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-4 h-4 text-red-400" />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu optimisé avec icônes légèrement réduites */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-3 space-y-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeItem === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <motion.div 
                  className={`p-4 rounded-xl ${
                    activeItem === item.id 
                      ? 'bg-white/20' 
                      : 'bg-blue-600 bg-opacity-10'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className={`text-4xl ${activeItem === item.id ? 'text-white' : 'text-blue-600'}`}>
                    {item.emoji}
                  </span>
                </motion.div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold">{item.label}</div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer avec animations */}
        <div className="p-3 border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDarkMode && setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-all duration-300"
            >
              {darkMode ? (
                <>
                                <motion.div 
                className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sun className="w-6 h-6 text-white" />
              </motion.div>
                  {!isCollapsed && <span className="text-xs font-medium">Mode Clair</span>}
                </>
              ) : (
                <>
                                <motion.div 
                className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Moon className="w-6 h-6 text-white" />
              </motion.div>
                  {!isCollapsed && <span className="text-xs font-medium">Mode Sombre</span>}
                </>
              )}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              <motion.div 
                className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Power className="w-6 h-6 text-white" />
              </motion.div>
              {!isCollapsed && <span className="text-xs font-medium">Déconnexion</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarStudent;
