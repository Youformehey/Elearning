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
  Users,
  X,
  Eye
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
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [homeworkSubmissions, setHomeworkSubmissions] = useState({});
  const [showSubmissionsFor, setShowSubmissionsFor] = useState(null);
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [showDevoirDetails, setShowDevoirDetails] = useState(false);

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

  // Fonction pour récupérer les cours du professeur qui a uploadé les devoirs
  const fetchTeacherCourses = async (teacherEmail) => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser la même route que GererDevoirs pour récupérer les cours du professeur
      const res = await fetch(`${API_URL}/courses/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error("Erreur chargement cours du professeur");
      }
      
      const data = await res.json();
      const courses = Array.isArray(data) ? data : [];
      
      // Filtrer les cours du professeur spécifique
      const teacherCourses = courses.filter(course => 
        course?.teacher?.email === teacherEmail
      );
      
      setTeacherCourses(teacherCourses);
      console.log("Cours du professeur récupérés:", teacherCourses);
      
      // Charger les devoirs pour chaque cours du professeur
      const allDevoirs = [];
      for (const course of teacherCourses) {
        try {
          const devoirsRes = await fetch(`${API_URL}/courses/${course._id}/devoirs`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (devoirsRes.ok) {
            const devoirs = await devoirsRes.json();
            const devoirsWithCourse = devoirs.map(devoir => ({
              ...devoir,
              courseName: course.nom || course.matiere?.nom,
              courseId: course._id,
              teacherName: course.teacher?.name,
              teacherEmail: course.teacher?.email,
              courseClasse: course.classe,
              courseSemestre: course.semestre
            }));
            allDevoirs.push(...devoirsWithCourse);
          }
        } catch (err) {
          console.error(`Erreur chargement devoirs pour le cours ${course._id}:`, err);
        }
      }
      
      // Mettre à jour les devoirs avec ceux du professeur
      setDevoirs(prevDevoirs => {
        const existingDevoirs = prevDevoirs.filter(devoir => 
          !teacherCourses.some(course => course._id === devoir.courseId)
        );
        return [...existingDevoirs, ...allDevoirs];
      });
      
    } catch (err) {
      console.error("Erreur chargement cours du professeur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les soumissions d'un devoir (similaire à GererDevoirs)
  const loadHomeworkSubmissions = async (courseId, devoirId) => {
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/devoirs/${devoirId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Erreur chargement soumissions");
      const submissions = await res.json();
      console.log("Soumissions récupérées:", submissions);
      
      // Stocker les soumissions dans l'état
      setHomeworkSubmissions(prev => ({
        ...prev,
        [`${courseId}-${devoirId}`]: submissions
      }));
      
      return submissions;
    } catch (err) {
      console.error("Erreur chargement soumissions:", err);
      return [];
    }
  };

  // Fonction pour voir les détails d'un devoir
  const handleVoirDetails = async (devoir) => {
    try {
      setSelectedDevoir(devoir);
      setShowDevoirDetails(true);
      
      const submissions = await loadHomeworkSubmissions(devoir.courseId, devoir._id);
      console.log(`Détails du devoir ${devoir.fileName}:`, {
        devoir,
        submissions,
        courseInfo: teacherCourses.find(c => c._id === devoir.courseId)
      });
    } catch (err) {
      console.error("Erreur affichage détails:", err);
    }
  };

  // Fonction pour fermer les détails
  const handleCloseDetails = () => {
    setShowDevoirDetails(false);
    setSelectedDevoir(null);
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
              teacherName: course.teacher?.name,
              teacherEmail: course.teacher?.email
            }));
            allDevoirs.push(...devoirsWithCourse);
          }
        } catch (err) {
          console.error(`Erreur chargement devoirs pour le cours ${course._id}:`, err);
        }
      }
      
      setDevoirs(allDevoirs);
      
      // Récupérer les cours du professeur qui a uploadé des devoirs
      if (allDevoirs.length > 0) {
        const teacherEmails = [...new Set(allDevoirs.map(devoir => devoir.teacherEmail).filter(Boolean))];
        for (const teacherEmail of teacherEmails) {
          await fetchTeacherCourses(teacherEmail);
        }
      }
    } catch (err) {
      console.error("Erreur chargement devoirs:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date inconnue";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  // Fonction pour calculer les statistiques des devoirs du professeur
  const getTeacherStats = () => {
    if (teacherCourses.length === 0) return null;
    
    const teacherDevoirs = devoirs.filter(devoir => 
      teacherCourses.some(course => course._id === devoir.courseId)
    );
    
    const totalStudents = teacherCourses.reduce((total, course) => 
      total + (course.etudiants?.length || 0), 0
    );
    
    const devoirsParCours = teacherCourses.map(course => {
      const courseDevoirs = devoirs.filter(devoir => devoir.courseId === course._id);
      return {
        courseName: course.nom || course.matiere?.nom,
        classe: course.classe,
        devoirsCount: courseDevoirs.length,
        courseId: course._id
      };
    });
    
    return {
      totalCourses: teacherCourses.length,
      totalStudents,
      totalDevoirs: teacherDevoirs.length,
      activityRate: teacherCourses.length > 0 ? Math.round((teacherDevoirs.length / teacherCourses.length) * 100) : 0,
      devoirsParCours
    };
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

        {/* Cours du professeur qui a uploadé les devoirs */}
        {teacherCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mb-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
              darkMode ? 'bg-gray-800/80' : 'bg-white/80'
            }`}
          >
            <div className={`px-8 py-6 font-bold text-lg ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900'
            }`}>
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="text-white" size={24} />
                </motion.div>
                <span className="uppercase tracking-wide">Cours du professeur ({teacherCourses.length})</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherCourses.map((course, index) => {
                  const courseDevoirs = devoirs.filter(devoir => devoir.courseId === course._id);
                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border ${
                        darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                      } hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-blue-600' : 'bg-blue-100'
                        }`}>
                          <BookOpen className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {course.nom || course.matiere?.nom}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {course.classe} - {course.semestre}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {formatDate(course.date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {course.horaire}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Building className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {course.salle || "Salle non définie"}
                          </span>
                        </div>
                      </div>

                      {/* Statistiques du cours */}
                      <div className={`p-3 rounded-lg ${
                        darkMode ? 'bg-gray-600/50' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            📚 Devoirs disponibles
                          </span>
                          <span className={`text-lg font-bold ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {courseDevoirs.length}
                          </span>
                        </div>
                        
                        {course.etudiants && (
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-sm font-semibold ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              👥 Étudiants inscrits
                            </span>
                            <span className={`text-lg font-bold ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                              {course.etudiants.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

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
                          title="Télécharger le devoir"
                        >
                          <Download className="w-5 h-5" />
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleVoirDetails(devoir)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg ${
                            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                          } text-white`}
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5" />
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
                            title="Sélectionner un fichier"
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
                              title="Soumettre le devoir"
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

        {/* Statistiques des cours du professeur */}
        {teacherCourses.length > 0 && (() => {
          const stats = getTeacherStats();
          if (!stats) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`mt-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
                darkMode ? 'bg-gray-800/80' : 'bg-white/80'
              }`}
            >
              <div className={`px-8 py-6 font-bold text-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-700 to-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900'
              }`}>
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`p-2 rounded-lg ${darkMode ? 'bg-green-600' : 'bg-green-500'}`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BarChart3 className="text-white" size={24} />
                  </motion.div>
                  <span className="uppercase tracking-wide">Statistiques détaillées du professeur</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`p-6 rounded-xl text-center ${
                      darkMode ? 'bg-gray-700/50' : 'bg-white'
                    } border border-gray-200`}
                  >
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    } flex items-center justify-center`}>
                      <BookOpen className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalCourses}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Cours total
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className={`p-6 rounded-xl text-center ${
                      darkMode ? 'bg-gray-700/50' : 'bg-white'
                    } border border-gray-200`}
                  >
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 ${
                      darkMode ? 'bg-green-600' : 'bg-green-100'
                    } flex items-center justify-center`}>
                      <Users className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-green-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalStudents}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Étudiants total
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                    className={`p-6 rounded-xl text-center ${
                      darkMode ? 'bg-gray-700/50' : 'bg-white'
                    } border border-gray-200`}
                  >
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 ${
                      darkMode ? 'bg-purple-600' : 'bg-purple-100'
                    } flex items-center justify-center`}>
                      <FileText className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalDevoirs}
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Devoirs uploadés
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    className={`p-6 rounded-xl text-center ${
                      darkMode ? 'bg-gray-700/50' : 'bg-white'
                    } border border-gray-200`}
                  >
                    <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 ${
                      darkMode ? 'bg-orange-600' : 'bg-orange-100'
                    } flex items-center justify-center`}>
                      <Trophy className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-orange-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.activityRate}%
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Taux d'activité
                    </p>
                  </motion.div>
                </div>

                {/* Détail par cours */}
                <div className="mt-8">
                  <h4 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    📊 Répartition des devoirs par cours
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.devoirsParCours.map((course, index) => (
                      <motion.div
                        key={course.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className={`p-4 rounded-xl ${
                          darkMode ? 'bg-gray-700/50' : 'bg-white'
                        } border border-gray-200`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className={`font-semibold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {course.courseName}
                          </h5>
                          <span className={`text-lg font-bold ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {course.devoirsCount}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {course.classe}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })(        )}

        {/* Modal pour les détails du devoir */}
        {showDevoirDetails && selectedDevoir && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la modal */}
              <div className={`px-8 py-6 border-b ${
                darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {selectedDevoir.fileName}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Cours: {selectedDevoir.courseName} - {selectedDevoir.courseClasse}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleCloseDetails}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                  </motion.button>
                </div>
              </div>

              {/* Contenu de la modal */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informations du devoir */}
                  <div>
                    <h4 className={`text-xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      📋 Informations du devoir
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <span className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Date d'envoi:
                          </span>
                          <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                            {formatDate(selectedDevoir.dateEnvoi)}
                          </p>
                        </div>
                      </div>
                      
                      {selectedDevoir.dateLimite && (
                        <div className="flex items-center gap-3">
                          <Clock className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          <div>
                            <span className={`text-sm font-semibold ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Date limite:
                            </span>
                            <p className={darkMode ? 'text-yellow-300' : 'text-yellow-600'}>
                              {formatDate(selectedDevoir.dateLimite)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <User className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <span className={`text-sm font-semibold ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Professeur:
                          </span>
                          <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                            {selectedDevoir.teacherName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className={`text-xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      ⚡ Actions
                    </h4>
                    <div className="space-y-4">
                      <motion.button
                        onClick={() => window.open(`http://localhost:5001${selectedDevoir.fileUrl}`, '_blank')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-4 rounded-xl font-semibold ${
                          darkMode 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Download className="w-5 h-5" />
                          <span>Télécharger le devoir</span>
                        </div>
                      </motion.button>
                      
                      <div className={`p-4 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <h5 className={`font-semibold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          📎 Soumettre votre travail
                        </h5>
                        <div className="space-y-3">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="modal-submit-file"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                          <label 
                            htmlFor="modal-submit-file"
                            className={`block w-full py-2 px-4 rounded-lg cursor-pointer text-center ${
                              darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {selectedFile ? `Fichier sélectionné: ${selectedFile.name}` : "Sélectionner un fichier"}
                          </label>
                          
                          {selectedFile && (
                            <motion.button
                              onClick={() => {
                                handleSubmitDevoir(selectedDevoir._id, selectedDevoir.courseId);
                                handleCloseDetails();
                              }}
                              disabled={submitting}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full py-2 px-4 rounded-lg font-semibold ${
                                submitting 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : darkMode 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              {submitting ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Soumission en cours...</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5" />
                                  <span>Soumettre le devoir</span>
                                </div>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 