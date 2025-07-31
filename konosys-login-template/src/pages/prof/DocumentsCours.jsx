import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  FileImage,
  FileVideo2,
  FileArchive,
  FileCheck,
  DownloadCloud,
  BookOpenCheck,
  ArrowLeft,
  FileType,
  Film,
  Image as ImgIcon,
  Archive,
  Youtube,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  Building,
  Users,
  GraduationCap,
  Sparkles,
  Zap,
  Trophy,
  Star,
  RefreshCw,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentsCours() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const teacherEmail = userInfo?.email;

  // Charger les cours du prof
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const profCourses = (data.courses || []).filter(
          (course) => course?.teacher?.email === teacherEmail
        );
        setCourses(profCourses);
        setSuccessMessage("✅ Cours chargés avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Erreur chargement cours:", err);
        setError("Impossible de charger les cours.");
        setErrorMessage("❌ Erreur lors du chargement des cours");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API_URL, token, teacherEmail]);

  // Charger les documents quand selectedCourse change
  useEffect(() => {
    if (!selectedCourse) return setDocuments([]);
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/documents/course/${selectedCourse._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur chargement documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Erreur chargement documents:", err);
        setDocuments([]);
      }
    };
    fetchDocuments();
  }, [selectedCourse, API_URL, token]);

  const getIconForFile = (fileName) => {
    if (!fileName) return <FileCheck className="text-gray-400 w-8 h-8" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className="text-blue-600 w-8 h-8" />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return <FileImage className="text-pink-500 w-8 h-8" />;
    if (["mp4", "webm", "avi", "mov", "mkv"].includes(ext)) return <FileVideo2 className="text-purple-500 w-8 h-8" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className="text-yellow-500 w-8 h-8" />;
    if (["ppt", "pptx", "key"].includes(ext)) return <FileText className="text-orange-500 w-8 h-8" />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FileText className="text-green-500 w-8 h-8" />;
    return <FileCheck className="text-gray-400 w-8 h-8" />;
  };

  const isYoutubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\s]+)/);
    return ytMatch ? ytMatch[1] : null;
  };

  const getDocumentStats = () => {
    const stats = {
      pdf: documents.filter(doc => ["pdf", "doc", "docx", "txt"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      images: documents.filter(doc => ["jpg", "jpeg", "png", "gif"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      videos: documents.filter(doc => ["mp4", "webm", "avi"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      archives: documents.filter(doc => ["zip", "rar"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      youtube: documents.filter(doc => isYoutubeUrl(doc.fileUrl)).length
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-700 font-medium"
          >
            Chargement des cours...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  const stats = getDocumentStats();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">
      
      {/* Header avec animations ultra attractives */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8 px-10 shadow-2xl relative overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Effet de brillance amélioré */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          animate={{ x: [-200, 400] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Effet de particules */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-white rounded-full" />
          <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Titre et icône avec animations ultra attractives */}
            <motion.div 
              className="flex items-center gap-8"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all duration-200 shadow-md"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
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
                  📄
                </motion.span>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
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
                  📄 Documents de Cours ✨
                </motion.h1>
                <motion.p 
                  className="text-xl sm:text-2xl font-medium text-white"
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
                  🌟 Gestion des ressources pédagogiques !
                </motion.p>
              </div>
            </motion.div>
            
            {/* Statistiques avec animations ultra attractives */}
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="text-center p-4 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="text-3xl font-bold text-white mb-1">{courses.length}</div>
                <div className="text-white text-sm font-medium">Cours</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
              >
                <div className="text-3xl font-bold text-white mb-1">{documents.length}</div>
                <div className="text-white text-sm font-medium">Documents</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <div className="text-3xl font-bold text-white mb-1">{stats.pdf}</div>
                <div className="text-white text-sm font-medium">PDF</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Messages de notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="space-y-6"
        >
          {/* Sélection du cours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Sélectionner un Cours</h2>
                  <p className="text-white/90 font-medium">Choisissez le cours pour voir ses documents</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                      selectedCourse?._id === course._id ? 'ring-2 ring-blue-500 bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="p-3 bg-white/80 rounded-2xl shadow-md"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-800 text-lg mb-1">
                          {course.nom} — {course.classe}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {course.matiere?.nom || "Matière non définie"}
                        </p>
                        <p className="text-blue-500 text-xs mt-1">
                          {course.etudiants?.length || 0} étudiants
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Statistiques des documents - Style simple */}
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FileType className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Statistiques des Documents</h2>
                    <p className="text-white/90 font-medium">Cours : {selectedCourse.nom} — {selectedCourse.classe}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-blue-800">PDF</h3>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-blue-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    >
                      {stats.pdf}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-pink-600 rounded-lg">
                        <ImgIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-pink-800">Images</h3>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-pink-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    >
                      {stats.images}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-600 rounded-lg">
                        <Film className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-purple-800">Vidéos</h3>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-purple-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                    >
                      {stats.videos}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-yellow-600 rounded-lg">
                        <Archive className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-yellow-800">Archives</h3>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-yellow-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                    >
                      {stats.archives}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-red-600 rounded-lg">
                        <Youtube className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-red-800">YouTube</h3>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-red-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                    >
                      {stats.youtube}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Liste des documents - Style simple */}
          {selectedCourse && (
            <>
              {documents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpenCheck className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl text-blue-600 font-medium mb-2">Aucun document trouvé</h3>
                  <p className="text-blue-400">Aucun document n'a encore été publié pour ce cours</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documents.map((doc, index) => {
                      const youtubeId = getYoutubeId(doc.fileUrl);
                      const isYoutube = youtubeId !== null;

                      return (
                        <motion.div
                          key={doc._id}
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <motion.div 
                                className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex-shrink-0"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {isYoutube ? (
                                  <Youtube className="text-red-600 w-8 h-8" />
                                ) : (
                                  getIconForFile(doc.fileName)
                                )}
                              </motion.div>
                              <div className="overflow-hidden flex-1">
                                <h3 className="font-bold text-blue-900 text-sm truncate" title={doc.fileName}>
                                  {isYoutube ? "Vidéo YouTube" : doc.fileName}
                                </h3>
                                {doc.message && (
                                  <p className="text-xs text-blue-600 italic mt-1 truncate">
                                    {doc.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isYoutube ? (
                              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                                <iframe
                                  className="w-full h-32"
                                  src={`https://www.youtube.com/embed/${youtubeId}`}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <motion.a
                                href={`${API_URL}${doc.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                              >
                                <Eye className="w-4 h-4" />
                                Voir le fichier
                              </motion.a>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
