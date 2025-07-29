import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Moon,
  Sun,
  User,
  Trophy,
  Settings,
  LogOut,
  Search,
  Sparkles,
  Star,
  Crown,
  Zap,
  Heart,
  Shield,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  Target,
  Award,
  Brain,
  BookOpen,
  GraduationCap,
  Users,
  TrendingUp,
  BarChart3,
  Database,
  Power,
  Settings2,
  MessageCircle,
  X,
  CheckCircle,
  AlertCircle,
  BookOpenCheck,
  Menu,
  ChevronDown,
  Smile,
  Book,
  Calculator,
  Palette,
  Music,
  Globe,
  Gamepad2,
  Camera,
  Video,
  Headphones,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { getStudentDashboard } from "../services/studentService";
import NotificationRappelsStudent from "./NotificationRappelsStudent";

const HomeNavbarStudent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const notifRef = useRef();
  const menuRef = useRef();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-[999998] transition-all duration-300 backdrop-blur-md ${
        isScrolled 
          ? darkMode 
            ? 'bg-gray-900/95 shadow-2xl border-b border-gray-700' 
            : 'bg-white/95 shadow-2xl border-b border-gray-200'
          : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ marginLeft: '320px' }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-8">
        {/* Logo + Title avec animation */}
        <motion.div 
          className="flex items-center gap-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative flex items-center"
          >
            {/* Logo sans background, aligné avec LEARNUP */}
            <img 
              src="/image pfe.png" 
              alt="LEARNUP Logo" 
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain"
              style={{ background: 'none' }}
            />
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col justify-center">
            <motion.span 
              className="text-3xl sm:text-4xl font-bold tracking-wide bg-gradient-to-r from-blue-100 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              LEARNUP
            </motion.span>
            <motion.div 
              className="flex items-center gap-2 text-sm text-white font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Plateforme d'apprentissage</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <Smile className="w-4 h-4 text-pink-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Search Bar - Desktop */}
        <motion.div 
          className="hidden lg:flex items-center flex-1 max-w-lg mx-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher cours, documents, professeurs..."
              className={`w-full pl-14 pr-4 py-4 rounded-2xl border-2 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 text-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white'
              }`}
            />
          </div>
        </motion.div>

        {/* Actions utilisateur */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Notifications */}
          <motion.button
            ref={notifRef}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20"
          >
            <Bell className="w-7 h-7" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-bold">
                {dashboardData?.upcomingAssignments || 0}
              </span>
            </span>
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20"
          >
            {darkMode ? (
              <Sun className="w-7 h-7" />
            ) : (
              <Moon className="w-7 h-7" />
            )}
          </motion.button>

          {/* Profil utilisateur */}
          <motion.button
            ref={menuRef}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20"
          >
            <User className="w-7 h-7" />
            <span className="hidden sm:block font-bold text-xl">Élève</span>
            <Trophy className="w-6 h-6" />
            <Smile className="w-5 h-5" />
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Déconnexion Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/80 hover:bg-red-600/80 text-white transition-all duration-300 shadow-xl backdrop-blur-sm border border-red-400/20"
          >
            <Power className="w-6 h-6" />
            <span className="hidden sm:block font-bold text-lg">Déconnexion</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white shadow-xl backdrop-blur-sm border border-white/20"
          >
            <Menu className="w-7 h-7" />
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-sm"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Search Bar - Mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 bg-white/90 border-white/20 text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/20 text-white backdrop-blur-sm border border-white/20"
                >
                  <Settings className="w-6 h-6" />
                  <span className="text-base font-medium">Paramètres</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/80 text-white backdrop-blur-sm border border-red-400/20"
                >
                  <Power className="w-6 h-6" />
                  <span className="text-base font-medium">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu déroulant */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-4 w-80 rounded-2xl shadow-2xl border-2 p-6 z-50 bg-white/95 backdrop-blur-md border-white/20"
          >
            <div className="space-y-4">
              {/* Info utilisateur */}
              <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-800">
                    {userInfo.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-base text-gray-600">
                      Élève • Connecté
                    </p>
                    <Smile className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Settings className="w-6 h-6" />
                  <span className="text-base font-medium">Profil</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <Settings2 className="w-6 h-6" />
                  <span className="text-base font-medium">Paramètres</span>
                </motion.button>
              </div>

              {/* Déconnexion */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors border-2 border-red-200"
              >
                <Power className="w-6 h-6" />
                <span className="text-base font-medium">Se déconnecter</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications dropdown avec vraies données */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-32 w-96 rounded-2xl shadow-2xl border-2 p-6 z-50 bg-white/95 backdrop-blur-md border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-7 h-7 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Mes Rappels
                </h3>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Rappels actifs
              </span>
            </div>
            
            {/* Vraies notifications de l'étudiant */}
            <NotificationRappelsStudent />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HomeNavbarStudent;
