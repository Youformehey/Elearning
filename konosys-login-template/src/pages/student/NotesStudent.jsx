import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import {
  BookOpen,
  Star,
  TrendingUp,
  RefreshCw,
  Filter,
  AlertTriangle,
  CheckCircle,
  Award,
  BarChart2,
  Calendar,
  Info,
  Sparkles,
  Target,
  Zap,
  Trophy,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotesStudent = () => {
  const { darkMode } = useContext(ThemeContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    bySubject: {},
    bestSubject: null,
    worstSubject: null,
    recentTrend: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showStats, setShowStats] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Traitement des données
      const notesData = response.data;
      setNotes(notesData);

      // Calcul des statistiques
      const statistics = {
        total: notesData.length,
        average: 0,
        bySubject: {},
        bestSubject: null,
        worstSubject: null,
        recentTrend: 0
      };

      // Calcul des moyennes par matière
      notesData.forEach(note => {
        const subject = note.cours?.nom || 'Non spécifiée';
        if (!statistics.bySubject[subject]) {
          statistics.bySubject[subject] = {
            notes: [],
            total: 0,
            average: 0,
            highest: 0,
            lowest: 20,
            trend: 0
          };
        }
        statistics.bySubject[subject].notes.push(note.note);
        statistics.bySubject[subject].total++;
        statistics.bySubject[subject].highest = Math.max(statistics.bySubject[subject].highest, note.note);
        statistics.bySubject[subject].lowest = Math.min(statistics.bySubject[subject].lowest, note.note);
      });

      // Calcul des moyennes et tendances
      let totalAverage = 0;
      let bestAverage = 0;
      let worstAverage = 20;
      
      Object.entries(statistics.bySubject).forEach(([subject, data]) => {
        const sum = data.notes.reduce((acc, note) => acc + note, 0);
        data.average = data.notes.length > 0 ? (sum / data.notes.length).toFixed(2) : 0;
        
        // Calcul de la tendance (différence entre les 3 dernières notes et les 3 précédentes)
        const recentNotes = data.notes.slice(-3);
        const previousNotes = data.notes.slice(-6, -3);
        const recentAvg = recentNotes.length > 0 ? recentNotes.reduce((a, b) => a + b, 0) / recentNotes.length : 0;
        const previousAvg = previousNotes.length > 0 ? previousNotes.reduce((a, b) => a + b, 0) / previousNotes.length : 0;
        data.trend = recentAvg - previousAvg;

        totalAverage += parseFloat(data.average);
        
        if (data.average > bestAverage) {
          bestAverage = data.average;
          statistics.bestSubject = subject;
        }
        if (data.average < worstAverage && data.notes.length > 0) {
          worstAverage = data.average;
          statistics.worstSubject = subject;
        }
      });

      statistics.average = (totalAverage / Object.keys(statistics.bySubject).length).toFixed(2);

      // Calcul de la tendance globale
      const recentNotes = notesData.slice(-5).map(n => n.note);
      const previousNotes = notesData.slice(-10, -5).map(n => n.note);
      const recentAvg = recentNotes.length > 0 ? recentNotes.reduce((a, b) => a + b, 0) / recentNotes.length : 0;
      const previousAvg = previousNotes.length > 0 ? previousNotes.reduce((a, b) => a + b, 0) / previousNotes.length : 0;
      statistics.recentTrend = recentAvg - previousAvg;

      setStats(statistics);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les notes. Veuillez réessayer.");
      console.error('Erreur lors du chargement des notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filtrer les notes
  const filteredNotes = notes.filter(note => {
    const matchesPeriod = selectedPeriod === 'all' || 
      (selectedPeriod === 'month' && new Date(note.createdAt).getMonth() === new Date().getMonth()) ||
      (selectedPeriod === 'semester' && new Date(note.createdAt) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    
    const matchesSubject = selectedSubject === 'all' || note.cours?.nom === selectedSubject;
    
    return matchesPeriod && matchesSubject;
  });

  // Fonction pour obtenir la couleur selon la note
  const getNoteColor = (note) => {
    if (note >= 16) return 'text-green-600 bg-green-50 border-green-200';
    if (note >= 14) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (note >= 12) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (note >= 10) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Fonction pour obtenir l'icône de tendance
  const getTrendIcon = (trend) => {
    if (trend > 1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Target className="h-4 w-4 text-gray-600" />;
  };

  // Fonction pour obtenir le statut de performance
  const getPerformanceStatus = (average) => {
    const num = parseFloat(average);
    if (num >= 16) return { text: "Excellent", color: "bg-green-100 text-green-800", icon: Sparkles };
    if (num >= 14) return { text: "Très bien", color: "bg-blue-100 text-blue-800", icon: TrendingUp };
    if (num >= 12) return { text: "Bien", color: "bg-blue-100 text-blue-800", icon: Star };
    if (num >= 10) return { text: "Passable", color: "bg-orange-100 text-orange-800", icon: Target };
    return { text: "Insuffisant", color: "bg-red-100 text-red-800", icon: AlertTriangle };
  };

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
            Chargement de vos notes...
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
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchNotes}
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
        <Award size={32} />
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
                  🏆
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
                  🏆 Mes Notes Magiques ✨
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
                  🌟 Suivi de tes notes et progression !
                </motion.p>
              </div>
            </motion.div>

            {/* Boutons d'action - Animations ultra attractives */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(!showStats)}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <BarChart2 size={20} />
                </motion.div>
                {showStats ? 'Masquer' : 'Afficher'} les statistiques
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchNotes}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-2xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <RefreshCw size={20} />
                </motion.div>
                🔄 Actualiser
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Statistiques - Animations ultra attractives */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Moyenne générale */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateY: [0, 5, 0],
                      rotateX: [0, 3, 0],
                    }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Moyenne générale</p>
                        <motion.p 
                          className="text-4xl font-bold text-blue-600"
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
                          {stats.average}/20
                        </motion.p>
                      </div>
                      <motion.div 
                        className="p-4 bg-blue-100 rounded-2xl"
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
                          ⭐
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Nombre de notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateY: [0, 5, 0],
                      rotateX: [0, 3, 0],
                    }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notes totales</p>
                        <motion.p 
                          className="text-4xl font-bold text-green-600"
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
                          {stats.total}
                        </motion.p>
                      </div>
                      <motion.div 
                        className="p-4 bg-green-100 rounded-2xl"
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
                          📚
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Meilleure matière */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateY: [0, 5, 0],
                      rotateX: [0, 3, 0],
                    }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Meilleure matière</p>
                        <motion.p 
                          className="text-3xl font-bold text-purple-600"
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
                          {stats.bestSubject ? (
                            <>
                              {stats.bySubject[stats.bestSubject].average}/20
                              <span className="text-sm text-gray-500 ml-2 block">
                                ({stats.bestSubject})
                              </span>
                            </>
                          ) : '-'}
                        </motion.p>
                      </div>
                      <motion.div 
                        className="p-4 bg-purple-100 rounded-2xl"
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
                          🏆
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Tendance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      rotateY: [0, 5, 0],
                      rotateX: [0, 3, 0],
                    }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tendance</p>
                        <motion.p 
                          className={`text-4xl font-bold ${stats.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}
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
                          {stats.recentTrend >= 0 ? '+' : ''}{stats.recentTrend.toFixed(2)}
                        </motion.p>
                      </div>
                      <motion.div 
                        className={`p-4 rounded-2xl ${stats.recentTrend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
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
                          {stats.recentTrend >= 0 ? '📈' : '📉'}
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtres - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12 bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-200"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-3 bg-blue-100 rounded-2xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Filter className="h-6 w-6 text-blue-600" />
                </motion.div>
                <span className="text-gray-700 font-bold text-lg">Filtrer par :</span>
              </div>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-6 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base font-medium"
              >
                <option value="all">Toutes les périodes</option>
                <option value="month">Ce mois</option>
                <option value="semester">Ce semestre</option>
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-6 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base font-medium"
              >
                <option value="all">Toutes les matières</option>
                {Object.keys(stats.bySubject).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Liste des notes - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <th className="px-8 py-6 text-left text-lg font-bold">Date</th>
                    <th className="px-8 py-6 text-left text-lg font-bold">Matière</th>
                    <th className="px-8 py-6 text-left text-lg font-bold">Note</th>
                    <th className="px-8 py-6 text-left text-lg font-bold">Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-16 text-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-gray-500"
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
                            className="w-16 h-16 mx-auto mb-6 p-4 rounded-full bg-gray-200"
                          >
                            <Info className="h-8 w-8 text-gray-500" />
                          </motion.div>
                          <p className="text-xl font-bold text-gray-600">Aucune note pour cette période</p>
                          <p className="text-base text-gray-500 mt-2">Continuez vos efforts !</p>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    filteredNotes.map((note, index) => (
                      <motion.tr
                        key={note._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          backgroundColor: "rgba(59, 130, 246, 0.05)"
                        }}
                        className="border-b border-gray-100 transition-all duration-200"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="p-2 bg-blue-100 rounded-xl"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0, -5, 0],
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300,
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </motion.div>
                            <span className="font-bold text-lg">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="p-2 bg-green-100 rounded-xl"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0, -5, 0],
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300,
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              <BookOpen className="h-5 w-5 text-green-600" />
                            </motion.div>
                            <span className="font-bold text-lg text-gray-900">{note.cours?.nom || 'Non spécifiée'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <motion.span 
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-lg font-bold border-2 ${getNoteColor(note.note)}`}
                            whileHover={{ scale: 1.1, y: -2 }}
                            animate={{ 
                              scale: [1, 1.02, 1],
                              y: [0, -1, 0],
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            <motion.span
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, 0, -10, 0],
                              }}
                              transition={{ 
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              ⭐
                            </motion.span>
                            {note.note}/20
                          </motion.span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="p-2 bg-purple-100 rounded-xl"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0, -5, 0],
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300,
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              <Info className="h-5 w-5 text-purple-600" />
                            </motion.div>
                            <span className="text-lg text-gray-600">
                              {note.commentaire || 'Aucun commentaire'}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesStudent; 