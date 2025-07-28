import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  CalendarDays,
  Clock,
  Star,
  Users,
  FileText,
  ArrowRight,
  Search,
  RefreshCw,
  GraduationCap,
  User,
  Building,
  Trophy,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

// Icône simple pour les matières
const getMatiereIcon = (matiereNom) => {
  const nom = matiereNom?.toLowerCase() || '';
  if (nom.includes('math')) return <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('français') || nom.includes('francais')) return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('scien')) return <FileText className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('hist')) return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('geo')) return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('angl')) return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('art')) return <Star className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('musi')) return <Star className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('sport')) return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (nom.includes('info')) return <FileText className="w-5 h-5 sm:w-6 sm:h-6" />;
  return <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
};

// Couleurs simples pour les matières
const getMatiereColor = (matiereNom) => {
  const nom = matiereNom?.toLowerCase() || '';
  if (nom.includes('math')) return 'from-blue-500 to-cyan-500';
  if (nom.includes('français') || nom.includes('francais')) return 'from-red-500 to-pink-500';
  if (nom.includes('scien')) return 'from-green-500 to-emerald-500';
  if (nom.includes('hist')) return 'from-yellow-500 to-orange-500';
  if (nom.includes('geo')) return 'from-purple-500 to-indigo-500';
  if (nom.includes('angl')) return 'from-blue-600 to-purple-600';
  if (nom.includes('art')) return 'from-pink-500 to-rose-500';
  if (nom.includes('musi')) return 'from-purple-600 to-pink-600';
  if (nom.includes('sport')) return 'from-green-600 to-blue-600';
  if (nom.includes('info')) return 'from-gray-600 to-blue-600';
  return 'from-indigo-500 to-purple-500';
};

export default function CoursStudent() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const classeEtudiant = userInfo?.classe || null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch selon la classe de l'étudiant
      const res = await fetch(`${API_URL}/api/courses/student/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur " + res.status);
      const data = await res.json();
      setCours(data.courses);
    } catch (err) {
      setError("Erreur de chargement des données.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("fr-FR") : "Date inconnue";

  const getMatiereNom = (cours) => {
    if (!cours.matiere) return "Matière non renseignée";
    if (!cours.matiere.nom?.trim()) return "Matière inconnue";
    return cours.matiere.nom;
  };

  // Grouper les cours par matière
  const coursGroupesParMatiere = cours.reduce((acc, cours) => {
    const matiere = getMatiereNom(cours);
    if (!acc[matiere]) acc[matiere] = [];
    acc[matiere].push(cours);
    return acc;
  }, {});

  // Filtrer les cours selon le terme de recherche
  const filteredCoursGroupesParMatiere = Object.entries(coursGroupesParMatiere).reduce((acc, [matiere, coursList]) => {
    const filteredCours = coursList.filter(cours => 
      getMatiereNom(cours).toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cours.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredCours.length > 0) {
      acc[matiere] = filteredCours;
    }
    return acc;
  }, {});

  // Statistiques
  const stats = {
    totalCours: cours.length,
    totalMatieres: Object.keys(coursGroupesParMatiere).length,
    totalChapitres: cours.reduce((sum, c) => sum + (c.chapitres?.length || 0), 0),
    totalEtudiants: cours.reduce((sum, c) => sum + (c.etudiants?.length || 0), 0)
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 sm:mb-6 md:mb-8"
        >
          <motion.div
            className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4 md:mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpenCheck className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Star className={`w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Trophy className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 ${
              darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🎓 Mes Cours Magiques ✨
          </motion.h1>
          
          <motion.p 
            className={`text-sm sm:text-base md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 sm:mb-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🌟 Découvre les cours de ta classe créés par tes professeurs !
            {classeEtudiant && (
              <motion.span 
                className="block mt-2 font-semibold text-blue-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                🎓 Classe : {classeEtudiant}
              </motion.span>
            )}
          </motion.p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mb-6 sm:mb-8 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-4 sm:px-6 md:px-8 py-4 sm:py-6 font-bold text-base sm:text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white' 
              : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart3 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              <span className="uppercase tracking-wide text-sm sm:text-base">Statistiques</span>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.totalCours}
                </div>
                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Cours
                </div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.totalMatieres}
                </div>
                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Matières
                </div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {stats.totalChapitres}
                </div>
                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Chapitres
                </div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  {stats.totalEtudiants}
                </div>
                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Étudiants
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Search and Refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>
            
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                refreshing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105'
              }`}
              whileHover={!refreshing ? { scale: 1.05 } : {}}
              whileTap={!refreshing ? { scale: 0.95 } : {}}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              </motion.div>
              {refreshing ? "Actualisation..." : "Actualiser"}
            </motion.button>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center gap-3 max-w-md mx-auto text-sm sm:text-base"
            >
              <AlertCircle size={16} className="sm:w-5 sm:h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cours List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {Object.entries(filteredCoursGroupesParMatiere).map(([matiere, coursList], index) => (
            <motion.div
              key={matiere}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`rounded-xl sm:rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm overflow-hidden ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}
            >
              {/* Matière Header */}
              <div className={`px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${getMatiereColor(matiere)} text-white`}>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 bg-white/20 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getMatiereIcon(matiere)}
                  </motion.div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{matiere}</h3>
                    <p className="text-sm opacity-90">{coursList.length} cours</p>
                  </div>
                </div>
              </div>
              
              {/* Cours Cards */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {coursList.map((cours, coursIndex) => (
                    <CoursCard
                      key={cours._id || coursIndex}
                      cours={cours}
                      navigate={navigate}
                      formatDate={formatDate}
                      getMatiereNom={getMatiereNom}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CoursCard({ cours, navigate, formatDate, getMatiereNom, darkMode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/student/cours/${cours._id}`)}
      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm cursor-pointer transition-all duration-300 ${
        darkMode ? 'bg-gray-700/80 hover:bg-gray-600/80' : 'bg-white/80 hover:bg-white/90'
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <h4 className={`text-base sm:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {cours.nom || "Cours sans nom"}
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            {getMatiereNom(cours)}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </motion.div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {cours.teacher?.name || "Professeur non assigné"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Building className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {cours.classe || "Classe non définie"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <CalendarDays className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Créé le {formatDate(cours.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {cours.chapitres?.length || 0} chapitres
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {cours.etudiants?.length || 0} étudiants
          </span>
        </div>
      </div>
    </motion.div>
  );
}

