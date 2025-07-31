import React, { useState, useEffect, useContext } from "react";
import {
  FileText,
  FileImage,
  FileVideo2,
  FileArchive,
  FileCheck,
  Trash2,
  DownloadCloud,
  UploadCloud,
  FolderPlus,
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
  Plus,
  XCircle,
  BookOpen,
  Target,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function DocumentsProfesseur() {
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const teacherEmail = userInfo?.email;
  const { darkMode } = useContext(ThemeContext);

  // Charger les cours du prof
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const profCourses = (data.courses || []).filter(
          (course) => course?.teacher?.email === teacherEmail
        );
        setCourses(profCourses);
        // Si cours précédemment sélectionné existe, le sélectionner par défaut
        const lastCourse = localStorage.getItem("lastCourse");
        if (lastCourse && profCourses.some(c => c._id === lastCourse)) {
          setSelectedCourse(lastCourse);
        }
      } catch (err) {
        console.error("Erreur chargement cours:", err);
        setError("Impossible de charger les cours.");
        setErrorMessage("❌ Erreur lors du chargement des cours");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    };
    fetchCourses();
  }, [API_URL, token, teacherEmail]);

  // Charger les documents quand selectedCourse change
  useEffect(() => {
    if (!selectedCourse) return setDocuments([]);
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/documents/course/${selectedCourse}`, {
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      setErrorMessage("❌ Veuillez choisir un cours");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    if (!file && !videoUrl.trim()) {
      setErrorMessage("❌ Veuillez choisir un fichier ou entrer une URL vidéo");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setUploading(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("course", selectedCourse);
        formData.append("message", message);

        const res = await fetch(`${API_URL}/api/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur upload fichier");
        }
      } else {
        // Ajouter l'URL vidéo via POST /api/documents/url
        const res = await fetch(`${API_URL}/api/documents/url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: selectedCourse,
            fileUrl: videoUrl.trim(),
            fileName: "Vidéo YouTube",
            message,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur ajout URL vidéo");
        }
      }

      // Rafraîchir documents
      const docsRes = await fetch(`${API_URL}/api/documents/course/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const docsData = await docsRes.json();
      setDocuments(docsData);

      // Reset form
      setFile(null);
      setVideoUrl("");
      setMessage("");
      setShowAddForm(false);
      e.target.reset();
      
      setSuccessMessage("✅ Document ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("❌ " + err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      setSuccessMessage("✅ Document supprimé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("❌ Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const getCourseName = (id) => {
    const course = courses.find((c) => c._id === id);
    if (!course) return "Inconnu";
    const matiereNom = course.matiere?.nom || "Inconnu";
    return `${course.classe} — ${matiereNom}`;
  };

  const getIconForFile = (fileName) => {
    if (!fileName) return <FileCheck className="text-gray-400 w-8 h-8" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className="text-blue-600 w-8 h-8" />;
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return <FileImage className="text-pink-600 w-8 h-8" />;
    if (["mp4", "webm", "avi", "mov", "mkv"].includes(ext)) return <FileVideo2 className="text-purple-600 w-8 h-8" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className="text-yellow-600 w-8 h-8" />;
    if (["ppt", "pptx", "key"].includes(ext)) return <FileText className="text-orange-600 w-8 h-8" />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FileText className="text-green-600 w-8 h-8" />;
    return <FileCheck className="text-gray-400 w-8 h-8" />;
  };

  const getDocumentStats = () => {
    const stats = {
      total: documents.length,
      pdf: documents.filter(doc => ["pdf", "doc", "docx", "txt"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      images: documents.filter(doc => ["jpg", "jpeg", "png", "gif"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      videos: documents.filter(doc => ["mp4", "webm", "avi"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      archives: documents.filter(doc => ["zip", "rar"].includes(doc.fileName?.split(".").pop().toLowerCase())).length,
      youtube: documents.filter(doc => doc.fileUrl && (doc.fileUrl.includes("youtube.com") || doc.fileUrl.includes("youtu.be"))).length
    };
    return stats;
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
        <FileText size={32} />
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
        <BookOpen size={28} />
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
        <FolderPlus size={24} />
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
                  📄
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
                  📄 Documents de Cours ✨
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
                  🌟 Gestion des ressources pédagogiques !
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Bouton Ajouter Document */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Ajouter Document
            </motion.button>
          </motion.div>
          {/* Formulaire d'ajout */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-3 bg-white/20 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <UploadCloud className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Ajouter un Document</h2>
                      <p className="text-blue-100 font-medium">Partagez des ressources avec vos étudiants</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowAddForm(false)}
                    whileHover={{ scale: 1.1 }}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleUpload} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.select
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      localStorage.setItem("lastCourse", e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">-- Sélectionner un cours --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.classe} — {c.matiere?.nom || "Inconnu"}
                      </option>
                    ))}
                  </motion.select>

                  <motion.input
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setVideoUrl("");
                    }}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.webm,.avi,.zip,.rar"
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>

                <motion.input
                  type="url"
                  placeholder="Ou coller une URL vidéo YouTube"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setFile(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                  whileFocus={{ scale: 1.02 }}
                />

                <motion.textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message (optionnel) - Ex : Support du chapitre 3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium resize-none h-28"
                  whileFocus={{ scale: 1.02 }}
                />

                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    uploading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5" />
                      Ajouter le Document
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Statistiques des documents */}
          {selectedCourse && documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <BarChart3 className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Statistiques des Documents</h2>
                    <p className="text-blue-100 font-medium">Cours : {getCourseName(selectedCourse)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                  {(() => {
                    const stats = getDocumentStats();
                    return [
                      { label: "Total", value: stats.total, color: "blue", icon: FileCheck },
                      { label: "PDF", value: stats.pdf, color: "blue", icon: FileText },
                      { label: "Images", value: stats.images, color: "pink", icon: FileImage },
                      { label: "Vidéos", value: stats.videos, color: "purple", icon: FileVideo2 },
                      { label: "Archives", value: stats.archives, color: "yellow", icon: FileArchive },
                      { label: "YouTube", value: stats.youtube, color: "red", icon: Youtube }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-xl border border-${stat.color}-200`}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 bg-${stat.color}-600 rounded-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className={`font-semibold text-${stat.color}-800`}>{stat.label}</h3>
                        </div>
                        <motion.div 
                          className={`text-3xl font-bold text-${stat.color}-600`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
                        >
                          {stat.value}
                        </motion.div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {/* Liste des documents */}
          {selectedCourse && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-3 bg-white/20 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Documents</h2>
                      <p className="text-blue-100 font-medium">Cours : {getCourseName(selectedCourse)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {documents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl text-blue-600 font-medium mb-2">Aucun document trouvé</h3>
                      <p className="text-blue-400">Aucun document n'a encore été ajouté pour ce cours</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {documents.map((doc, index) => {
                        const isYoutube = doc.fileUrl && (doc.fileUrl.includes("youtube.com") || doc.fileUrl.includes("youtu.be"));

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
                            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="flex items-center gap-4 mb-4">
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
                                  <p className="text-sm text-blue-600 truncate">{doc.message || "-"}</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                {isYoutube ? (
                                  <motion.a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Voir la vidéo
                                  </motion.a>
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
                                    Voir
                                  </motion.a>
                                )}

                                <motion.button
                                  onClick={() => handleDelete(doc._id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
