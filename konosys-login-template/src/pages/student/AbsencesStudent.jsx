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
      const response = await axios.get('/api/absences/etudiant', {
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="text-center"
        >
          <div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p
            className="text-lg text-blue-700 font-medium"
          >
            Chargement de vos absences...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="text-center max-w-md mx-auto p-8"
        >
          <div
            className="w-20 h-20 mx-auto mb-6 p-4 rounded-full bg-green-100"
          >
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAbsences}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5 inline mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Animations ultra attractives */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full"
          style={{
            animation: 'float 8s infinite linear',
            transform: 'translateY(0) rotate(0deg) scale(1)',
          }}
        />
        <div
          className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full"
          style={{
            animation: 'float 10s infinite linear',
            transform: 'translateY(0) rotate(0deg) scale(1)',
          }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full"
          style={{
            animation: 'float 12s infinite linear',
            transform: 'translateX(0) rotate(0deg) scale(1)',
          }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-10 h-10 bg-pink-100 rounded-full"
          style={{
            animation: 'float 15s infinite linear',
            transform: 'translateX(0) translateY(0) scale(1) rotate(0deg)',
          }}
        />
      </div>

      {/* Floating decorative elements - Animations ultra attractives */}
      <div
        className="absolute top-16 right-16 text-blue-400"
        style={{
          animation: 'rotate 15s infinite linear',
          transform: 'translate(0, 0) rotate(0deg) scale(1)',
        }}
      >
        <Calendar size={32} />
      </div>
      <div
        className="absolute bottom-16 left-16 text-green-400"
        style={{
          animation: 'rotate 20s infinite linear',
          transform: 'translate(0, 0) rotate(0deg) scale(1)',
        }}
      >
        <CheckCircle size={28} />
      </div>
      <div
        className="absolute top-1/2 left-1/2 text-purple-400"
        style={{
          animation: 'rotate 18s infinite linear',
          transform: 'translate(0, 0) rotate(0deg) scale(1)',
        }}
      >
        <AlertTriangle size={24} />
      </div>

      <div className="relative z-10 py-8 px-6">
        <div
          className="max-w-7xl mx-auto"
        >
          {/* Header avec animations ultra attractives */}
          <div
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <div
                  className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl"
                >
                  <span 
                    className="text-6xl"
                  >
                    📅
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <h1 
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    📅 Mes Absences Magiques ✨
                  </h1>
                  <p 
                    className="text-xl sm:text-2xl font-medium text-gray-700"
                  >
                    🌟 Suivi de tes absences par matière !
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl"
                >
                  <BarChart size={20} />
                  {showStats ? 'Masquer' : 'Afficher'} les statistiques
                </button>
                <button
                  onClick={fetchAbsences}
                  className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-2xl"
                >
                  <RefreshCw size={20} />
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques - Animations ultra attractives */}
          {showStats && (
            <div
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    label: "Total absences", 
                    count: stats.total, 
                    color: "blue", 
                    icon: "📅",
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-600"
                  },
                  { 
                    label: "Heures manquées", 
                    count: `${stats.totalHours}h`, 
                    color: "orange", 
                    icon: "⏰",
                    bgColor: "bg-orange-100",
                    textColor: "text-orange-600"
                  },
                  { 
                    label: "Justifiées", 
                    count: stats.justified, 
                    color: "green", 
                    icon: "✅",
                    bgColor: "bg-green-100",
                    textColor: "text-green-600"
                  },
                  { 
                    label: "Non justifiées", 
                    count: stats.unjustified, 
                    color: "red", 
                    icon: "❌",
                    bgColor: "bg-red-100",
                    textColor: "text-red-600"
                  }
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p 
                          className={`text-3xl font-bold ${stat.textColor}`}
                        >
                          {stat.count}
                        </p>
                      </div>
                      <div 
                        className={`p-4 ${stat.bgColor} rounded-2xl`}
                      >
                        <span 
                          className="text-3xl"
                        >
                          {stat.icon}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistiques par matière - Animations ultra attractives */}
              <div
                className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200"
              >
                <h3 
                  className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                >
                  <BarChart className="h-6 w-6 text-blue-600" />
                  Détail par matière
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(stats.bySubject).map(([subject, data], index) => {
                    const status = getAbsenceStatus(data.hours);
                    return (
                      <div
                        key={subject}
                        className="p-6 rounded-3xl border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-gray-50 to-white"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                          >
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{subject}</h4>
                            <span 
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Filtres - Animations ultra attractives */}
          <div
            className="mb-6 bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div 
                className="flex items-center gap-2"
              >
                <Filter className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700 font-medium">Filtrer par :</span>
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
          </div>

          {/* Liste des absences - Animations ultra attractives */}
          <div
            className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Date</th>
                    <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Matière</th>
                    <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Horaire</th>
                    <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Statut</th>
                    <th className="px-8 py-6 text-left text-base font-bold text-gray-700">Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbsences.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center">
                        <div
                          className="text-gray-500"
                        >
                          <div
                            className="w-20 h-20 mx-auto mb-6 p-4 rounded-full bg-green-100"
                          >
                            <CheckCircle className="text-green-600" size={48} />
                          </div>
                          <p className="text-xl font-medium text-gray-600">
                            Aucune absence pour cette période
                          </p>
                          <p className="text-gray-500">
                            Continuez comme ça !
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAbsences.map((absence, index) => (
                      <tr
                        key={absence._id || index}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <span className="font-semibold text-gray-900">{new Date(absence.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-500" />
                            <span className="font-semibold text-gray-900">{absence.course?.nom || 'Non spécifiée'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <span className="font-medium">2h</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {absence.justified ? (
                            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-2xl text-base font-bold bg-emerald-50 text-emerald-600 border-2 border-emerald-200">
                              <CheckCircle className="h-5 w-5" />
                              Justifiée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-2xl text-base font-bold bg-red-50 text-red-600 border-2 border-red-200">
                              <XCircle className="h-5 w-5" />
                              Non justifiée
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">
                              {absence.justification || 'Aucune justification fournie'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsencesStudent;
