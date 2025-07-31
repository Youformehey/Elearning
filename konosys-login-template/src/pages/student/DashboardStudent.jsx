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
  RefreshCw,
  Brain,
  Lightbulb,
  Target as TargetIcon,
  Plus,
  Minus,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Heart,
  Smile,
  Book,
  Calculator,
  Palette,
  Music,
  Globe,
  Gamepad2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardStudent = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const studentEmail = localStorage.getItem("userEmail");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Fonction pour récupérer les vraies données
  const fetchRealData = useCallback(async () => {
    if (!studentEmail) {
      console.warn("⚠️ Aucun email trouvé dans localStorage.");
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
      if (err.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        }, 2000);
      } else {
        setError("Impossible de charger les données. Vérifiez votre connexion.");
      }
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentEmail, token]);

  // Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRealData();
  };

  // Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    fetchRealData();

    const interval = setInterval(() => {
      console.log("🔄 Rafraîchissement automatique des données...");
      fetchRealData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchRealData]);

  const statCards = [
    {
      icon: "📚",
      title: "Mes Cours",
      value: stats?.totalCours ?? "0",
      change: "+12%",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      emoji: "📖"
    },
    {
      icon: "👥",
      title: "Mes Amis",
      value: stats?.totalEtudiants ?? "0",
      change: "+5%",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      emoji: "🤝"
    },
    {
      icon: "🎯",
      title: "Mes Objectifs",
      value: `${stats?.objectifsAtteints ?? 75}%`,
      change: "+8%",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      emoji: "⭐"
    },
    {
      icon: "⏰",
      title: "Prochain Cours",
      value: stats?.prochainCours ? "Aujourd'hui" : "Aucun",
      change: stats?.prochainCours ? "Dans 2h" : "",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      emoji: "📅"
    }
  ];

  const quickActions = [
    { 
      icon: "📚", 
      title: "Voir mes cours", 
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Accéder à tous mes cours"
    },
    { 
      icon: "📅", 
      title: "Mon planning", 
      color: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Voir mon emploi du temps"
    },
    { 
      icon: "🤖", 
      title: "Assistant IA", 
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Obtenir de l'aide intelligente"
    },
    { 
      icon: "🎯", 
      title: "Mes objectifs", 
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Suivre mes progrès"
    }
  ];

  const additionalStats = [
    {
      icon: "📄",
      title: "Documents",
      value: stats?.statsSupplementaires?.totalDocuments ?? 24,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    {
      icon: "✅",
      title: "Devoirs rendus",
      value: stats?.statsSupplementaires?.devoirsRendus ?? 8,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: "📅",
      title: "Séances aujourd'hui",
      value: stats?.statsSupplementaires?.seancesAujourdhui ?? 3,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Animations améliorées */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-green-100 rounded-full"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-pink-100 rounded-full"
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating decorative elements - Animations ultra attractives */}
      <motion.div
        className="absolute top-16 right-16 text-blue-400"
        animate={{ 
          rotate: 360,
          scale: [1, 1.3, 1],
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-16 text-green-400"
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1],
          y: [0, 10, 0],
          x: [0, -5, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Star size={28} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 text-purple-400"
        animate={{ 
          rotate: 360,
          scale: [1, 1.4, 1],
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Trophy size={24} />
      </motion.div>

      <div className="relative z-10 py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header avec animations ultra attractives */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.2, rotate: 15 }}
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    "0 25px 50px -12px rgba(147, 51, 234, 0.25)",
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                  ],
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.span 
                  className="text-6xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🎓
                </motion.span>
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: [1, 1.02, 1],
                    y: [0, -3, 0],
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🎒 Bienvenue Élève !
                </motion.h1>
                <motion.p 
                  className="text-xl sm:text-2xl font-medium text-gray-700"
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  Voici ton espace d'apprentissage personnalisé ✨
                </motion.p>
              </div>
            </motion.div>

            {/* Refresh Button - Animation ultra attractive */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold transition-all duration-300 text-lg shadow-xl ${
                refreshing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl'
              }`}
              whileHover={!refreshing ? { 
                scale: 1.1, 
                y: -5,
                rotate: [0, 2, -2, 0],
              } : {}}
              whileTap={!refreshing ? { scale: 0.95 } : {}}
              animate={!refreshing ? { 
                boxShadow: [
                  "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                  "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                  "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                ],
                scale: [1, 1.02, 1],
              } : {}}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : { 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: refreshing ? 1 : 2, 
                  repeat: Infinity, 
                  ease: refreshing ? "linear" : "easeInOut" 
                }}
              >
                <RefreshCw size={24} />
              </motion.div>
              {refreshing ? "Actualisation..." : "🔄 Actualiser les données"}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-red-50 border-2 border-red-200 text-red-700 py-5 px-8 rounded-2xl mb-8 flex items-center justify-center gap-4 max-w-md mx-auto text-lg shadow-xl"
                >
                  <AlertCircle size={24} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats Cards - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -10,
                  rotateY: [0, 5, 0],
                  rotateX: [0, 3, 0],
                }}
                className={`relative overflow-hidden rounded-3xl shadow-2xl border-2 ${card.borderColor} ${card.bgColor} group`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={`p-4 rounded-2xl ${card.color} text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      animate={{ 
                        boxShadow: [
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        ],
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <motion.span 
                        className="text-4xl"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{ 
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        {card.icon}
                      </motion.span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 text-sm font-bold text-green-600"
                      animate={{ 
                        y: [0, -3, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <ArrowUpRight size={20} />
                      {card.change}
                    </motion.div>
                  </div>
                  
                  <motion.h3 
                    className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800"
                    animate={{ 
                      scale: [1, 1.02, 1],
                      y: [0, -2, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {card.value}
                  </motion.h3>
                  <p className="text-lg text-gray-600">
                    {card.title}
                  </p>
                  <motion.div
                    className="mt-4 text-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, 0, -15, 0],
                      y: [0, -5, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {card.emoji}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Stats Row - Animations améliorées */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {additionalStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  rotateY: [0, 3, 0],
                }}
                className={`p-8 rounded-3xl shadow-2xl border-2 ${stat.borderColor} ${stat.bgColor}`}
              >
                <div className="flex items-center gap-6">
                  <motion.div
                    className={`p-4 rounded-2xl ${stat.color} text-white shadow-xl`}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ 
                      boxShadow: [
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      ],
                      scale: [1, 1.05, 1],
                      rotate: [0, 8, 0, -8, 0],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.span 
                      className="text-3xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 12, 0, -12, 0],
                      }}
                      transition={{ 
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {stat.icon}
                    </motion.span>
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-3xl sm:text-4xl font-bold text-gray-800"
                      animate={{ 
                        scale: [1, 1.02, 1],
                        y: [0, -2, 0],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-lg text-gray-600">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Section - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-12"
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800"
              animate={{ 
                scale: [1, 1.02, 1],
                y: [0, -3, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              🚀 Actions Rapides
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -8,
                    rotateY: [0, 5, 0],
                    rotateX: [0, 3, 0],
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-8 rounded-3xl shadow-2xl border-2 ${action.borderColor} ${action.bgColor} transition-all duration-300 group`}
                >
                  <div className="flex flex-col items-center gap-6">
                    <motion.div
                      className={`p-5 rounded-2xl ${action.color} text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      whileHover={{ scale: 1.3, rotate: 20 }}
                      animate={{ 
                        boxShadow: [
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                        ],
                        scale: [1, 1.05, 1],
                        rotate: [0, 8, 0, -8, 0],
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <motion.span 
                        className="text-4xl"
                        animate={{ 
                          scale: [1, 1.15, 1],
                          rotate: [0, 15, 0, -15, 0],
                        }}
                        transition={{ 
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        {action.icon}
                      </motion.span>
                    </motion.div>
                    <div className="text-center">
                      <span className="font-bold text-lg block text-gray-800">
                        {action.title}
                      </span>
                      <span className="text-sm opacity-75 text-gray-600">
                        {action.description}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Progress Section - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Progress Section */}
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              className="rounded-3xl shadow-2xl border-2 border-blue-200 bg-blue-50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
                <div className="flex items-center gap-6">
                  <motion.div
                    className="p-4 bg-white/20 rounded-2xl"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ 
                      boxShadow: [
                        "0 10px 25px -5px rgba(255, 255, 255, 0.1)",
                        "0 20px 40px -10px rgba(255, 255, 255, 0.2)",
                        "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                      ],
                      scale: [1, 1.05, 1],
                      rotate: [0, 8, 0, -8, 0],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.span 
                      className="text-4xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 12, 0, -12, 0],
                      }}
                      transition={{ 
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      📊
                    </motion.span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">📊 Progression Générale</h3>
                    <p className="text-white/90 text-lg">Ton avancement dans les cours</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <motion.span 
                    className="text-4xl sm:text-5xl font-bold text-gray-800"
                    animate={{ 
                      scale: [1, 1.02, 1],
                      y: [0, -3, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {stats?.avgPerformance ?? 75}%
                  </motion.span>
                  <motion.div
                    className="flex items-center gap-2 text-green-600"
                    animate={{ 
                      y: [0, -3, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <TrendingUp size={24} />
                    <span className="text-lg font-bold">+5%</span>
                  </motion.div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.avgPerformance ?? 75}%` }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </div>
                <p className="text-lg text-gray-600">
                  Taux de progression moyen dans tes cours
                </p>
              </div>
            </motion.div>

            {/* Next Sessions Section */}
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              className="rounded-3xl shadow-2xl border-2 border-orange-200 bg-orange-50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                <div className="flex items-center gap-6">
                  <motion.div
                    className="p-4 bg-white/20 rounded-2xl"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ 
                      boxShadow: [
                        "0 10px 25px -5px rgba(255, 255, 255, 0.1)",
                        "0 20px 40px -10px rgba(255, 255, 255, 0.2)",
                        "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                      ],
                      scale: [1, 1.05, 1],
                      rotate: [0, 8, 0, -8, 0],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.span 
                      className="text-4xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 12, 0, -12, 0],
                      }}
                      transition={{ 
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      ⏰
                    </motion.span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">⏰ Prochaines Sessions</h3>
                    <p className="text-white/90 text-lg">Tes cours à venir</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200"
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      ],
                      y: [0, -2, 0],
                    }}
                    transition={{ 
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-3 h-3 bg-green-500 rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">Mathématiques</p>
                        <p className="text-gray-600">Aujourd'hui à 14h00</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <span className="text-2xl">⏰</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200"
                    whileHover={{ scale: 1.02 }}
                    animate={{ 
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      ],
                      y: [0, -2, 0],
                    }}
                    transition={{ 
                      boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">Sciences</p>
                        <p className="text-gray-600">Demain à 10h30</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <span className="text-2xl">📅</span>
                    </motion.div>
                  </motion.div>
                </div>
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
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStudent;
