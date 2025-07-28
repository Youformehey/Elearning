import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { 
  Award, 
  BookOpen, 
  User, 
  RefreshCw, 
  TrendingUp,
  BarChart3,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  Zap,
  Trophy,
  TrendingDown,
  Calendar,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const NotesParent = () => {
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
      const childrenNotes = {};

      // Pour chaque enfant, récupérer ses notes
      for (const child of parent.children) {
        const notesResponse = await axios.get(`/api/notes/student/${child._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Grouper les notes par matière
        const notesByMatiere = {};
        const notes = notesResponse.data;
        
        notes.forEach(note => {
          // Récupérer la matière depuis le cours
          const matiere = note.cours?.nom || 'Matière non spécifiée';
          
          if (!notesByMatiere[matiere]) {
            notesByMatiere[matiere] = {
              matiere,
              notes: [],
              totalNotes: 0,
              moyenne: 0,
              meilleureNote: 0,
              pireNote: 20,
              limite: 12 // Limite de 12h par matière (comme les absences)
            };
          }
          notesByMatiere[matiere].notes.push(note);
          notesByMatiere[matiere].totalNotes++;
        });

        // Calculer les statistiques pour chaque matière
        Object.values(notesByMatiere).forEach(matiere => {
          const validNotes = matiere.notes.filter(note => note.note && !isNaN(note.note));
          if (validNotes.length > 0) {
            matiere.moyenne = (validNotes.reduce((acc, n) => acc + n.note, 0) / validNotes.length).toFixed(2);
            matiere.meilleureNote = Math.max(...validNotes.map(n => n.note));
            matiere.pireNote = Math.min(...validNotes.map(n => n.note));
          }
        });
        
        childrenNotes[child._id] = {
          enfant: child,
          notes,
          notesByMatiere: Object.values(notesByMatiere)
        };
      }

      setChildrenData(childrenNotes);
    } catch (err) {
      console.error("Erreur récupération notes:", err);
      setError("Impossible de charger les notes. Vérifiez votre connexion.");
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

  // Calcul de la moyenne
  const getMoyenne = (notes) => {
    if (!notes || !notes.length) return 0;
    const validNotes = notes.filter(note => note.note && !isNaN(note.note));
    if (!validNotes.length) return 0;
    const total = validNotes.reduce((acc, n) => acc + n.note, 0);
    return (total / validNotes.length).toFixed(2);
  };

  // Calcul des statistiques globales
  const getGlobalStats = () => {
    const allNotes = Object.values(childrenData).flatMap(child => child.notes || []);
    const validNotes = allNotes.filter(note => note.note && !isNaN(note.note));
    const totalNotes = validNotes.length;
    const globalAverage = totalNotes > 0 
      ? (validNotes.reduce((acc, n) => acc + n.note, 0) / totalNotes).toFixed(2)
      : 0;
    const totalChildren = Object.keys(childrenData).length;
    const totalSubjects = new Set(allNotes.map(note => note.cours?.nom).filter(Boolean)).size;

    return { totalNotes, globalAverage, totalChildren, totalSubjects };
  };

  // Fonction pour obtenir la couleur selon la note
  const getNoteColor = (note) => {
    if (note >= 16) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (note >= 14) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (note >= 12) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (note >= 10) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Fonction pour obtenir le statut de performance
  const getPerformanceStatus = (average) => {
    const num = parseFloat(average);
    if (num >= 16) return { text: "Excellent", color: "bg-emerald-100 text-emerald-800", icon: Sparkles };
    if (num >= 14) return { text: "Très bien", color: "bg-blue-100 text-blue-800", icon: TrendingUp };
    if (num >= 12) return { text: "Bien", color: "bg-purple-100 text-purple-800", icon: Star };
    if (num >= 10) return { text: "Passable", color: "bg-orange-100 text-orange-800", icon: Target };
    return { text: "Insuffisant", color: "bg-red-100 text-red-800", icon: AlertCircle };
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
            Chargement des notes...
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
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
              <span>Notes de vos enfants</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              Suivi détaillé des notes de vos {stats.totalChildren} enfant(s) ✨
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-purple-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Moyenne générale</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {stats.globalAverage}/20
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg sm:rounded-xl">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notes totales</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalNotes}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
              <BookOpen className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Matières</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.totalSubjects}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enfants</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalChildren}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Liste des notes par enfant */}
      {Object.values(childrenData).map(({ enfant, notes, notesByMatiere }) => (
        <motion.div
          key={enfant._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{enfant.name}</h2>
                <p className="text-gray-600 text-lg">{enfant.classe === '5A' ? '6A' : enfant.classe}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <Star className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-lg text-purple-600">{getMoyenne(notes)}/20</span>
            </div>
          </div>

          {!notes || notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Aucune note disponible</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Statistiques par matière */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  Statistiques par matière
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notesByMatiere.map((matiere, index) => {
                    const status = getPerformanceStatus(matiere.moyenne);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-6 rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg bg-white"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{matiere.matiere}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <status.icon className="h-3 w-3" />
                              {status.text}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Moyenne :</span>
                            <span className="font-bold text-lg text-purple-600">{matiere.moyenne}/20</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Notes :</span>
                            <span className="font-semibold text-blue-600">{matiere.totalNotes}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Meilleure :</span>
                            <span className="font-semibold text-emerald-600">{matiere.meilleureNote}/20</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Plus basse :</span>
                            <span className="font-semibold text-red-600">{matiere.pireNote}/20</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Détail des notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                    Détail des notes
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matière</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Note</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Devoir</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note, index) => (
                        <motion.tr
                          key={note._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-purple-500" />
                              <span className="font-semibold text-gray-900">{note.cours?.nom || 'Matière non spécifiée'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getNoteColor(note.note)}`}>
                              <Star className="h-4 w-4" />
                              {note.note}/20
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700 font-medium">{note.devoir || 'Devoir non spécifié'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
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
          <AlertCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            Aucun enfant lié à votre compte
          </h3>
          <p className="text-yellow-700 mb-6 text-lg">
            Pour voir les notes de vos enfants, ils doivent être liés à votre compte parent.
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

export default NotesParent; 