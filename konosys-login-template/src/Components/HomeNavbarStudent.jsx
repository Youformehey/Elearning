import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Power,
  Sparkles,
  Star,
  BookOpen,
  Smile,
  X,
  Menu,
  ChevronDown,
  Home,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Trophy,
  BookOpenCheck,
  MessageCircle,
  Settings,
  User,
  Search,
  Plus,
  Bookmark,
  Lightbulb,
  Target,
  Crown,
  Award,
  Brain,
  Activity,
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Eye,
  FolderOpen,
  RefreshCw,
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
  Calculator,
  Palette,
  Music,
  Globe,
  Gamepad2,
  TrendingDown,
  ChevronLeft,
  Sun,
  Moon
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { getStudentDashboard } from "../services/studentService";
import NotificationRappelsStudent from "./NotificationRappelsStudent";

const HomeNavbarStudent = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const notifRef = useRef();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Élève" };

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

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-[999998] transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ marginLeft: '300px', top: '0px' }}
    >
      <div className="flex items-center justify-between px-5 py-3">6
        {/* Section gauche - Touches enfantines avec animations */}
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Touches enfantines agrandies */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="p-5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
            >
              <span className="text-4xl">🎮</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="p-5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
            >
              <span className="text-4xl">🎨</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="p-5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
            >
              <span className="text-4xl">🎵</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="p-5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
            >
              <span className="text-4xl">📚</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="p-5 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
            >
              <span className="text-4xl">🏆</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Section droite - Actions utilisateur avec séparations */}
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Statut en ligne */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-3 p-5 rounded-xl bg-green-400/30 hover:bg-green-400/50 transition-all duration-300 border border-green-300/50 backdrop-blur-sm"
          >
            <motion.div 
              className="w-5 h-5 bg-green-400 rounded-full shadow-md"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <span className="text-sm text-white font-bold">En ligne</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-green-200" />
            </motion.div>
          </motion.div>

          {/* Séparateur */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* Notifications */}
          <motion.button
            ref={notifRef}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 border border-white/30 backdrop-blur-sm"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Bell className="w-9 h-9" />
            </motion.div>
            {dashboardData?.upcomingAssignments > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md"
              >
                <span className="text-xs text-white font-bold">
                  {dashboardData.upcomingAssignments}
                </span>
              </motion.span>
            )}
          </motion.button>

          {/* Séparateur */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* Profil utilisateur */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 border border-white/30 backdrop-blur-sm"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <User className="w-9 h-9" />
            </motion.div>
            <span className="text-sm font-bold">Profil</span>
          </motion.button>

          {/* Séparateur */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* Mode sombre */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 border border-white/30 backdrop-blur-sm"
          >
            {darkMode ? (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Sun className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Moon className="w-8 h-8" />
              </motion.div>
            )}
            <span className="text-sm font-bold">{darkMode ? 'Clair' : 'Sombre'}</span>
          </motion.button>

          {/* Séparateur */}
          <div className="w-px h-8 bg-white/30"></div>

          {/* Déconnexion */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 border-2 border-blue-400/50 shadow-xl backdrop-blur-sm"
          >
            <motion.div 
              className="p-3 bg-blue-700 rounded-lg shadow-md"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Power className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-sm font-bold">Déconnexion</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Notifications dropdown avec animations améliorées */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-6 mt-4 w-96 rounded-2xl shadow-2xl border-4 border-blue-300 p-6 z-50 bg-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Bell className="w-7 h-7 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800">Mes Rappels</h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </div>
            <NotificationRappelsStudent />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HomeNavbarStudent;
