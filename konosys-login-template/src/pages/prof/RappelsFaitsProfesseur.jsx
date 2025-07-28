import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Filter,
  Search,
  GraduationCap,
  Calendar,
  MessageSquare
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

export default function RappelsFaitsProfesseur() {
  const { darkMode } = useContext(ThemeContext);
  const [rappels, setRappels] = useState([]);
  const [selectedRappel, setSelectedRappel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Récupérer les rappels du professeur connecté
  useEffect(() => {
    fetchRappels();
  }, []);

  const fetchRappels = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5001/api/rappels", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Les rappels sont déjà filtrés par professeur dans le backend
      setRappels(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des rappels:", err);
      setError("Erreur lors du chargement des rappels");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les étudiants qui ont fait un rappel spécifique
  const fetchEtudiantsForRappel = async (rappelId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/rappels/${rappelId}/etudiants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la récupération des étudiants:", err);
      return [];
    }
  };

  // Filtrer les rappels
  const filteredRappels = rappels.filter(rappel => {
    const matchesFilter = filter === "toutes" || rappel.classe === filter;
    const matchesSearch = rappel.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rappel.texte?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const getClassesUniques = () => {
    const classes = [...new Set(rappels.map(r => r.classe))];
    return classes;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
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
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className={`font-medium ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>Chargement de vos rappels...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.h1
            className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ✅ Rappels Complétés
          </motion.h1>
          <motion.p
            className={`text-xl font-medium ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Suivez quels étudiants ont marqué vos rappels comme faits ! 📊
          </motion.p>
        </motion.div>

        {/* Erreur */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="bg-red-100 border-2 border-red-300 text-red-700 py-4 px-6 rounded-2xl mt-6 flex items-center justify-center gap-3 max-w-md mx-auto shadow-lg"
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
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Total Rappels", count: rappels.length, color: "from-blue-400 to-indigo-500", icon: MessageSquare },
            { label: "Classes", count: getClassesUniques().length, color: "from-orange-400 to-red-500", icon: GraduationCap },
            { label: "En attente", count: rappels.filter(r => !r.fait).length, color: "from-yellow-400 to-orange-500", icon: Clock },
            { label: "Complétés", count: rappels.filter(r => r.fait).length, color: "from-green-400 to-emerald-500", icon: CheckCircle }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
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

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Filtres par classe */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setFilter("toutes")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                filter === "toutes"
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : darkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Toutes les classes
            </motion.button>
            {getClassesUniques().map((classe) => (
              <motion.button
                key={classe}
                onClick={() => setFilter(classe)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  filter === classe
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : darkMode 
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                {classe}
              </motion.button>
            ))}
          </div>

          {/* Recherche */}
          <div className="flex-1 max-w-md">
            <div className={`relative ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un rappel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-700 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Liste des rappels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredRappels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📋
              </motion.div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucun rappel trouvé
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filter === "toutes" ? "Vous n'avez pas encore créé de rappels" : "Aucun rappel dans cette classe"}
              </p>
            </motion.div>
          ) : (
            filteredRappels.map((rappel, index) => (
              <motion.div
                key={rappel._id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-blue-500/30' : 'bg-white/90 border-blue-200'}`}
              >
                {/* Header du rappel */}
                <div className={`bg-gradient-to-r ${getColorForType(rappel.type || 'note')} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getIconForType(rappel.type || 'note')}</span>
                      <div>
                        <h3 className="text-xl font-bold">{rappel.texte}</h3>
                        <p className="text-sm opacity-90">Type: {rappel.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4" />
                        {rappel.classe}
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(rappel.date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Cliquez pour voir les étudiants</span>
                    </div>
                  </div>
                </div>

                {/* Bouton pour voir les étudiants */}
                <div className="p-6">
                  <motion.button
                    onClick={async () => {
                      try {
                        const etudiants = await fetchEtudiantsForRappel(rappel._id);
                        if (etudiants.length === 0) {
                          alert("Aucun étudiant n'a encore marqué ce rappel comme fait.");
                        } else {
                          const message = `Étudiants ayant fait ce rappel:\n${etudiants.map(e => `✅ ${e.name} (${e.classe})`).join('\n')}`;
                          alert(message);
                        }
                      } catch (error) {
                        alert("Erreur lors de la récupération des étudiants");
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Voir les étudiants qui ont fait ce rappel
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
