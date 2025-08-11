import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User2,
  FolderKanban,
  BookOpenText,
  BarChart3,
  ArrowLeft,
  FileText,
  FolderOpen,
  FileQuestion,
  Users,
  Building,
  GraduationCap,
  MessageCircle,
  Eye,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  TrendingUp,
  BarChart3 as BarChart3Icon,
  Calculator,
  Sparkles,
  Zap,
  Trophy
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001/api";

export default function CoursStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [course, setCourse] = useState(null);
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseStats, setCourseStats] = useState({});

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCourse();
    fetchRappels();
  }, [id, token, navigate]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement du cours");
      const data = await res.json();
      setCourse(data);
      
      // Calculer les statistiques du cours
      setCourseStats({
        totalChapitres: data.chapitres?.length || 0,
        totalStudents: data.etudiants?.length || 0,
        totalDevoirs: data.devoirs?.length || 0,
        totalDocuments: data.documents?.length || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRappels = async () => {
    try {
      const res = await fetch(`${API_URL}/rappels/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur chargement rappels");
      const data = await res.json();
      setRappels(data);
    } catch (err) {
      console.error(err);
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
      case 'mov': return <Play className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div
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
    
  if (!course)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Cours introuvable</p>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div> */}

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header avec bouton retour */}
        <div
          className="mb-8"
        >
          <button
            onClick={() => navigate("/student/cours")}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-lg`}
          >
            <ArrowLeft size={20} />
            Retour aux cours
          </button>
        </div>

        {/* Titre principal */}
        <div
          className="text-center mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
          }`}>
            📚 {course.matiere?.nom || "Matière inconnue"}
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {course.nom || course.matiere?.nom} — {course.classe}
          </p>
        </div>

        {/* Statistiques du cours */}
        <div
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
              <div
                className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
              >
                <BarChart3 className="text-white" size={24} />
              </div>
              <span className="uppercase tracking-wide">Statistiques du cours</span>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div 
                className="text-center"
              >
                <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {courseStats.totalChapitres}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Chapitres
                </div>
              </div>
              <div 
                className="text-center"
              >
                <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {courseStats.totalStudents}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Étudiants
                </div>
              </div>
              <div 
                className="text-center"
              >
                <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {courseStats.totalDevoirs}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Devoirs
                </div>
              </div>
              <div 
                className="text-center"
              >
                <div className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {courseStats.totalDocuments}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                  Documents
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations du cours */}
        <div
          className={`mb-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-green-700 to-emerald-700 text-white' 
              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900'
          }`}>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${darkMode ? 'bg-green-600' : 'bg-green-500'}`}
              >
                <User2 className="text-white" size={24} />
              </div>
              <span className="uppercase tracking-wide">Informations du cours</span>
            </div>
          </div>
          
          <div className="p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User2 className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Professeur :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course.teacher?.name || "Non renseigné"}
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
                    {course.classe}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CalendarDays className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Date :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(course.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Horaire :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course.horaire || "Inconnu"}
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
                    {course.salle || "Non définie"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className={`${darkMode ? 'text-pink-400' : 'text-pink-600'}`} size={20} />
                <div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Groupe :
                  </span>
                  <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course.groupe || "Non défini"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => navigate(`/student/cours/forum/${course._id}`)}
              className={`p-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              <MessageCircle size={32} />
              <span>Forum</span>
            </button>
            
            <button
              onClick={() => navigate(`/student/cours/quiz/${course._id}`)}
              className={`p-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
              }`}
            >
              <FileQuestion size={32} />
              <span>Quiz</span>
            </button>
            
            <button
              onClick={() => navigate(`/student/cours/devoirs/${course._id}`)}
              className={`p-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}
            >
              <FileText size={32} />
              <span>Devoir à rendre</span>
            </button>
            
            <button
              onClick={() => navigate(`/student/documents-cours/${course._id}`)}
              className={`p-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              }`}
            >
              <FolderKanban size={32} />
              <span>Documents</span>
            </button>
            
            <button
              onClick={() => navigate(`/student/planning`)}
              className={`p-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              }`}
            >
              <CalendarDays size={32} />
              <span>Planning</span>
            </button>
          </div>
        </div>

        {/* Chapitres */}
        <div
          className={`mb-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white' 
              : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900'
          }`}>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'}`}
              >
                <FolderOpen className="text-white" size={24} />
              </div>
              <span className="uppercase tracking-wide">Chapitres ({course.chapitres?.length || 0})</span>
            </div>
          </div>
          
          <div className="p-8">
            {course.chapitres?.length > 0 ? (
              <div className="space-y-4">
                {course.chapitres.map((chap, index) => (
                  <div
                    key={chap._id}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-indigo-600' : 'bg-indigo-100'
                        }`}>
                          <FolderOpen className={`w-6 h-6 ${
                            darkMode ? 'text-white' : 'text-indigo-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {chap.titre}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {chap.description || "Pas de description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          Ordre: {chap.order}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-300'
                }`} />
                <p className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Pas encore de chapitres disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Devoirs */}
        <div
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
              <div
                className={`p-2 rounded-lg ${darkMode ? 'bg-red-600' : 'bg-red-500'}`}
              >
                <FileText className="text-white" size={24} />
              </div>
              <span className="uppercase tracking-wide">Devoirs à rendre ({course.devoirs?.length || 0})</span>
            </div>
          </div>
          
          <div className="p-8">
            {course.devoirs?.length > 0 ? (
              <div className="space-y-4">
                {course.devoirs.map((devoir, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-red-600' : 'bg-red-100'
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
                            Envoyé le {formatDate(devoir.dateEnvoi)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(`http://localhost:5001${devoir.fileUrl}`, '_blank')}
                        className={`p-3 rounded-lg ${
                          darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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
                  Aucun devoir disponible
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rappels du professeur */}
        <div
          className={`rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-700 to-orange-700 text-white' 
              : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900'
          }`}>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-600' : 'bg-yellow-500'}`}
              >
                <AlertCircle className="text-white" size={24} />
              </div>
              <span className="uppercase tracking-wide">Rappels du professeur ({rappels.length})</span>
            </div>
          </div>
          
          <div className="p-8">
            {rappels.length > 0 ? (
              <div className="space-y-4">
                {rappels.map((rappel, index) => (
                  <div
                    key={rappel._id}
                    className={`p-6 rounded-xl border ${
                      darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        darkMode ? 'bg-yellow-600' : 'bg-yellow-100'
                      }`}>
                        <AlertCircle className={`w-6 h-6 ${
                          darkMode ? 'text-white' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-lg ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {rappel.message || rappel.texte}
                        </p>
                        <p className={`text-sm mt-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <em>Date limite : {formatDate(rappel.dateLimite || rappel.date)}</em>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-300'
                }`} />
                <p className={`text-lg ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Aucun rappel pour ce cours
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
