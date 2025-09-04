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
  BookOpen,
  Plus,
  UploadCloud,
  XCircle,
  Link,
  Trash2
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

  // États pour l'ajout de documents
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('file'); // 'file', 'youtube', 'url'
  const [uploading, setUploading] = useState(false);
  
  // États pour le formulaire
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [isEssential, setIsEssential] = useState(false);

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
        console.log("Chargement des documents pour le cours:", selectedCourse._id);
        
        const res = await fetch(`${API_URL}/api/documents/course/${selectedCourse._id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });

        console.log("Status de la réponse:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Réponse du serveur:", text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || "Erreur chargement documents");
          } catch (e) {
            throw new Error("Erreur de chargement: " + text);
          }
        }

        const data = await res.json();
        console.log("Documents chargés:", data);
        setDocuments(data);
      } catch (err) {
        console.error("Erreur détaillée chargement documents:", err);
        setErrorMessage("❌ " + (err.message || "Erreur lors du chargement des documents"));
        setTimeout(() => setErrorMessage(""), 3000);
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
    if (!url) return false;
    // Vérifie si c'est un ID YouTube direct (11 caractères)
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return true;
    // Vérifie si c'est une URL YouTube
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeId = (url) => {
    if (!url) return null;

    // Si c'est déjà un ID YouTube (11 caractères)
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;

    try {
      // Gérer les URLs courtes youtu.be
      if (url.includes("youtu.be")) {
        const id = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
        if (id?.length === 11) return id;
      }

      // Gérer les URLs youtube.com
      if (url.includes("youtube.com")) {
        // Format watch?v=
        const params = new URLSearchParams(new URL(url).search);
        const v = params.get("v");
        if (v?.length === 11) return v;

        // Format embed/
        if (url.includes("/embed/")) {
          const id = url.split("/embed/")[1]?.split(/[/?#]/)[0];
          if (id?.length === 11) return id;
        }
      }

      // Si aucun format standard n'est trouvé, chercher un ID de 11 caractères
      const match = url.match(/([A-Za-z0-9_-]{11})/);
      return match?.[1] || null;

    } catch (e) {
      console.error("Erreur lors de l'extraction de l'ID YouTube:", e, {url});
      return null;
    }
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

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      setErrorMessage("❌ Veuillez choisir un cours");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (activeTab === 'file') {
        // Upload de fichier
        if (!file) {
          throw new Error("Veuillez sélectionner un fichier");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("course", selectedCourse._id);
        formData.append("fileName", documentTitle || file.name);
        formData.append("message", documentDescription || "");
        formData.append("isEssential", isEssential);

        const res = await fetch(`${API_URL}/api/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur upload fichier");
        }

      } else if (activeTab === 'youtube') {
        // Ajout d'URL YouTube
        if (!videoUrl.trim()) {
          throw new Error("Veuillez entrer une URL YouTube");
        }

        // Extraction de l'ID YouTube
        const youtubeId = getYoutubeId(videoUrl.trim());
        if (!youtubeId) {
          throw new Error("URL YouTube invalide. Veuillez entrer une URL YouTube valide");
        }

        console.log("Ajout vidéo YouTube:", { url: videoUrl, id: youtubeId });

        const res = await fetch(`${API_URL}/api/documents/url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: selectedCourse._id,
            fileUrl: youtubeId, // On envoie uniquement l'ID YouTube
            fileName: documentTitle || "Vidéo YouTube",
            message: documentDescription || "",
            isEssential: isEssential,
            type: "youtube" // Indique que c'est une vidéo YouTube
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur ajout URL vidéo");
        }

      } else if (activeTab === 'url') {
        // Ajout d'URL externe
        if (!externalUrl.trim()) {
          throw new Error("Veuillez entrer une URL");
        }

        const res = await fetch(`${API_URL}/api/documents/url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: selectedCourse._id,
            fileUrl: externalUrl.trim(),
            fileName: documentTitle || "Document externe",
            message: documentDescription || "",
            isEssential: isEssential,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur ajout URL externe");
        }
      }

      // Rafraîchir documents
      const docsRes = await fetch(`${API_URL}/api/documents/course/${selectedCourse._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const docsData = await docsRes.json();
      setDocuments(docsData);

      // Reset form
      resetForm();
      setShowAddForm(false);
      
      setSuccessMessage("✅ Document ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("❌ " + err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setVideoUrl("");
    setExternalUrl("");
    setDocumentTitle("");
    setDocumentDescription("");
    setIsEssential(false);
    setActiveTab('file');
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    try {
      // Vérification que l'ID existe
      if (!docId) {
        throw new Error("ID du document manquant");
      }

      console.log("Tentative de suppression du document:", docId);
      
      const res = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: "DELETE",
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      
      // Log de la réponse pour le débogage
      console.log("Status de la réponse:", res.status);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Document non trouvé");
        }
        const text = await res.text();
        console.error("Réponse du serveur:", text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Erreur lors de la suppression");
        } catch (e) {
          throw new Error("Erreur lors de la suppression: " + text);
        }
      }

      setDocuments(prev => prev.filter(doc => doc._id !== docId));
      setSuccessMessage("✅ Document supprimé avec succès !");
      
      // Recharger la liste des documents
      const docsRes = await fetch(`${API_URL}/api/documents/course/${selectedCourse._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData);
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur détaillée lors de la suppression:", err);
      setErrorMessage("❌ " + (err.message || "Erreur lors de la suppression"));
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const testDocumentAccess = async (doc) => {
    if (!doc.fileUrl) {
      alert('❌ Aucune URL de document');
      return;
    }

    const testUrl = `${API_URL}${doc.fileUrl}`;
    console.log('🔍 Test d\'accès au document:', testUrl);

    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        alert(`✅ Document accessible!\n\nNom: ${doc.fileName}\nURL: ${testUrl}\nTaille: ${response.headers.get('content-length') || 'Inconnue'} bytes`);
      } else {
        alert(`❌ Document inaccessible (${response.status})\n\nNom: ${doc.fileName}\nURL: ${testUrl}\n\nErreur: ${response.statusText}`);
      }
    } catch (error) {
      alert(`❌ Erreur d'accès au document\n\nNom: ${doc.fileName}\nURL: ${testUrl}\n\nErreur: ${error.message}`);
    }
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

      {/* Bouton Ajouter Document */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <motion.button
          onClick={() => setShowAddForm(true)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          <Plus className="w-6 h-6" />
          Ajouter Document
        </motion.button>
      </motion.div>

      {/* Modal d'ajout de document */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-3 bg-white/20 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <UploadCloud className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">Ajouter un Document</h2>
                      <p className="text-blue-100">Choisissez le type de document à ajouter</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                  >
                    <XCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Onglets */}
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  {[
                    { id: 'file', label: '📁 Fichier', icon: FileText },
                    { id: 'youtube', label: '🎥 YouTube', icon: Youtube },
                    { id: 'url', label: '🔗 URL', icon: Link }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* Formulaire */}
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Sélection du cours */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📚 Cours *
                    </label>
                    <select
                      value={selectedCourse?._id || ""}
                      onChange={(e) => {
                        const course = courses.find(c => c._id === e.target.value);
                        setSelectedCourse(course);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg"
                      required
                    >
                      <option value="">Sélectionner un cours</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.nom} — {course.classe} ({course.matiere?.nom || 'Matière non définie'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Titre du document */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Titre du document
                    </label>
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Ex: Support du chapitre 3, Exercices corrigés..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg"
                    />
                  </div>

                  {/* Contenu selon l'onglet */}
                  {activeTab === 'file' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📁 Sélectionner un fichier *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.webm,.avi,.zip,.rar"
                          className="hidden"
                          id="file-upload"
                          required
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            Cliquez pour sélectionner un fichier
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF, DOC, Images, Vidéos, Archives (max 10MB)
                          </p>
                          {file && (
                            <p className="text-green-600 font-medium mt-2">
                              ✅ {file.name} sélectionné
                            </p>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

                  {activeTab === 'youtube' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🎥 URL YouTube *
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Collez l'URL complète de la vidéo YouTube
                      </p>
                    </div>
                  )}

                  {activeTab === 'url' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔗 URL externe *
                      </label>
                      <input
                        type="url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Lien vers un document externe (PDF, site web, etc.)
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Description (optionnel)
                    </label>
                    <textarea
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      placeholder="Description du document, instructions pour les étudiants..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg resize-none h-24"
                    />
                  </div>

                  {/* Option Document Essentiel */}
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <input
                      type="checkbox"
                      id="isEssential"
                      checked={isEssential}
                      onChange={(e) => setIsEssential(e.target.checked)}
                      className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isEssential" className="flex items-center gap-2 cursor-pointer">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-yellow-700">Marquer comme document essentiel</span>
                    </label>
                    <div className="ml-auto text-xs text-yellow-600 max-w-xs">
                      Les documents essentiels sont mis en évidence pour les étudiants
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={uploading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-5 h-5" />
                          </motion.div>
                          Ajout en cours...
                        </div>
                      ) : (
                        'Ajouter le document'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-600 rounded-lg shadow-inner">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-blue-800">PDF/Documents</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-3xl font-bold text-blue-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      >
                        {stats.pdf}
                      </motion.div>
                      <div className="text-xs text-blue-500 font-medium">
                        {Math.round((stats.pdf / documents.length) * 100) || 0}% des ressources
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200 shadow-md"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-pink-600 rounded-lg shadow-inner">
                        <ImgIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-pink-800">Images</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-3xl font-bold text-pink-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      >
                      {stats.images}
                      </motion.div>
                      <div className="text-xs text-pink-500 font-medium">
                        {Math.round((stats.images / documents.length) * 100) || 0}% des ressources
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-md"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-600 rounded-lg shadow-inner">
                        <Film className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-purple-800">Vidéos</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-3xl font-bold text-purple-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                      >
                        {stats.videos}
                      </motion.div>
                      <div className="text-xs text-purple-500 font-medium">
                        {Math.round((stats.videos / documents.length) * 100) || 0}% des ressources
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 shadow-md"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-yellow-600 rounded-lg shadow-inner">
                        <Archive className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-yellow-800">Archives</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="text-3xl font-bold text-yellow-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                      >
                        {stats.archives}
                      </motion.div>
                      <div className="text-xs text-yellow-500 font-medium">
                        {Math.round((stats.archives / documents.length) * 100) || 0}% des ressources
                      </div>
                    </div>
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
                    className="relative"
                  >
                    <BookOpenCheck className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                    <motion.div 
                      className="absolute -top-2 -right-2 p-2 bg-blue-100 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Plus className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl text-blue-600 font-medium mb-2">Aucun document trouvé</h3>
                  <p className="text-blue-400 mb-6">Aucun document n'a encore été publié pour ce cours</p>
                  
                  <div className="max-w-md mx-auto bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-700 mb-2">Suggestions de documents à ajouter :</h4>
                    <ul className="text-left text-sm text-blue-600 space-y-2">
                      <li className="flex items-center gap-2"><FileText className="w-4 h-4" /> Support de cours au format PDF</li>
                      <li className="flex items-center gap-2"><Youtube className="w-4 h-4" /> Vidéos explicatives</li>
                      <li className="flex items-center gap-2"><FileImage className="w-4 h-4" /> Schémas et illustrations</li>
                      <li className="flex items-center gap-2"><Link className="w-4 h-4" /> Liens vers des ressources complémentaires</li>
                    </ul>
                  </div>
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
                                <h3 className="font-bold text-blue-900 text-lg truncate" title={doc.fileName}>
                                  {isYoutube ? "Vidéo YouTube" : doc.fileName}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-blue-500">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {doc.message && (
                                  <p className="text-xs text-blue-600 mt-2 line-clamp-2">
                                    {doc.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isYoutube ? (
                              <div className="rounded-lg overflow-hidden mb-4 shadow-lg border border-red-100">
                                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                  <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%'
                                    }}
                                  />
                                </div>
                                <div className="bg-gradient-to-r from-red-50 to-red-100 p-2 text-center">
                                  <p className="text-xs text-red-600 font-medium">
                                    Vidéo YouTube {youtubeId && `- ID: ${youtubeId}`}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <motion.a
                                  href={`${API_URL}${doc.fileUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 w-full justify-center"
                                >
                                  <Eye className="w-4 h-4" />
                                  Consulter le document
                                </motion.a>
                                <motion.a
                                  href={`${API_URL}${doc.fileUrl}`}
                                  download
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 w-full justify-center"
                                >
                                  <DownloadCloud className="w-4 h-4" />
                                  Télécharger
                                </motion.a>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              {/* Bouton de test pour les fichiers (pas YouTube) */}
                              {!isYoutube && (
                                <motion.button
                                  onClick={() => testDocumentAccess(doc)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 bg-yellow-100 text-yellow-600 rounded-xl hover:bg-yellow-200 transition-all duration-200"
                                  title="Tester l'accès"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </motion.button>
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
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
