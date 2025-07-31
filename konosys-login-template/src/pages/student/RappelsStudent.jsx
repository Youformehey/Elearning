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
      <div className="min-h-screen bg-white flex items-center justify-center">
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
            Chargement de vos rappels...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Animations ultra attractives */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-10 h-10 bg-pink-100 rounded-full"
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
        className="absolute top-16 right-16 text-blue-400"
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
        <Bell size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-16 text-green-400"
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
        <CheckCircle size={28} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 text-purple-400"
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
        <Target size={24} />
      </motion.div>

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
            className="text-center mb-12"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl"
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
                  className="text-6xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🔔
                </motion.span>
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
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
                  🔔 Mes Rappels Magiques ✨
                </motion.h1>
                <motion.p 
                  className="text-xl sm:text-2xl font-medium text-gray-700"
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
                  🌟 Organise tes tâches et deviens un super élève !
                  {studentClasse && (
                    <motion.span
                      className="block mt-2 font-semibold text-blue-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      🎓 Classe : {studentClasse}
                    </motion.span>
                  )}
                </motion.p>
              </div>
            </motion.div>

            {/* Boutons d'action - Animations ultra attractives */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRappels}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <RefreshCw size={20} />
                </motion.div>
                🔄 Actualiser mes rappels
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Erreur */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 py-5 px-8 rounded-2xl mb-8 flex items-center justify-center gap-4 max-w-md mx-auto text-lg shadow-xl"
              >
                <AlertCircle size={24} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Statistiques - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              { 
                label: "Total Rappels", 
                count: allRappels.length, 
                color: "blue", 
                icon: "🔔",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600"
              },
              { 
                label: "Terminés", 
                count: allRappels.filter(r => r.fait).length, 
                color: "green", 
                icon: "✅",
                bgColor: "bg-green-100",
                textColor: "text-green-600"
              },
              { 
                label: "À faire", 
                count: allRappels.filter(r => !r.fait).length, 
                color: "orange", 
                icon: "⏰",
                bgColor: "bg-orange-100",
                textColor: "text-orange-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -8,
                  rotateY: [0, 5, 0],
                  rotateX: [0, 3, 0],
                }}
                className={`bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-400 to-indigo-500' : stat.color === 'green' ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500'} rounded-3xl p-6 text-white shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <motion.p 
                      className="text-3xl font-bold"
                      animate={{ 
                        scale: [1, 1.02, 1],
                        y: [0, -2, 0],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {stat.count}
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, 0, -10, 0],
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="text-3xl opacity-80"
                  >
                    {stat.icon}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filtres - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(147, 51, 234, 0.3)",
                    "0 20px 40px -10px rgba(236, 72, 153, 0.4)",
                    "0 10px 25px -5px rgba(147, 51, 234, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 hover:scale-105 hover:shadow-2xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Filter size={20} />
                </motion.div>
                Filtrer par prof
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="mt-6 p-6 bg-white/90 rounded-3xl shadow-2xl border-2 border-purple-200"
                >
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={() => filterByProf("tous")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                        selectedProf === "tous"
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl'
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
                        className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                          selectedProf === prof
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl'
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

          {/* Liste des rappels - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="space-y-6"
          >
            {rappels.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="text-6xl mb-6"
                >
                  🔔
                </motion.div>
                <p className="text-xl font-semibold text-gray-600">
                  Aucun rappel trouvé
                </p>
                <p className="text-gray-500">
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
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    rotateY: [0, 2, 0],
                  }}
                  className="rounded-3xl shadow-2xl border-2 overflow-hidden bg-white/90 border-blue-200"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-4 bg-purple-100 rounded-2xl"
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 8, 0, -8, 0],
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300,
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <motion.span 
                            className="text-3xl"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 12, 0, -12, 0],
                            }}
                            transition={{ 
                              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            {getIconForType(rappel.type || 'note')}
                          </motion.span>
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {rappel.texte}
                          </h3>
                          <p className="text-base text-gray-500">
                            Type: {rappel.type} • Classe: {rappel.classe}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={`text-base px-4 py-2 rounded-2xl font-bold border-2 ${getStatutColor(rappel.fait)}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          animate={{ 
                            scale: [1, 1.02, 1],
                            y: [0, -1, 0],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {getStatutIcon(rappel.fait)}
                          {getStatutText(rappel.fait)}
                        </motion.span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-base text-gray-600 mb-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span>{new Date(rappel.date).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          <span>Classe: {rappel.classe}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span>{rappel.professeur?.name || "Professeur"}</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => toggleFait(rappel._id)}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -3,
                        rotate: [0, 2, -2, 0],
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ 
                        boxShadow: [
                          "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                          "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                          "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                        ],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ 
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 text-lg shadow-xl ${
                        rappel.fait
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      }`}
                    >
                      {rappel.fait ? (
                        <>
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                            className="inline mr-3"
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                          Terminé !
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                            className="inline mr-3"
                          >
                            <Clock size={20} />
                          </motion.div>
                          Marquer comme terminé
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
