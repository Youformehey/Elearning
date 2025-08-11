import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  CalendarDays,
  School,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  RefreshCw,
  Star,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
  Building,
  Users,
  BookOpen,
  BarChart3,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

export default function PlanningStudent() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!token) return;
    fetchPlanning();
  }, [token]);

  const fetchPlanning = async () => {
    try {
      setError(null);
      const { data } = await axios.get(`${API_URL}/api/seances/etudiant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Séances de la classe récupérées:", data);
      setSeances(data);
      
      // Show confetti if no seances
      if (data.length === 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Erreur chargement planning :", error);
      setError("Impossible de charger le planning. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPlanning();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    return timeStr.substring(0, 5);
  };

  const getSeancesForDate = (date) => {
    return seances.filter(seance => {
      const seanceDate = new Date(seance.date);
      return seanceDate.toDateString() === date.toDateString();
    });
  };

  const getUpcomingSeances = () => {
    const now = new Date();
    return seances.filter(seance => new Date(seance.date) > now).slice(0, 3);
  };

  const getCompletedSeances = () => {
    return seances.filter(seance => seance.fait);
  };

  const getTodaySeances = () => {
    const today = new Date();
    return seances.filter(seance => {
      const seanceDate = new Date(seance.date);
      return seanceDate.toDateString() === today.toDateString();
    });
  };

  const getOverdueSeances = () => {
    const now = new Date();
    return seances.filter(seance => {
      const seanceDate = new Date(seance.date);
      return seanceDate < now && !seance.fait;
    });
  };

  const upcomingSeances = getUpcomingSeances();
  const completedSeances = getCompletedSeances();
  const todaySeances = getTodaySeances();
  const overdueSeances = getOverdueSeances();

  const planningStats = {
    totalSeances: seances.length,
    completedSeances: completedSeances.length,
    upcomingSeances: upcomingSeances.length,
    todaySeances: todaySeances.length,
    overdueSeances: overdueSeances.length
  };

  const getStatusColor = (seance) => {
    if (seance.fait) return "bg-green-100 text-green-800 border-green-200";
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return "bg-red-100 text-red-800 border-red-200";
    if (seanceDate.toDateString() === now.toDateString()) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (seance) => {
    if (seance.fait) return CheckCircle;
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return XCircle;
    if (seanceDate.toDateString() === now.toDateString()) return Clock;
    return Calendar;
  };

  const getStatusText = (seance) => {
    if (seance.fait) return "Terminée";
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return "En retard";
    if (seanceDate.toDateString() === now.toDateString()) return "Aujourd'hui";
    return "Programmée";
  };

  // Confetti animation
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: Math.random() * 100 + '%',
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 7)]
          }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ 
            y: window.innerHeight + 10, 
            opacity: [0, 1, 0],
            x: Math.random() * 100 - 50
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-700 font-medium"
          >
            Chargement de votre planning...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "tween", duration: 0.6, ease: "easeInOut" }}
          >
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPlanning}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5 inline mr-2" />
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Animations ultra attractives */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-10 h-10 bg-pink-100 rounded-full"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
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
        <CalendarDays size={32} />
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
        <Clock size={28} />
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
        <School size={24} />
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
                  type: "tween", 
                  duration: 4,
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
                    type: "tween",
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  📅
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
                  📅 Mon Planning Magique ✨
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
                  🌟 Consulte le planning de ta classe !
                  {userInfo?.classe && (
                    <motion.span
                      className="block mt-2 font-semibold text-blue-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      🎓 Classe : {userInfo.classe}
                    </motion.span>
                  )}
                </motion.p>
              </div>
            </motion.div>

            {/* Refresh Button - Animations ultra attractives */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl mx-auto ${
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
                <RefreshCw size={20} />
              </motion.div>
              {refreshing ? "Actualisation..." : "🔄 Actualiser le planning"}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-red-50 border-2 border-red-200 text-red-700 py-5 px-8 rounded-2xl mt-6 flex items-center justify-center gap-4 max-w-md mx-auto text-lg shadow-xl"
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
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12"
          >
            {[
              { 
                label: "Total des séances", 
                count: planningStats.totalSeances, 
                color: "blue", 
                icon: "📚",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600"
              },
              { 
                label: "Séances terminées", 
                count: planningStats.completedSeances, 
                color: "green", 
                icon: "✅",
                bgColor: "bg-green-100",
                textColor: "text-green-600"
              },
              { 
                label: "Prochaines séances", 
                count: planningStats.upcomingSeances, 
                color: "orange", 
                icon: "⏰",
                bgColor: "bg-orange-100",
                textColor: "text-orange-600"
              },
              { 
                label: "Séances aujourd'hui", 
                count: planningStats.todaySeances, 
                color: "purple", 
                icon: "🎯",
                bgColor: "bg-purple-100",
                textColor: "text-purple-600"
              },
              { 
                label: "Séances en retard", 
                count: planningStats.overdueSeances, 
                color: "red", 
                icon: "⚠️",
                bgColor: "bg-red-100",
                textColor: "text-red-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  rotateY: [0, 5, 0],
                  rotateX: [0, 3, 0],
                }}
                className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <motion.p 
                      className={`text-3xl font-bold ${stat.textColor}`}
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
                      {stat.count}
                    </motion.p>
                  </div>
                  <motion.div 
                    className={`p-4 ${stat.bgColor} rounded-2xl`}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 8, 0, -8, 0],
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
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
                </div>
              </motion.div>
            ))}
          </motion.div>

          {seances.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-20 h-20 mx-auto mb-6 p-4 rounded-full bg-blue-100"
              >
                <CalendarDays className="text-blue-600" size={48} />
              </motion.div>
              <p className="text-xl font-medium text-gray-600">
                Aucune séance planifiée pour le moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-8"
            >
              {/* Séances en retard */}
              {overdueSeances.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="mb-12"
                >
                  <motion.h2 
                    className="text-3xl font-bold mb-8 text-center text-red-600"
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
                    ⚠️ Séances en Retard
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {overdueSeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -8,
                          rotateY: [0, 5, 0],
                          rotateX: [0, 3, 0],
                        }}
                        className="p-6 rounded-3xl shadow-2xl border-2 border-red-200 bg-red-50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-gray-600">
                            {formatDate(seance.date)}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className="mb-4 space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.name || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.email || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">Classe : {seance.classe || "Non définie"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-red-600">
                            En retard
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Séances d'aujourd'hui */}
              {todaySeances.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mb-12"
                >
                  <motion.h2 
                    className="text-3xl font-bold mb-8 text-center text-blue-600"
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
                    🎯 Séances d'Aujourd'hui
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {todaySeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -8,
                          rotateY: [0, 5, 0],
                          rotateX: [0, 3, 0],
                        }}
                        className="p-6 rounded-3xl shadow-2xl border-2 border-blue-200 bg-blue-50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-gray-600">
                            {formatDate(seance.date)}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className="mb-4 space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.name || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.email || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">Classe : {seance.classe || "Non définie"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="text-blue-600">
                            Aujourd'hui
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Prochaines séances */}
              {upcomingSeances.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="mb-12"
                >
                  <motion.h2 
                    className="text-3xl font-bold mb-8 text-center text-green-600"
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
                    ⏰ Prochaines Séances
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {upcomingSeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -8,
                          rotateY: [0, 5, 0],
                          rotateX: [0, 3, 0],
                        }}
                        className="p-6 rounded-3xl shadow-2xl border-2 border-green-200 bg-green-50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-gray-600">
                            {formatDate(seance.date)}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className="mb-4 space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.name || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.email || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">Classe : {seance.classe || "Non définie"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-5 h-5 text-green-500" />
                          <span className="text-green-600">
                            À venir
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Toutes les séances */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-8 text-center text-purple-600"
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
                  📚 Toutes les Séances
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {seances.map((seance, i) => {
                    const StatusIcon = getStatusIcon(seance);
                    
                    return (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -8,
                          rotateY: [0, 5, 0],
                          rotateX: [0, 3, 0],
                        }}
                        className={`p-6 rounded-3xl shadow-2xl border-2 transition-all duration-300 ${
                          seance.fait 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-medium text-gray-600">
                            {formatDate(seance.date)}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className="mb-4 space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.name || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{seance.professeur?.email || "Inconnu"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-medium">Classe : {seance.classe || "Non définie"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                          {seance.fait ? (
                            <CheckCircle className="w-5 h-5 text-green-600" title="Séance faite" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" title="Séance non faite" />
                          )}
                          <span className="text-gray-600">
                            {seance.fait ? "Séance terminée" : "Séance à faire"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
    </div>
  );
}
