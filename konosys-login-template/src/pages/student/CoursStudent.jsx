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
  AlertCircle,
  Target,
  Play,
  CheckCircle,
  XCircle
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
  const [quizData, setQuizData] = useState({});
  const [quizLoading, setQuizLoading] = useState({});

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

  // Fonction pour récupérer les quiz d'un cours
  const fetchQuizForCourse = async (courseId) => {
    if (quizLoading[courseId]) return;
    
    setQuizLoading(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/chapitres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const chapitres = await response.json();
        const quizPromises = chapitres.map(async (chapitre) => {
          try {
            const quizResponse = await fetch(`${API_URL}/api/quiz/chapitre/${chapitre._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (quizResponse.ok) {
              const quizData = await quizResponse.json();
              return {
                chapitreId: chapitre._id,
                chapitreName: chapitre.titre,
                quiz: quizData.exists ? quizData.quiz : null
              };
            }
            return null;
          } catch (error) {
            console.error(`Erreur quiz pour chapitre ${chapitre._id}:`, error);
            return null;
          }
        });
        
        const quizResults = await Promise.all(quizPromises);
        const validQuizzes = quizResults.filter(result => result && result.quiz);
        
        setQuizData(prev => ({ ...prev, [courseId]: validQuizzes }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des quiz:", error);
    } finally {
      setQuizLoading(prev => ({ ...prev, [courseId]: false }));
    }
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
        <BookOpenCheck size={32} />
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
        <Star size={28} />
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
        <Trophy size={24} />
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
                  type: "tween", 
                  duration: 4,
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
                  📚
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
                  🎓 Mes Cours Magiques ✨
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
              </div>
            </motion.div>
          </motion.div>

          {/* Statistiques - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12 rounded-3xl shadow-2xl border-2 border-blue-200 bg-blue-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
              <div className="flex items-center gap-6">
                <motion.div
                  className="p-4 bg-white/20 rounded-2xl"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  animate={{ 
                    boxShadow: [
                      "0 10px 25px -5px rgba(255, 255, 255, 0.1)",
                      "0 20px 40px -10px rgba(255, 255, 255, 0.2)",
                      "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                    ],
                    scale: [1, 1.05, 1],
                    rotate: [0, 8, 0, -8, 0],
                  }}
                  transition={{ 
                    type: "tween", 
                    duration: 4,
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <motion.span 
                    className="text-4xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 12, 0, -12, 0],
                    }}
                    transition={{ 
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    📊
                  </motion.span>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white">📊 Statistiques</h3>
                  <p className="text-white/90 text-lg">Vue d'ensemble de tes cours</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
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
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                    {stats.totalCours}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Cours
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
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
                  <div className="text-3xl sm:text-4xl font-bold text-green-600">
                    {stats.totalMatieres}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Matières
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
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
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                    {stats.totalChapitres}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Chapitres
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
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
                  <div className="text-3xl sm:text-4xl font-bold text-pink-600">
                    {stats.totalEtudiants}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Étudiants
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Search and Refresh - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 text-base focus:border-blue-500 transition-all duration-300 bg-white"
                />
              </div>
              
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 text-base shadow-xl ${
                  refreshing 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl'
                }`}
                whileHover={!refreshing ? { 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                } : {}}
                whileTap={!refreshing ? { scale: 0.95 } : {}}
                animate={!refreshing ? { 
                  boxShadow: [
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: refreshing ? 1 : 2, 
                    repeat: Infinity, 
                    ease: refreshing ? "linear" : "easeInOut" 
                  }}
                >
                  <RefreshCw size={20} />
                </motion.div>
                {refreshing ? "Actualisation..." : "🔄 Actualiser"}
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
                className="bg-red-50 border-2 border-red-200 text-red-700 py-5 px-8 rounded-2xl mb-8 flex items-center justify-center gap-4 max-w-md mx-auto text-lg shadow-xl"
              >
                <AlertCircle size={24} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cours List - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-8"
          >
            {Object.entries(filteredCoursGroupesParMatiere).map(([matiere, coursList], index) => (
              <motion.div
                key={matiere}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-3xl shadow-2xl border-2 border-white/30 backdrop-blur-sm overflow-hidden bg-white/90"
              >
                {/* Matière Header */}
                <div className={`px-8 py-6 bg-gradient-to-r ${getMatiereColor(matiere)} text-white`}>
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="p-4 bg-white/20 rounded-2xl"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      animate={{ 
                        boxShadow: [
                          "0 10px 25px -5px rgba(255, 255, 255, 0.1)",
                          "0 20px 40px -10px rgba(255, 255, 255, 0.2)",
                          "0 10px 25px -5px rgba(255, 255, 255, 0.1)"
                        ],
                        scale: [1, 1.05, 1],
                        rotate: [0, 8, 0, -8, 0],
                      }}
                      transition={{ 
                        type: "tween", 
                        duration: 4,
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
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
                        {getMatiereIcon(matiere)}
                      </motion.span>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold">{matiere}</h3>
                      <p className="text-lg opacity-90">{coursList.length} cours</p>
                    </div>
                  </div>
                </div>
                
                {/* Cours Cards */}
                <div className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coursList.map((cours, coursIndex) => (
                      <CoursCard
                        key={cours._id || coursIndex}
                        cours={cours}
                        navigate={navigate}
                        formatDate={formatDate}
                        getMatiereNom={getMatiereNom}
                        darkMode={darkMode}
                        fetchQuizForCourse={fetchQuizForCourse}
                        quizData={quizData}
                        quizLoading={quizLoading}
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
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function CoursCard({ cours, navigate, formatDate, getMatiereNom, darkMode, fetchQuizForCourse, quizData, quizLoading }) {
  const [showQuizzes, setShowQuizzes] = useState(false);
  
  const handleQuizClick = (e, chapitreId) => {
    e.stopPropagation();
    navigate(`/student/quiz/${chapitreId}`);
  };

  const handleToggleQuizzes = (e) => {
    e.stopPropagation();
    if (!showQuizzes && !quizData[cours._id]) {
      fetchQuizForCourse(cours._id);
    }
    setShowQuizzes(!showQuizzes);
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        rotateY: [0, 5, 0],
        rotateX: [0, 3, 0],
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/student/cours/${cours._id}`)}
      className="p-6 rounded-3xl shadow-2xl border-2 border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300 bg-white/90 hover:bg-white/95"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-2 text-gray-800">
            {cours.nom || "Cours sans nom"}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            {getMatiereNom(cours)}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 15 }}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            type: "tween", 
            duration: 4,
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <ArrowRight className="w-6 h-6 text-blue-600" />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {cours.teacher?.name || "Professeur non assigné"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Building className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {cours.classe || "Classe non définie"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            Créé le {formatDate(cours.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {cours.chapitres?.length || 0} chapitres
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {cours.etudiants?.length || 0} étudiants
          </span>
        </div>
        
        {/* Section Quiz */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <motion.button
            onClick={handleToggleQuizzes}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-red-100 hover:from-pink-200 hover:to-red-200 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 rounded-lg bg-pink-200"
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                 transition={{ 
                  type: "tween", 
                  duration: 2,
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Target className="w-5 h-5 text-pink-600" />
              </motion.div>
              <div className="text-left">
                <span className="font-bold text-sm text-pink-700">
                  🎯 Quiz disponibles
                </span>
                <div className="text-xs text-pink-600">
                  {quizData[cours._id] ? `${quizData[cours._id].length} quiz trouvé(s)` : 'Cliquez pour voir les quiz'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {quizData[cours._id] && quizData[cours._id].length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 rounded-full text-xs font-bold bg-pink-500 text-white"
                >
                  {quizData[cours._id].length}
                </motion.div>
              )}
              <motion.div
                animate={{ rotate: showQuizzes ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-lg bg-pink-200"
              >
                <ArrowRight className="w-4 h-4 text-pink-600" />
              </motion.div>
            </div>
          </motion.button>
          
          {/* Liste des quiz */}
          <AnimatePresence>
            {showQuizzes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {quizLoading[cours._id] ? (
                  <div className="flex items-center justify-center py-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : quizData[cours._id] && quizData[cours._id].length > 0 ? (
                  quizData[cours._id].map((quizInfo, index) => (
                    <motion.div
                      key={quizInfo.chapitreId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              className="p-2 rounded-lg bg-pink-200"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 2, -2, 0]
                              }}
                              transition={{ 
                                type: "tween", 
                                duration: 2,
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                              }}
                            >
                              <Target className="w-4 h-4 text-pink-600" />
                            </motion.div>
                            <h5 className="font-bold text-sm text-pink-800">
                              {quizInfo.chapitreName}
                            </h5>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-pink-600">
                              <FileText className="w-3 h-3" />
                              <span>{quizInfo.quiz.questions?.length || 0} questions</span>
                            </div>
                            <div className="flex items-center gap-1 text-pink-600">
                              <Clock className="w-3 h-3" />
                              <span>~{Math.ceil((quizInfo.quiz.questions?.length || 0) * 1.5)} min</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={(e) => handleQuizClick(e, quizInfo.chapitreId)}
                          whileHover={{ scale: 1.1, y: -2, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ type: "tween", duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Play className="w-4 h-4" />
                          </motion.div>
                          <span className="text-xs font-bold">JOUER</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        type: "tween",
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="w-12 h-12 mx-auto mb-3 p-3 rounded-full bg-gray-200"
                    >
                      <Target className="w-6 h-6 text-gray-500" />
                    </motion.div>
                    <h4 className="font-semibold text-sm mb-1 text-gray-600">
                      Aucun quiz disponible
                    </h4>
                    <p className="text-xs text-gray-500">
                      Les quiz apparaîtront ici quand ils seront créés
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

