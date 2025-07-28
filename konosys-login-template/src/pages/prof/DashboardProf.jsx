import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import {
  BookOpenCheck,
  UserCheck,
  Clock4,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Activity,
  Sparkles,
  Zap,
  Star,
  Trophy,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Eye,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useDashboard } from "../../context/DashboardContext";

const DashboardProf = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { refreshTrigger } = useDashboard();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const profEmail = userInfo?.email || localStorage.getItem("userEmail");

  // Fonction pour récupérer les vraies données
  const fetchRealData = useCallback(async () => {
    if (!profEmail) {
      console.warn("⚠️ Aucun email trouvé dans localStorage.");
      setError("Email manquant. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      console.log("📩 Récupération des vraies données pour:", profEmail);

      const res = await axios.get("/api/prof/dashboard", {
        params: { email: profEmail },
      });
      
      console.log("📊 Vraies données reçues:", res.data);
      
      // Vérifier que les données sont valides
      if (res.data && typeof res.data === 'object') {
        setStats(res.data);
        setError(null);
      } else {
        throw new Error("Données invalides reçues du serveur");
      }
    } catch (err) {
      console.error("❌ Erreur récupération données:", err);
      setError("Impossible de charger les vraies données. Vérifiez votre connexion.");
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profEmail]);

  // Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRealData();
  };

  // Rafraîchissement automatique toutes les 30 secondes ET quand refreshTrigger change
  useEffect(() => {
    fetchRealData();

    // Rafraîchissement automatique
    const interval = setInterval(() => {
      console.log("🔄 Rafraîchissement automatique des données...");
      fetchRealData();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [fetchRealData, refreshTrigger]); // Ajout de refreshTrigger comme dépendance

  // Écouter les changements dans localStorage pour détecter les modifications
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("�� Changement détecté dans localStorage, rafraîchissement...");
      fetchRealData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchRealData]);

  const statCards = [
    {
      icon: <BookOpenCheck size={24} className="sm:w-8 sm:h-8" />,
      title: "Cours Enseignés",
      value: stats?.totalCours ?? "0",
      change: "+12%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      trend: "up"
    },
    {
      icon: <UserCheck size={24} className="sm:w-8 sm:h-8" />,
      title: "Étudiants",
      value: stats?.totalEtudiants ?? "0",
      change: "+5%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      iconBg: "bg-green-500",
      trend: "up"
    },
    {
      icon: <Target size={24} className="sm:w-8 sm:h-8" />,
      title: "Objectifs Atteints",
      value: `${stats?.objectifsAtteints ?? 75}%`,
      change: "+8%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      trend: "up"
    },
    {
      icon: <Clock4 size={24} className="sm:w-8 sm:h-8" />,
      title: "Prochain Cours",
      value: stats?.prochainCours ? "Aujourd'hui" : "Aucun",
      change: stats?.prochainCours ? "Dans 2h" : "",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      trend: "neutral"
    }
  ];

  const quickActions = [
    { icon: <BookOpen size={20} className="sm:w-6 sm:h-6" />, title: "Mes cours", color: "from-blue-500 to-blue-600" },
    { icon: <Calendar size={20} className="sm:w-6 sm:h-6" />, title: "Planning", color: "from-green-500 to-green-600" },
    { icon: <FileText size={20} className="sm:w-6 sm:h-6" />, title: "Documents", color: "from-purple-500 to-purple-600" },
    { icon: <Target size={20} className="sm:w-6 sm:h-6" />, title: "Notes", color: "from-orange-500 to-orange-600" }
  ];

  const additionalStats = [
    {
      icon: <FileText size={20} className="sm:w-6 sm:h-6" />,
      title: "Documents",
      value: stats?.statsSupplementaires?.totalDocuments ?? 24,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: <CheckCircle size={20} className="sm:w-6 sm:h-6" />,
      title: "Devoirs corrigés",
      value: stats?.statsSupplementaires?.devoirsCorriges ?? 8,
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Calendar size={20} className="sm:w-6 sm:h-6" />,
      title: "Séances aujourd'hui",
      value: stats?.statsSupplementaires?.seancesAujourdhui ?? 3,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-24 h-24 sm:w-40 sm:h-40 lg:w-64 lg:h-64 bg-cyan-500/3 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-16 right-16 sm:top-32 sm:right-32 text-blue-400/20"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles size={24} className="sm:w-10 sm:h-10" />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-16 sm:bottom-32 sm:left-32 text-purple-400/20"
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Star size={20} className="sm:w-8 sm:h-8" />
      </motion.div>

      <div className="relative z-10 py-4 sm:py-8 md:py-12 lg:py-20 px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Enhanced Header with Refresh Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GraduationCap className="text-white w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent ${darkMode ? '' : 'drop-shadow-lg'}`}>
                  👨‍🏫 Bienvenue Professeur
                </h1>
                <p className={`text-sm sm:text-base md:text-lg lg:text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>
                  Voici votre espace d'enseignement personnalisé
                </p>
              </div>
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl font-semibold transition-all duration-300 ${
                refreshing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105'
              }`}
              whileHover={!refreshing ? { scale: 1.05 } : {}}
              whileTap={!refreshing ? { scale: 0.95 } : {}}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              </motion.div>
              {refreshing ? "Actualisation..." : "Actualiser les données"}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-red-50 border border-red-200 text-red-700 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl mb-4 sm:mb-6 flex items-center justify-center gap-3 max-w-md mx-auto text-sm sm:text-base"
                >
                  <AlertCircle size={16} className="sm:w-5 sm:h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm ${
                  darkMode ? 'bg-gray-800/80' : 'bg-white/80'
                }`}
              >
                {/* Animated background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${card.bgColor} opacity-50`}
                  animate={{
                    background: [
                      `linear-gradient(45deg, ${card.bgColor.split(' ')[0]} 0%, ${card.bgColor.split(' ')[1]} 100%)`,
                      `linear-gradient(45deg, ${card.bgColor.split(' ')[1]} 0%, ${card.bgColor.split(' ')[0]} 100%)`,
                      `linear-gradient(45deg, ${card.bgColor.split(' ')[0]} 0%, ${card.bgColor.split(' ')[1]} 100%)`,
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <motion.div
                      className={`p-2 sm:p-3 rounded-xl ${card.iconBg} text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {card.icon}
                    </motion.div>
                    <motion.div
                      className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                        card.trend === 'up' ? 'text-green-600' : 
                        card.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                      }`}
                      animate={card.trend === 'up' ? { y: [0, -2, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {card.trend === 'up' && <ArrowUpRight size={12} className="sm:w-4 sm:h-4" />}
                      {card.change}
                    </motion.div>
                  </div>
                  
                  <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {card.value}
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {card.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {additionalStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm ${
                  darkMode ? 'bg-gray-800/80' : 'bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div>
                    <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {stat.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Actions Rapides
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 ${
                    darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-white/90'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <motion.div
                      className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {action.icon}
                    </motion.div>
                    <span className={`font-semibold text-center text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {action.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Info Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
          >
            {/* Progress Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl sm:rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}
            >
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className="p-2 bg-white/20 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BarChart3 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Progression Générale</h3>
                    <p className="text-cyan-100 text-xs sm:text-sm">Votre avancement dans l'enseignement</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stats?.avgPerformance ?? 75}%
                  </span>
                  <motion.div
                    className="flex items-center gap-1 text-green-600"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrendingUp size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-semibold">+5%</span>
                  </motion.div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 sm:h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.avgPerformance ?? 75}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Taux de progression moyen dans vos cours
                </p>
              </div>
            </motion.div>

            {/* Next Sessions Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl sm:rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className="p-2 bg-white/20 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CalendarDays className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Prochaines Sessions</h3>
                    <p className="text-orange-100 text-xs sm:text-sm">Vos cours à venir</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {stats?.prochainesSessions?.length ? (
                  <div className="space-y-2 sm:space-y-3">
                    {stats.prochainesSessions.slice(0, 3).map((session, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl"
                      >
                        <div className="p-1 sm:p-2 bg-orange-500 rounded-lg">
                          <Clock className="text-white w-4 h-4 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {session.heureDebut} — {session.matiere || "Matière non définie"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.salle} • {session.groupe}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block mb-3 sm:mb-4"
                    >
                      <Calendar className="text-gray-400 w-12 h-12 sm:w-16 sm:h-16" />
                    </motion.div>
                    <p className={`text-gray-500 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aucune session prévue pour le moment
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardProf;
