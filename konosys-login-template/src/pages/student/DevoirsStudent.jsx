import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  Trophy,
  BookOpen,
  GraduationCap,
  Building,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001/api";

export default function DevoirsStudent() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [course, setCourse] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCourse();
    fetchDevoirs();
  }, [courseId, token, navigate]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitDevoir = async (devoirId, courseId) => {
    if (!selectedFile) {
      setErrorMessage("Veuillez sélectionner un fichier");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("devoirId", devoirId);

      const res = await fetch(`${API_URL}/courses/${courseId}/devoirs/${devoirId}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la soumission");
      }

      const data = await res.json();
      setSuccessMessage("✅ Devoir soumis avec succès !");
      setSelectedFile(null);
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Recharger les devoirs pour voir les mises à jour
      fetchDevoirs();
    } catch (err) {
      setErrorMessage(`❌ Erreur: ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement du cours");
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevoirs = async () => {
    try {
      // Récupérer tous les cours de l'étudiant
      const coursesRes = await fetch(`${API_URL}/courses/student/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!coursesRes.ok) throw new Error("Erreur chargement cours");
      const courses = await coursesRes.json();
      
      // Récupérer les devoirs de tous les cours
      const allDevoirs = [];
      for (const course of courses) {
        try {
          const devoirsRes = await fetch(`${API_URL}/courses/${course._id}/devoirs`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (devoirsRes.ok) {
            const devoirs = await devoirsRes.json();
            // Ajouter les informations du cours à chaque devoir
            const devoirsWithCourse = devoirs.map(devoir => ({
              ...devoir,
              courseName: course.nom || course.matiere?.nom,
              courseId: course._id,
              teacherName: course.teacher?.name
            }));
            allDevoirs.push(...devoirsWithCourse);
          }
        } catch (err) {
          console.error(`Erreur chargement devoirs pour le cours ${course._id}:`, err);
        }
      }
      
      setDevoirs(allDevoirs);
    } catch (err) {
      console.error("Erreur chargement devoirs:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date inconnue";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'ppt':
      case 'pptx': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'xls':
      case 'xlsx': return <FileText className="w-5 h-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'mp4':
      case 'avi':
      case 'mov': return <FileText className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
    
  if (error)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header avec bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => navigate(`/student/cours/${courseId}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-lg`}
          >
            <ArrowLeft size={20} />
            Retour au cours
          </motion.button>
        </motion.div>

        {/* Messages de succès et d'erreur */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
            >
              {successMessage}
            </motion.div>
          )}
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-orange-600'
          }`}>
            📝 Devoirs à rendre
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {course?.matiere?.nom || "Matière"} — {course?.classe}
          </p>
        </motion.div>

        {/* Informations du cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mb-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-red-700 to-pink-700 text-white' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-900'
          }`}>
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${darkMode ? 'bg-red-600' : 'bg-red-500'}`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FileText className="text-white" size={24} />
              </motion.div>
              <span className="uppercase tracking-wide">Informations du cours</span>
            </div>
          </div>
          
          <div className="p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professeur :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course?.teacher?.name || "Non renseigné"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GraduationCap className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Classe :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course?.classe}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Date :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(course?.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Salle :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course?.salle || "Non définie"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des devoirs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-orange-700 to-red-700 text-white' 
              : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-900'
          }`}>
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${darkMode ? 'bg-orange-600' : 'bg-orange-500'}`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FileText className="text-white" size={24} />
              </motion.div>
              <span className="uppercase tracking-wide">Devoirs à rendre ({devoirs.length})</span>
            </div>
          </div>
          
          <div className="p-8">
            {devoirs.length > 0 ? (
              <div className="space-y-4">
                {devoirs.map((devoir, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-orange-600' : 'bg-orange-100'
                        }`}>
                          {getFileIcon(devoir.fileName)}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {devoir.fileName}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            📚 Cours: {devoir.courseName || "Cours inconnu"}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            👨‍🏫 Prof: {devoir.teacherName || "Professeur inconnu"}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            📅 Envoyé le {formatDate(devoir.dateEnvoi)}
                          </p>
                          {devoir.dateLimite && (
                            <p className={`text-sm mt-1 ${
                              darkMode ? 'text-yellow-300' : 'text-yellow-600'
                            }`}>
                              ⏰ Date limite : {formatDate(devoir.dateLimite)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => window.open(`http://localhost:5001${devoir.fileUrl}`, '_blank')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg ${
                            darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'
                          } text-white`}
                        >
                          <Download className="w-5 h-5" />
                        </motion.button>
                        
                        {/* Section soumission */}
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id={`submit-file-${devoir._id}`}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                          <label 
                            htmlFor={`submit-file-${devoir._id}`}
                            className={`cursor-pointer p-3 rounded-lg ${
                              darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                          >
                            <Upload className="w-5 h-5" />
                          </label>
                          
                          {selectedFile && (
                            <motion.button
                              onClick={() => handleSubmitDevoir(devoir._id, devoir.courseId)}
                              disabled={submitting}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-3 rounded-lg ${
                                submitting 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : darkMode 
                                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                                    : 'bg-emerald-500 hover:bg-emerald-600'
                              } text-white`}
                            >
                              {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                      
                      {/* Affichage du fichier sélectionné */}
                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-3 p-3 rounded-lg ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            📎 Fichier sélectionné: <strong>{selectedFile.name}</strong>
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-300'
                }`} />
                <p className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Aucun devoir disponible pour le moment
                </p>
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Les devoirs apparaîtront ici quand ils seront ajoutés par votre professeur
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 