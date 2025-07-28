import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import {
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart,
  RefreshCw,
  Filter,
  ChevronDown,
  Info,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AbsencesStudent = () => {
  const { darkMode } = useContext(ThemeContext);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    justified: 0,
    unjustified: 0,
    bySubject: {},
    totalHours: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showStats, setShowStats] = useState(true);

  const fetchAbsences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students/absences', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Traitement des données
      const absenceData = response.data;
      setAbsences(absenceData);

      // Calcul des statistiques
      const statistics = {
        total: absenceData.length,
        justified: absenceData.filter(a => a.justified).length,
        unjustified: absenceData.filter(a => !a.justified).length,
        bySubject: {},
        totalHours: 0
      };

      absenceData.forEach(absence => {
        const subject = absence.course?.nom || 'Non spécifiée';
        if (!statistics.bySubject[subject]) {
          statistics.bySubject[subject] = {
            total: 0,
            justified: 0,
            unjustified: 0,
            hours: 0
          };
        }
        statistics.bySubject[subject].total++;
        if (absence.justified) {
          statistics.bySubject[subject].justified++;
        } else {
          statistics.bySubject[subject].unjustified++;
        }
        statistics.bySubject[subject].hours += 2; // Supposons 2h par séance
        statistics.totalHours += 2;
      });

      setStats(statistics);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les absences. Veuillez réessayer.");
      console.error('Erreur lors du chargement des absences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsences();
  }, []);

  // Filtrer les absences
  const filteredAbsences = absences.filter(absence => {
    const matchesPeriod = selectedPeriod === 'all' || 
      (selectedPeriod === 'month' && new Date(absence.date).getMonth() === new Date().getMonth()) ||
      (selectedPeriod === 'semester' && new Date(absence.date) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000));
    
    const matchesSubject = selectedSubject === 'all' || absence.course?.nom === selectedSubject;
    
    return matchesPeriod && matchesSubject;
  });

  // Fonction pour obtenir le statut de performance
  const getAbsenceStatus = (totalHours) => {
    if (totalHours <= 6) return { text: "Excellent", color: "bg-emerald-100 text-emerald-800", icon: Sparkles };
    if (totalHours <= 12) return { text: "Bon", color: "bg-blue-100 text-blue-800", icon: Shield };
    if (totalHours <= 18) return { text: "Attention", color: "bg-orange-100 text-orange-800", icon: AlertTriangle };
    return { text: "Critique", color: "bg-red-100 text-red-800", icon: AlertCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
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
            Chargement de vos absences...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
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
            onClick={fetchAbsences}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Calendar className="h-10 w-10 text-blue-600" />
              Mes Absences
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              Suivi de vos absences par matière ✨
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
            >
              <BarChart className="h-5 w-5" />
              {showStats ? 'Masquer' : 'Afficher'} les statistiques
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAbsences}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
              {/* Total absences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total absences</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              {/* Heures manquées */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Heures manquées</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalHours}h</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </motion.div>

              {/* Absences justifiées */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Justifiées</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.justified}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </motion.div>

              {/* Absences non justifiées */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Non justifiées</p>
                    <p className="text-3xl font-bold text-red-600">{stats.unjustified}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
                    <XCircle className="h-8 w-8 text-red-600" />
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
                <BarChart className="h-6 w-6 text-blue-600" />
                Détail par matière
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(stats.bySubject).map(([subject, data], index) => {
                  const status = getAbsenceStatus(data.hours);
                  return (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-6 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-gray-50 to-white"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{subject}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <status.icon className="h-3 w-3" />
                            {status.text}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total :</span>
                          <span className="font-bold text-lg">{data.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Justifiées :</span>
                          <span className="font-semibold text-emerald-600">{data.justified}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Non justifiées :</span>
                          <span className="font-semibold text-red-600">{data.unjustified}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Heures :</span>
                          <span className="font-bold text-orange-600">{data.hours}h</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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
            <Filter className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 font-medium">Filtrer par :</span>
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Toutes les périodes</option>
            <option value="month">Ce mois</option>
            <option value="semester">Ce semestre</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Toutes les matières</option>
            {Object.keys(stats.bySubject).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Liste des absences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matière</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Horaire</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Justification</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsences.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-gray-500"
                    >
                      <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600">Aucune absence pour cette période</p>
                      <p className="text-sm text-gray-500 mt-2">Continuez comme ça !</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredAbsences.map((absence, index) => (
                  <motion.tr
                    key={absence._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-gray-900">{new Date(absence.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                        <span className="font-semibold text-gray-900">{absence.course?.nom || 'Non spécifiée'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">2h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {absence.justified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle className="h-4 w-4" />
                          Justifiée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-600 border border-red-200">
                          <XCircle className="h-4 w-4" />
                          Non justifiée
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {absence.justification || 'Aucune justification fournie'}
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

export default AbsencesStudent;
