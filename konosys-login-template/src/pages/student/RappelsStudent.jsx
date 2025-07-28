import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  Users,
  Target,
  Calendar,
  User,
  Loader2,
  RefreshCw
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

export default function RappelsStudent() {
  const { darkMode } = useContext(ThemeContext);
  const [rappels, setRappels] = useState([]);
  const [allRappels, setAllRappels] = useState([]);
  const [selectedProf, setSelectedProf] = useState("tous");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const studentClasse = userInfo?.classe;

  useEffect(() => {
    fetchRappels();
  }, []);

  const fetchRappels = async () => {
    setLoading(true);
    setError("");
    try {
      // Utiliser la nouvelle route pour les étudiants
      const response = await axios.get("http://localhost:5001/api/rappels/student/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAllRappels(response.data);
      setRappels(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des rappels:", err);
      setError("Erreur lors du chargement des rappels");
    } finally {
      setLoading(false);
    }
  };

  const toggleFait = async (rappelId) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/rappels/${rappelId}/toggle-fait`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Mettre à jour la liste des rappels
      setRappels(prev => prev.map(rappel => 
        rappel._id === rappelId 
          ? { ...rappel, fait: !rappel.fait }
          : rappel
      ));
      
      alert(response.data.message);
    } catch (err) {
      console.error("Erreur lors du toggle:", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const filterByProf = (prof) => {
    setSelectedProf(prof);
    if (prof === "tous") {
      setRappels(allRappels);
    } else {
      const filtered = allRappels.filter(rappel => 
        rappel.professeur?.name === prof
      );
      setRappels(filtered);
    }
  };

  const getUniqueProfs = () => {
    const profs = allRappels.map(rappel => rappel.professeur?.name).filter(Boolean);
    return [...new Set(profs)];
  };

  const getIconForType = (type) => {
    switch (type) {
      case "devoir": return "📚";
      case "quiz": return "🎯";
      case "tache": return "📝";
      case "note": return "📋";
      default: return "📌";
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case "devoir": return "from-blue-500 to-blue-600";
      case "quiz": return "from-purple-500 to-purple-600";
      case "tache": return "from-green-500 to-green-600";
      case "note": return "from-orange-500 to-orange-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatutIcon = (fait) => {
    return fait ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-500" />
    );
  };

  const getStatutColor = (fait) => {
    return fait ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getStatutText = (fait) => {
    return fait ? "Terminé" : "À faire";
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'}`}>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
          />
          <p className={`font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Chargement de vos rappels...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-8"
        >
          <motion.h1
            className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            🔔 Mes Rappels Magiques
          </motion.h1>
          <motion.p
            className={`text-xl font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Organise tes tâches et deviens un super élève ! ✨
          </motion.p>
        </motion.div>

        {/* Info classe et bouton actualiser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className={`flex items-center gap-3 ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
            <Users className="w-5 h-5" />
            <span className="font-semibold">Classe : {studentClasse}</span>
            <Target className="w-5 h-5 text-red-500" />
            <span className="text-sm">Organise tes tâches et deviens un super élève !</span>
          </div>
          
          <motion.button
            onClick={fetchRappels}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Actualiser mes rappels
          </motion.button>
        </motion.div>

        {/* Erreur */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="bg-red-100 border-2 border-red-300 text-red-700 py-4 px-6 rounded-2xl mb-6 flex items-center justify-center gap-3 max-w-md mx-auto shadow-lg"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { label: "Total Rappels", count: allRappels.length, color: "from-blue-400 to-indigo-500", icon: Bell },
            { label: "Terminés", count: allRappels.filter(r => r.fait).length, color: "from-green-400 to-emerald-500", icon: CheckCircle },
            { label: "À faire", count: allRappels.filter(r => !r.fait).length, color: "from-orange-400 to-red-500", icon: Clock }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <stat.icon className="w-8 h-8 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filtrer par prof
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="mt-4 p-4 bg-white/80 rounded-2xl shadow-lg"
              >
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => filterByProf("tous")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      selectedProf === "tous"
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Tous les profs ({allRappels.length})
                  </motion.button>
                  {getUniqueProfs().map((prof) => (
                    <motion.button
                      key={prof}
                      onClick={() => filterByProf(prof)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        selectedProf === prof
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {prof} ({allRappels.filter(r => r.professeur?.name === prof).length})
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Liste des rappels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          {rappels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🔔
              </motion.div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucun rappel trouvé
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedProf === "tous" ? "Aucun rappel pour ta classe pour le moment" : "Aucun rappel de ce professeur"}
              </p>
            </motion.div>
          ) : (
            rappels.map((rappel, index) => (
              <motion.div
                key={rappel._id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-purple-500/30' : 'bg-white/90 border-pink-200'}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <span className="text-2xl">{getIconForType(rappel.type || 'note')}</span>
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {rappel.texte}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Type: {rappel.type} • Classe: {rappel.classe}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${getStatutColor(rappel.fait)}`}>
                        {getStatutIcon(rappel.fait)}
                        {getStatutText(rappel.fait)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(rappel.date).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Classe: {rappel.classe}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{rappel.professeur?.name || "Professeur"}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => toggleFait(rappel._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      rappel.fait
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}
                  >
                    {rappel.fait ? (
                      <>
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Terminé !
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 inline mr-2" />
                        Marquer comme terminé
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
