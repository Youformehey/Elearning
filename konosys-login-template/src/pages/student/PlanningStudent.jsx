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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"
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

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center mb-12"
          >
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
              >
                <CalendarDays className="text-white" size={40} />
              </motion.div>
              <div>
                <motion.h1 
                  className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  🎭 Mon Planning
                </motion.h1>
                <motion.p 
                  className={`text-xl font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Consulte le planning de ta classe ✨
                </motion.p>
                {userInfo?.classe && (
                  <motion.p 
                    className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-2`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎓 Classe : {userInfo.classe}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                refreshing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl'
              }`}
              whileHover={!refreshing ? { scale: 1.05, y: -2 } : {}}
              whileTap={!refreshing ? { scale: 0.95 } : {}}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={24} />
              </motion.div>
              {refreshing ? "Actualisation..." : "🔄 Actualiser le planning"}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 max-w-md mx-auto"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {planningStats.totalSeances}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total des séances
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {planningStats.completedSeances}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Séances terminées
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {planningStats.upcomingSeances}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Prochaines séances
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {planningStats.todaySeances}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Séances aujourd'hui
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {planningStats.overdueSeances}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Séances en retard
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </motion.div>
          ) : seances.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block mb-6 p-4 bg-blue-100 rounded-full">
                <CalendarDays className="text-blue-600" size={48} />
              </div>
              <p className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucune séance planifiée pour le moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Séances en retard */}
              {overdueSeances.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-12"
                >
                  <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ⚠️ Séances en Retard
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {overdueSeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
                          darkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(seance.date)}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-red-800'
                        }`}>
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className={`mb-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <span className={darkMode ? 'text-red-300' : 'text-red-600'}>
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
                  transition={{ delay: 0.8 }}
                  className="mb-12"
                >
                  <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    🎯 Séances d'Aujourd'hui
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {todaySeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
                          darkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(seance.date)}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-blue-800'
                        }`}>
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className={`mb-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <span className={darkMode ? 'text-blue-300' : 'text-blue-600'}>
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
                  transition={{ delay: 0.9 }}
                  className="mb-12"
                >
                  <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ⏰ Prochaines Séances
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {upcomingSeances.map((seance, i) => (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
                          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(seance.date)}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className={`mb-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <Clock className="w-5 h-5 text-orange-500" />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
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
                transition={{ delay: 1.0 }}
              >
                <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📚 Toutes les Séances
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {seances.map((seance, i) => {
                    const StatusIcon = getStatusIcon(seance);
                    
                    return (
                      <motion.div
                        key={seance._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
                          seance.fait 
                            ? darkMode 
                              ? 'bg-green-900/20 border-green-500/30' 
                              : 'bg-green-50 border-green-200'
                            : darkMode 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(seance.date)}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatTime(seance.heureDebut)} - {formatTime(seance.heureFin)}
                          </div>
                        </div>

                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          <School className="w-5 h-5" />
                          {seance.matiere || "Matière inconnue"}
                        </h3>

                        <div className={`mb-4 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
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
        </div>
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
    </div>
  );
}
