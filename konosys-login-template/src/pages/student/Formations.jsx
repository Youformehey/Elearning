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
  Calendar,
  Rocket,
  Target,
  Zap,
  Smile
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// Mapping des icônes avec plus de variété enfantine
const iconMapping = {
  Brain,
  Code,
  BookOpen,
  Palette,
  Music,
  Calculator,
  Globe,
  BookMarked: BookOpen,
  Rocket,
  Target,
  Zap,
  Smile
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
  const [showConfetti, setShowConfetti] = useState(false);

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
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Simulation d'accès pour les formations achetées avec message plus amusant
    const messages = [
      `🎉 Super ! Tu accèdes à "${formation.titre}" !`,
      `🚀 Décollage vers l'apprentissage !`,
      `✨ Prépare-toi pour une aventure magique !`,
      `🌟 Tu vas devenir un(e) expert(e) !`
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    alert(`${randomMessage}\n\n📚 Contenu de la formation :\n🎬 Vidéos interactives et amusantes\n🎯 Exercices pratiques et ludiques\n🧩 Quiz d'évaluation rigolos\n💬 Support en ligne avec tes amis\n\n📅 Achetée le ${new Date(formation.dateAchat).toLocaleDateString('fr-FR')}\n\n🎊 Bon apprentissage !`);
  };

  // Composant Confetti
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 7)]
          }}
          initial={{ y: -10, opacity: 1, scale: 0 }}
          animate={{ 
            y: window.innerHeight + 10, 
            opacity: [1, 1, 0], 
            scale: [0, 1, 0],
            x: Math.random() * 200 - 100
          }}
          transition={{ 
            duration: 3, 
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full" />
            <motion.div
              className="absolute inset-0 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6"
          >
            <p className="text-xl font-bold text-purple-600">
              🎓 Chargement de tes formations...
            </p>
            <p className="text-sm text-purple-500">
              Prépare-toi pour l'aventure ! ✨
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements - Animations ultra attractives */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 sm:w-20 sm:h-20 bg-purple-200 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-200 rounded-full"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-14 h-14 bg-blue-300 rounded-full"
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
        className="absolute top-16 right-16 text-blue-500"
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
        <BookOpen size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-16 text-purple-500"
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
        <Award size={36} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 text-indigo-500"
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
        <Trophy size={32} />
      </motion.div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

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
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl"
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
                    className="text-8xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    🎓
                  </motion.span>
                </motion.div>
                <div className="text-center sm:text-left">
                  <motion.h1 
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
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
                    Mes Formations Magiques ✨
                  </motion.h1>
                  <motion.p 
                    className="text-xl sm:text-2xl font-medium text-purple-700"
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
                    🌟 Découvre les formations que tes parents ont achetées pour toi ! 🚀
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Filtres avec plus d'animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {[
              { key: "toutes", label: "🌟 Toutes mes formations", icon: Sparkles, color: "from-blue-500 to-purple-600" },
              { key: "achetees", label: "✅ Formations achetées", icon: CheckCircle, color: "from-green-500 to-emerald-600" }
            ].map((filterOption, index) => (
              <motion.button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                  filter === filterOption.key
                    ? `bg-gradient-to-r ${filterOption.color} text-white shadow-xl`
                    : 'bg-white/90 text-gray-700 hover:bg-white shadow-md border-2 border-blue-200'
                }`}
              >
                <motion.div
                  animate={filter === filterOption.key ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <filterOption.icon className="w-8 h-8" />
                </motion.div>
                <span className="text-lg">{filterOption.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Message d'erreur avec style plus amusant */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl mb-6 text-center border-2 bg-red-100 text-red-700 border-red-300"
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <AlertCircle className="w-8 h-8" />
                </motion.div>
                <p className="font-semibold text-lg">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Grille des formations avec plus d'animations */}
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
                className="col-span-full text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🎓
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold mb-4 text-purple-600"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Aucune formation achetée encore
                </motion.h2>
                <motion.p
                  className="text-lg mb-8 text-purple-500"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tes parents n'ont pas encore acheté de formations pour toi. 
                  <br />Demande-leur d'en acheter une ! 😊
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-200"
                  >
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-700 font-medium text-lg">
                      Tes parents peuvent acheter des formations dans leur espace parent
                    </span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200"
                  >
                    <Star className="w-8 h-8 text-green-600" />
                    <span className="text-green-700 font-medium text-lg">
                      Formations adaptées au niveau primaire (CP-CE2)
                    </span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200"
                  >
                    <Heart className="w-8 h-8 text-purple-600" />
                    <span className="text-purple-700 font-medium text-lg">
                      Apprentissage ludique et amusant ! 🎮
                    </span>
                  </motion.div>
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
                    whileHover={{ scale: 1.03, y: -8, rotate: 1 }}
                    className="rounded-3xl shadow-2xl border-2 overflow-hidden bg-white/90 backdrop-blur-sm border-blue-200 relative group"
                  >
                    {/* Effet de brillance au survol */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Header de la carte avec plus d'animations */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                      <motion.div
                        className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <IconComponent className="w-10 h-10" />
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                      </div>
                      <motion.h3 
                        className="text-xl font-bold mb-2"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {formation.titre}
                      </motion.h3>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Clock className="w-5 h-5" />
                          {formation.duree}
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="w-5 h-5" />
                          {formation.niveau}
                        </motion.div>
                      </div>
                    </div>

                    {/* Contenu de la carte */}
                    <div className="p-6">
                      <p className="text-sm mb-4 text-gray-600">
                        {formation.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <motion.span 
                          className="text-2xl font-bold text-blue-600"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {formation.prix}€
                        </motion.span>
                        <motion.span 
                          className="text-sm px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium border-2 border-green-200"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✅ Achetée
                        </motion.span>
                      </div>

                      {/* Date d'achat avec animation */}
                      {formation.dateAchat && (
                        <motion.div 
                          className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2 text-sm text-blue-700">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Calendar className="w-5 h-5" />
                            </motion.div>
                            <span>Achetée le {new Date(formation.dateAchat).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Bouton d'accès avec plus d'animations */}
                      <motion.button
                        onClick={() => handleAcceder(formation)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 border-2 border-green-400"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Play className="w-8 h-8" />
                        </motion.div>
                        <span className="text-lg">🚀 Accéder à la formation</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}