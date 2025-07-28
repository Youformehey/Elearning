import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentsCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, docsRes] = await Promise.all([
          fetch(`${API_URL}/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/documents/course/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!courseRes.ok) throw new Error("Erreur chargement cours");
        if (!docsRes.ok) throw new Error("Erreur chargement documents");

        const courseData = await courseRes.json();
        const docsData = await docsRes.json();

        setCourse(courseData);
        setDocuments(docsData);
        setSuccessMessage("✅ Documents chargés avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Erreur :", err);
        setError(err.message);
        setErrorMessage("❌ Erreur lors du chargement des données");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token, API_URL]);

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
            Chargement des documents...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header avec notifications */}
      <motion.div 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <motion.div 
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BookOpenCheck className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                  Documents du Cours
                </h1>
                <p className="text-blue-600 font-medium">Gestion des ressources pédagogiques</p>
              </div>
            </div>
            
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Actualiser
            </motion.button>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Infos du cours */}
          {course && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GraduationCap className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {course.nom} — {course.classe}
                    </h2>
                    <p className="text-blue-100 font-medium">
                      {typeof course.matiere === "object" ? course.matiere.nom : course.matiere || "Matière inconnue"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Statistiques des documents */}
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
                  <FileType className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Statistiques des Documents</h2>
                  <p className="text-blue-100 font-medium">Répartition par type de fichier</p>
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

          {/* Liste des documents */}
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
                    className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
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
          )}
        </motion.div>
      </div>
    </div>
  );
}
