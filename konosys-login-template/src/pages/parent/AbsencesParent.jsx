import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { 
  Calendar,
  User,
  RefreshCw,
  Clock,
  AlertCircle,
  CalendarDays,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock3,
  AlertOctagon,
  Sparkles,
  Target,
  Zap,
  TrendingDown,
  Info,
  Shield,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const AbsencesParent = () => {
  const [childrenData, setChildrenData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  const fetchChildrenData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      
      // Récupérer d'abord le profil parent avec les enfants
      const parentResponse = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const parent = parentResponse.data;
      const childrenAbsences = {};

      // Pour chaque enfant, récupérer ses absences
      for (const child of parent.children) {
        const absencesResponse = await axios.get(`/api/absences/student/${child._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Grouper les absences par matière
        const absencesByMatiere = {};
        const absences = absencesResponse.data;
        
        absences.forEach(absence => {
          // Récupérer la matière depuis le cours
          const matiere = absence.course?.matiere?.nom || absence.course?.nom || 'Matière non spécifiée';
          
          if (!absencesByMatiere[matiere]) {
            absencesByMatiere[matiere] = {
              matiere,
              absences: [],
              totalAbsences: 0,
              totalHeures: 0,
              limite: 12, // Limite de 12h par matière
              pourcentage: 0
            };
          }
          absencesByMatiere[matiere].absences.push(absence);
          absencesByMatiere[matiere].totalAbsences++;
          absencesByMatiere[matiere].totalHeures += 2; // 2h par absence
        });

        // Calculer le pourcentage pour chaque matière
        Object.values(absencesByMatiere).forEach(matiere => {
          matiere.pourcentage = Math.round((matiere.totalHeures / matiere.limite) * 100);
        });
        
        childrenAbsences[child._id] = {
          enfant: child,
          absences,
          absencesByMatiere: Object.values(absencesByMatiere)
        };
      }

      setChildrenData(childrenAbsences);
    } catch (err) {
      console.error("Erreur récupération absences:", err);
      setError("Impossible de charger les absences. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChildrenData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChildrenData();
  };

  // Calcul des statistiques globales
  const getGlobalStats = () => {
    const allAbsences = Object.values(childrenData).flatMap(child => child.absences || []);
    const totalAbsences = allAbsences.length;
    const totalChildren = Object.keys(childrenData).length;
    const totalJustified = allAbsences.filter(abs => abs.justification).length;
    const totalUnjustified = totalAbsences - totalJustified;
    const totalHeures = totalAbsences * 2;

    return { totalAbsences, totalChildren, totalJustified, totalUnjustified, totalHeures };
  };

  // Fonction pour obtenir la couleur selon le pourcentage d'absences
  const getAbsenceColor = (pourcentage) => {
    if (pourcentage >= 100) return 'red';
    if (pourcentage >= 75) return 'orange';
    if (pourcentage >= 50) return 'yellow';
    return 'green';
  };

  // Fonction pour obtenir le statut de performance
  const getAbsenceStatus = (totalHours) => {
    if (totalHours <= 6) return { text: "Excellent", color: "bg-emerald-100 text-emerald-800", icon: Sparkles };
    if (totalHours <= 12) return { text: "Bon", color: "bg-blue-100 text-blue-800", icon: Shield };
    if (totalHours <= 18) return { text: "Attention", color: "bg-orange-100 text-orange-800", icon: AlertTriangle };
    return { text: "Critique", color: "bg-red-100 text-red-800", icon: AlertOctagon };
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
            Chargement des absences...
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
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5 inline mr-2" />
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const stats = getGlobalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <span>Absences de vos enfants</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              Suivi détaillé des absences de vos {stats.totalChildren} enfant(s) ✨
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total absences</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalAbsences}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heures manquées</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalHeures}h</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
              <Clock3 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Justifiées</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.totalJustified}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Non justifiées</p>
              <p className="text-3xl font-bold text-red-600">{stats.totalUnjustified}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enfants</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalChildren}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Liste des absences par enfant */}
      {Object.values(childrenData).map(({ enfant, absences, absencesByMatiere }) => (
        <motion.div
          key={enfant._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{enfant.name}</h2>
                <p className="text-gray-600 text-lg">{enfant.classe === '5A' ? '6A' : enfant.classe}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-blue-600">{absences?.length || 0} absence(s)</span>
            </div>
          </div>

          {!absences || absences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Aucune absence enregistrée</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Statistiques par matière avec barres de progression */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Statistiques par matière
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {absencesByMatiere.map((matiere, index) => {
                    const color = getAbsenceColor(matiere.pourcentage);
                    const status = getAbsenceStatus(matiere.totalHeures);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-6 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg bg-white"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{matiere.matiere}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <status.icon className="h-3 w-3" />
                              {status.text}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Heures :</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="font-bold text-orange-600">
                                {matiere.totalHeures}h / {matiere.limite}h
                              </span>
                            </div>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                color === 'red' ? 'bg-red-500' :
                                color === 'orange' ? 'bg-orange-500' :
                                color === 'yellow' ? 'bg-yellow-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(matiere.pourcentage, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {matiere.totalAbsences} absence(s) - {matiere.pourcentage}%
                            </span>
                            {matiere.pourcentage >= 100 && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1">
                                <AlertOctagon className="h-3 w-3" />
                                Limite dépassée
                              </span>
                            )}
                            {matiere.pourcentage >= 75 && matiere.pourcentage < 100 && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                Attention
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Détail des absences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Détail des absences
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matière</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cours</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Classe</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Semestre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absences.map((absence, index) => (
                        <motion.tr
                          key={absence._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold text-gray-900">{new Date(absence.date).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-indigo-500" />
                              <span className="font-semibold text-gray-900">{absence.course?.matiere?.nom || absence.course?.nom || 'Non spécifiée'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700 font-medium">{absence.course?.nom || 'Cours non spécifié'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {absence.course?.classe === '5A' ? '6A' : (absence.course?.classe || 'Non spécifiée')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                              {absence.course?.semestre || 'Non spécifié'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Message si aucun enfant */}
      {Object.keys(childrenData).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center shadow-lg"
        >
          <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            Aucun enfant lié à votre compte
          </h3>
          <p className="text-yellow-700 mb-6 text-lg">
            Pour voir les absences de vos enfants, ils doivent être liés à votre compte parent.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-medium hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contacter l'administration
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AbsencesParent; 