import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  BookOpen, 
  Star, 
  Lock, 
  Unlock, 
  Play, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  Gift,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trophy,
  Brain,
  Code,
  Palette,
  Music,
  Calculator,
  Globe,
  Heart,
  GraduationCap,
  Calendar
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// Mapping des icônes
const iconMapping = {
  Brain,
  Code,
  BookOpen,
  Palette,
  Music,
  Calculator,
  Globe,
  BookMarked: BookOpen
};

export default function Formations() {
  const { darkMode } = useContext(ThemeContext);
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("toutes");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Récupérer les formations depuis l'API
  const fetchFormations = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/students/formations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormations(response.data);
    } catch (err) {
      console.error("Erreur récupération formations:", err);
      setError("Impossible de charger les formations. Vérifiez votre connexion.");
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Filtrer les formations (pour les étudiants, toutes sont achetées)
  const filteredFormations = formations.filter(formation => {
    if (filter === "toutes") return true;
    if (filter === "achetees") return formation.statut === "achete";
    if (filter === "disponibles") return formation.statut === "disponible";
    return true;
  });

  const handleAcceder = async (formation) => {
    // Simulation d'accès pour les formations achetées
    alert(`🚀 Accès à la formation "${formation.titre}" !\n\nContenu de la formation :\n- Vidéos interactives\n- Exercices pratiques\n- Quiz d'évaluation\n- Support en ligne\n\nDate d'achat: ${new Date(formation.dateAchat).toLocaleDateString('fr-FR')}`);
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
          <p className={`font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Chargement de tes formations...</p>
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
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
            className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            🎓 Mes Formations Achetées
          </motion.h1>
          <motion.p
            className={`text-xl font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Accède aux formations que tes parents ont achetées pour toi ! ✨
          </motion.p>
        </motion.div>

        {/* Filtres simplifiés pour étudiants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {[
            { key: "toutes", label: "🌟 Toutes mes formations", icon: Sparkles },
            { key: "achetees", label: "✅ Formations achetées", icon: CheckCircle }
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                filter === filterOption.key
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : darkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <filterOption.icon className="w-5 h-5" />
              {filterOption.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Message d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl mb-6 text-center ${
              darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700'
            }`}
          >
            <p className="font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Grille des formations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFormations.length === 0 ? (
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
                🎓
              </motion.div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucune formation achetée
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tes parents n'ont pas encore acheté de formations pour toi. Demande-leur d'en acheter une ! 😊
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Tes parents peuvent acheter des formations dans leur espace parent</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Formations adaptées au niveau primaire (CP-CE2)</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            filteredFormations.map((formation, index) => {
              const IconComponent = iconMapping[formation.icon] || BookOpen;
              return (
                <motion.div
                  key={formation._id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${formation.bgCouleur || 'bg-white'} ${formation.borderCouleur || 'border-gray-200'} ${darkMode ? 'backdrop-blur-sm' : ''}`}
                >
                  {/* Header de la carte */}
                  <div className={`bg-gradient-to-r ${formation.couleur || 'from-blue-500 to-indigo-600'} p-6 text-white relative overflow-hidden`}>
                    <motion.div
                      className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{formation.titre}</h3>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formation.duree}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {formation.niveau}
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6">
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formation.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {formation.prix}€
                      </span>
                      <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        ✅ Achetée
                      </span>
                    </div>

                    {/* Date d'achat */}
                    {formation.dateAchat && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Calendar className="w-4 h-4" />
                          <span>Achetée le {new Date(formation.dateAchat).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    )}

                    {/* Bouton d'accès */}
                    <motion.button
                      onClick={() => handleAcceder(formation)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Accéder à la formation
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
