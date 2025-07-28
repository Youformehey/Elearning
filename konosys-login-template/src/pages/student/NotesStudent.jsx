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
    if (note >= 16) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (note >= 14) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (note >= 12) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (note >= 10) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Fonction pour obtenir l'icône de tendance
  const getTrendIcon = (trend) => {
    if (trend > 1) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (trend < -1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Target className="h-4 w-4 text-gray-600" />;
  };

  // Fonction pour obtenir le statut de performance
  const getPerformanceStatus = (average) => {
    const num = parseFloat(average);
    if (num >= 16) return { text: "Excellent", color: "bg-emerald-100 text-emerald-800", icon: Sparkles };
    if (num >= 14) return { text: "Très bien", color: "bg-blue-100 text-blue-800", icon: TrendingUp };
    if (num >= 12) return { text: "Bien", color: "bg-purple-100 text-purple-800", icon: Star };
    if (num >= 10) return { text: "Passable", color: "bg-orange-100 text-orange-800", icon: Target };
    return { text: "Insuffisant", color: "bg-red-100 text-red-800", icon: AlertTriangle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-purple-700 font-medium"
          >
            Chargement de vos notes...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
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
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5 inline mr-2" />
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
    }`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Award className="h-10 w-10 text-purple-600" />
              Mes Notes
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              Suivi de vos notes et progression ✨
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 font-medium"
            >
              <BarChart2 className="h-5 w-5" />
              {showStats ? 'Masquer' : 'Afficher'} les statistiques
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchNotes}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-5 w-5" />
              Actualiser
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Moyenne générale */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-purple-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Moyenne générale</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {stats.average}/20
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              {/* Nombre de notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Notes totales</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              {/* Meilleure matière */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Meilleure matière</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {stats.bestSubject ? (
                        <>
                          {stats.bySubject[stats.bestSubject].average}/20
                          <span className="text-sm text-gray-500 ml-2 block">
                            ({stats.bestSubject})
                          </span>
                        </>
                      ) : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                    <Trophy className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </motion.div>

              {/* Tendance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tendance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.recentTrend > 0 ? '+' : ''}{stats.recentTrend.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(stats.recentTrend)}
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Statistiques par matière */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BarChart2 className="h-6 w-6 text-purple-600" />
                Détail par matière
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(stats.bySubject).map(([subject, data], index) => (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">{subject}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Moyenne :</span>
                        <span className="font-bold text-lg">{data.average}/20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Meilleure note :</span>
                        <span className="font-semibold text-emerald-600">{data.highest}/20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Note la plus basse :</span>
                        <span className="font-semibold text-red-600">{data.lowest}/20</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tendance :</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(data.trend)}
                          <span className="font-medium">
                            {data.trend > 0 ? '+' : ''}{data.trend.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <span className="text-gray-700 font-medium">Filtrer par :</span>
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Toutes les périodes</option>
            <option value="month">Ce mois</option>
            <option value="semester">Ce semestre</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Toutes les matières</option>
            {Object.keys(stats.bySubject).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Liste des notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matière</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Note</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-gray-500"
                    >
                      <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600">Aucune note pour cette période</p>
                      <p className="text-sm text-gray-500 mt-2">Continuez vos efforts !</p>
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
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">{note.cours?.nom || 'Non spécifiée'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getNoteColor(note.note)}`}>
                        <Star className="h-4 w-4" />
                        {note.note}/20
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
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
    </div>
  );
};

export default NotesStudent; 