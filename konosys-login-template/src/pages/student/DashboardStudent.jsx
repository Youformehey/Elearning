import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import {
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Star,
  Trophy,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Brain,
  Lightbulb,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  BookOpenCheck,
  UserCheck,
  BarChart3,
  Activity,
  Zap,
  Crown,
  Gem,
  Diamond,
  Moon,
  Sun,
  Rainbow,
  Flower,
  Cloud,
  Rocket,
  Heart,
  Smile,
  Book,
  Calculator,
  Palette,
  Music,
  Globe,
  Gamepad2,
  Plus,
  Minus,
  Play,
  Pause,
  Volume2,
  Eye,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardStudent = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const studentEmail = userInfo.email || userInfo.userEmail;
  const token = userInfo?.token;

  // Fonction pour récupérer les vraies données
  const fetchRealData = useCallback(async () => {
    console.log("🔍 Vérification des données utilisateur:", { studentEmail, hasToken: !!token, userInfo });
    
    if (!studentEmail) {
      console.warn("⚠️ Aucun email trouvé dans localStorage.");
      console.log("📋 Contenu de userInfo:", userInfo);
      setError("Email manquant. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    if (!token) {
      console.warn("⚠️ Aucun token trouvé dans localStorage.");
      setError("Token manquant. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      console.log("📩 Récupération des données pour:", studentEmail);

      const res = await axios.get("http://localhost:5001/api/students/dashboard", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { email: studentEmail },
      });
      
      console.log("📊 Données reçues:", res.data);
      
      if (res.data && typeof res.data === 'object') {
        setStats(res.data);
        setError(null);
      } else {
        throw new Error("Données invalides reçues du serveur");
      }
    } catch (err) {
      console.error("❌ Erreur récupération données:", err);
      setError("Erreur lors de la récupération des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentEmail, token]);

  useEffect(() => {
    fetchRealData();
  }, [fetchRealData]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Rafraîchissement automatique des données...");
      fetchRealData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchRealData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRealData();
  };

  const statCards = [
    {
      icon: "📚",
      title: "Mes Cours",
      value: stats?.totalCours ?? "0",
      change: "+12%",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      bgColor: darkMode ? "bg-blue-900/20" : "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: darkMode ? "border-blue-700" : "border-blue-200",
      emoji: "📖",
      description: "Cours actifs"
    },
    {
      icon: "👥",
      title: "Mes Amis",
      value: stats?.totalEtudiants ?? "0",
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      bgColor: darkMode ? "bg-green-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: darkMode ? "border-green-700" : "border-green-200",
      emoji: "🤝",
      description: "Camarades de classe"
    },
    {
      icon: "🎯",
      title: "Mes Objectifs",
      value: `${stats?.objectifsAtteints ?? 75}%`,
      change: "+8%",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      bgColor: darkMode ? "bg-purple-900/20" : "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: darkMode ? "border-purple-700" : "border-purple-200",
      emoji: "⭐",
      description: "Objectifs atteints"
    },
    {
      icon: "⏰",
      title: "Prochain Cours",
      value: stats?.prochainCours ? "Aujourd'hui" : "Aucun",
      change: stats?.prochainCours ? "Dans 2h" : "",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      bgColor: darkMode ? "bg-orange-900/20" : "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: darkMode ? "border-orange-700" : "border-orange-200",
      emoji: "📅",
      description: "Cours à venir"
    }
  ];

  const quickActions = [
    { 
      icon: "📚", 
      title: "Voir mes cours", 
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      bgColor: darkMode ? "bg-blue-900/20" : "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: darkMode ? "border-blue-700" : "border-blue-200",
      description: "Accéder à tous mes cours",
      action: () => window.location.href = "/student/cours"
    },
    { 
      icon: "📅", 
      title: "Mon planning", 
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      bgColor: darkMode ? "bg-green-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: darkMode ? "border-green-700" : "border-green-200",
      description: "Voir mon emploi du temps",
      action: () => window.location.href = "/student/planning"
    },
    { 
      icon: "🤖", 
      title: "Assistant IA", 
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      bgColor: darkMode ? "bg-purple-900/20" : "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: darkMode ? "border-purple-700" : "border-purple-200",
      description: "Obtenir de l'aide intelligente",
      action: () => window.location.href = "/student/assistant"
    },
    { 
      icon: "🎯", 
      title: "Mes objectifs", 
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      bgColor: darkMode ? "bg-orange-900/20" : "bg-gradient-to-br from-orange-50 to-red-50",
      borderColor: darkMode ? "border-orange-700" : "border-orange-200",
      description: "Suivre mes progrès",
      action: () => window.location.href = "/student/notes"
    }
  ];

  const achievements = [
    { icon: "🏆", title: "Premier cours", description: "Tu as assisté à ton premier cours !", unlocked: true },
    { icon: "📚", title: "Étudiant assidu", description: "5 cours suivis consécutivement", unlocked: true },
    { icon: "⭐", title: "Excellent élève", description: "Note moyenne de 15/20", unlocked: false },
    { icon: "🎯", title: "Objectif atteint", description: "100% des objectifs réalisés", unlocked: false },
    { icon: "🤖", title: "Assistant IA", description: "Utilisé l'assistant IA 10 fois", unlocked: true },
    { icon: "📅", title: "Organisé", description: "Planning respecté pendant 1 mois", unlocked: false }
  ];

  const recentActivities = [
    { type: "course", title: "Mathématiques", time: "Il y a 2h", icon: "📐", color: "blue" },
    { type: "quiz", title: "Quiz Sciences", time: "Il y a 4h", icon: "🧪", color: "green" },
    { type: "homework", title: "Devoir Français", time: "Hier", icon: "📝", color: "purple" },
    { type: "achievement", title: "Nouveau badge", time: "Il y a 1 jour", icon: "🏆", color: "yellow" }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-yellow-50'
    }`}>
      {/* Animated background elements - Design enfantin et professionnel */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Formes géométriques animées pour les enfants */}
        <motion.div
          className={`absolute top-20 right-20 w-32 h-32 rounded-full ${
            darkMode ? 'bg-blue-500/20' : 'bg-blue-400/30'
          }`}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-40 h-40 rounded-full ${
            darkMode ? 'bg-green-500/20' : 'bg-green-400/30'
          }`}
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/3 w-24 h-24 rounded-full ${
            darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'
          }`}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Étoiles flottantes pour les enfants */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 ${
              i % 4 === 0 ? 'text-yellow-400' : 
              i % 4 === 1 ? 'text-pink-400' : 
              i % 4 === 2 ? 'text-blue-400' : 'text-green-400'
            }`}
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${5 + (i * 8)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.5, 1],
              rotate: [0, 360, 720],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <Star size={16} />
          </motion.div>
        ))}

        {/* Cœurs flottants */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className={`absolute w-4 h-4 ${
              i % 3 === 0 ? 'text-red-400' : 
              i % 3 === 1 ? 'text-pink-400' : 'text-rose-400'
            }`}
            style={{
              left: `${70 + (i * 4)}%`,
              top: `${20 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            <Heart size={20} />
          </motion.div>
        ))}

        {/* Bulles colorées */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-blue-400/40' : 
              i % 3 === 1 ? 'bg-purple-400/40' : 'bg-green-400/40'
            }`}
            style={{
              width: `${20 + (i * 5)}px`,
              height: `${20 + (i * 5)}px`,
              left: `${15 + (i * 15)}%`,
              top: `${60 + (i * 6)}%`,
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header avec design enfantin */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <motion.h1 
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                animate={{ scale: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🎓 Mon Monde d'Apprentissage
              </motion.h1>
              <motion.p 
                className={`text-lg sm:text-xl ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Salut {userInfo.name || "Élève"} ! 🌟 Prêt(e) pour une aventure incroyable ?
              </motion.p>
            </div>
            
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                darkMode 
                  ? 'bg-purple-600 border-purple-500 text-white hover:bg-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white hover:from-blue-600 hover:to-purple-600'
              }`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </motion.div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-red-900/20 border-red-700 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                Chargement de ton univers...
              </span>
            </div>
          </motion.div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Welcome Section avec design enfantin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-3xl border-2 shadow-2xl ${
                darkMode 
                  ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/50' 
                  : 'bg-gradient-to-br from-white/80 to-blue-50/80 border-blue-200/50'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center gap-6 mb-6">
                <motion.div
                  className={`p-6 rounded-2xl ${
                    darkMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  } text-white`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GraduationCap className="w-12 h-12" />
                </motion.div>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Bonjour {userInfo.name || "Élève"} ! 👋✨
                  </h2>
                  <p className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Prêt(e) pour une journée magique d'apprentissage ?
                  </p>
                </div>
              </div>
              
              {/* Barre de progression amusante */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Progression de la journée 🌟
                  </span>
                  <span className={`text-sm font-bold ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    75%
                  </span>
                </div>
                <motion.div 
                  className={`w-full h-4 rounded-full overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Cards avec design enfantin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📊 Mes Super Statistiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`p-6 rounded-2xl border-2 ${card.bgColor} ${card.borderColor} transition-all duration-300 hover:shadow-2xl backdrop-blur-sm`}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl sm:text-4xl">{card.icon}</span>
                      <motion.div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          card.change.startsWith('+') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {card.change}
                      </motion.div>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-3xl sm:text-4xl font-bold ${card.color} text-white mb-2`}>
                      {card.value}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {card.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions avec design enfantin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ⚡ Mes Actions Magiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`p-6 rounded-2xl border-2 ${action.bgColor} ${action.borderColor} transition-all duration-300 hover:shadow-2xl text-left backdrop-blur-sm`}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{action.icon}</span>
                      <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Achievements Section avec design enfantin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🏆 Mes Réalisations Épiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      achievement.unlocked
                        ? darkMode 
                          ? 'bg-green-900/30 border-green-500/50' 
                          : 'bg-green-50 border-green-200'
                        : darkMode 
                          ? 'bg-gray-800/50 border-gray-700/50 opacity-50' 
                          : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <h3 className={`text-lg font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {achievement.title}
                      </h3>
                    </div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {achievement.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activities avec design enfantin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📝 Mes Aventures Récentes
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border-2 ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-700/50' 
                        : 'bg-white/80 border-gray-200/50'
                    } shadow-lg backdrop-blur-sm`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{activity.icon}</span>
                        <div>
                          <p className={`text-lg font-bold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {activity.title}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full bg-${activity.color}-500`}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStudent;
