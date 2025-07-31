import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Edit,
  Camera,
  Sparkles,
  Star,
  Target,
  Award,
  Shield,
  Settings,
  BookOpen,
  Pencil,
  Save,
  Loader2,
  XCircle,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Heart,
  Trophy,
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  FileText,
  Play,
  Pause,
  Volume2,
  Mic,
  Paperclip,
  MoreVertical,
  HelpCircle,
  Menu,
  X,
  Music,
  Palette,
  Calculator,
  Globe,
  Code,
  Video,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Crown,
  Gem,
  Diamond
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfilStudent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const email = userInfo?.email || localStorage.getItem("userEmail");

  useEffect(() => {
    fetchProfile();
  }, [email]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = userInfo?.token;
      const res = await axios.get("http://localhost:5001/api/students/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setErrorMessage("");
    } catch (err) {
      console.error("Erreur chargement profil étudiant :", err);
      setErrorMessage("❌ Erreur lors du chargement du profil");
      // Créer un profil temporaire pour l'affichage
      setProfile({
        name: userInfo?.name || "Étudiant",
        email: email || "email@example.com",
        classe: "Classe non définie",
        tel: "",
        adresse: "",
        photo: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setSaving(true);
      const token = userInfo?.token;
      const res = await axios.post("http://localhost:5001/api/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      const imageUrl = res.data.fileUrl;
      setProfile((prev) => ({ ...prev, photo: imageUrl }));
      setSuccessMessage("✅ Photo mise à jour avec succès !");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur upload image :", err);
      setErrorMessage("❌ Erreur lors de l'upload de l'image");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const token = userInfo?.token;
      await axios.put("http://localhost:5001/api/students/me", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage("✅ Profil mis à jour avec succès !");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Erreur lors de la mise à jour");
      setTimeout(() => setErrorMessage(""), 3000);
    }
    setSaving(false);
  };

  // Composant Confetti
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ff9f43', '#00d2d3', '#5f27cd'][Math.floor(Math.random() * 10)]
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
              🎓 Chargement du profil...
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
        <User size={40} />
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
                    👤
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
                    🎓 Mon Profil Magique ✨
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
                    🌟 Gérez vos informations personnelles !
                  </motion.p>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setDarkMode && setDarkMode(!darkMode)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl ${
                    darkMode 
                      ? 'bg-gray-700 text-yellow-300 border-2 border-gray-600 hover:bg-gray-600' 
                      : 'bg-white text-purple-700 border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.1, y: -5, rotate: [0, 2, -2, 0] }}
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
                  title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="hidden sm:inline">{darkMode ? "Clair" : "Sombre"}</span>
                </motion.button>

                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl ${
                    isEditing
                      ? 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-400'
                  }`}
                  whileHover={{ scale: 1.1, y: -5, rotate: [0, 2, -2, 0] }}
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
                >
                  {isEditing ? <XCircle size={20} /> : <Edit size={20} />}
                  <span className="hidden sm:inline">{isEditing ? "Annuler" : "Modifier"}</span>
                </motion.button>

                <motion.button
                  onClick={fetchProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all duration-300 shadow-xl border-2 border-green-400"
                  whileHover={{ scale: 1.1, y: -5, rotate: [0, 2, -2, 0] }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 10px 25px -5px rgba(34, 197, 94, 0.3)",
                      "0 20px 40px -10px rgba(34, 197, 94, 0.4)",
                      "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                    ],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  title="Actualiser le profil"
                >
                  <RefreshCw size={20} />
                  <span className="hidden sm:inline">Actualiser</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="mb-6 p-6 bg-red-100 border-2 border-red-300 rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <XCircle className="w-6 h-6 text-red-600" />
                </motion.div>
                <span className="text-red-700 font-medium text-lg">{errorMessage}</span>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="mb-6 p-6 bg-green-100 border-2 border-green-300 rounded-2xl flex items-center gap-3 shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </motion.div>
                <span className="text-green-700 font-medium text-lg">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photo de profil */}
            <motion.div 
              className="rounded-3xl shadow-2xl border-2 border-blue-200 overflow-hidden bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Photo de profil</h2>
                    <p className="text-blue-100 font-medium">Personnalisez votre apparence</p>
                  </div>
                </div>
              </div>

              <div className="p-8 flex flex-col items-center">
                <motion.div
                  className="relative group cursor-pointer w-48 h-48 rounded-full overflow-hidden border-8 border-pink-200 shadow-2xl mb-6"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <img
                    src={profile.photo ? `http://localhost:5001${profile.photo}` : "/default-avatar.png"}
                    alt="Photo de profil"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <label
                      htmlFor="upload-photo"
                      className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Changer la photo"
                    >
                      <Pencil size={20} />
                    </label>
                  </div>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </motion.div>

                <p className="text-pink-600 text-center text-sm font-medium">
                  Cliquez sur l'icône pour changer votre photo
                </p>
              </div>
            </motion.div>

            {/* Informations */}
            <motion.div 
              className="rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-xl"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <User className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Informations personnelles</h2>
                    <p className="text-pink-100 font-medium">Modifiez vos données</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="flex items-center gap-2 font-semibold text-purple-800">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="flex items-center gap-2 font-semibold text-purple-800">
                      <GraduationCap className="w-4 h-4" />
                      Classe
                    </label>
                    <input
                      name="classe"
                      type="text"
                      value={profile.classe || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500"
                      required
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="flex items-center gap-2 font-semibold text-purple-800">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </label>
                    <input
                      name="tel"
                      type="tel"
                      value={profile.tel || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="flex items-center gap-2 font-semibold text-purple-800">
                      <MapPin className="w-4 h-4" />
                      Adresse
                    </label>
                    <input
                      name="adresse"
                      type="text"
                      value={profile.adresse || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </motion.div>
                </div>

                {isEditing && (
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      saving
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-2xl"
                    }`}
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-5 h-5" />
                        </motion.div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Enregistrer les modifications
                      </>
                    )}
                  </motion.button>
                )}
              </form>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-gray-800"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📊 Statistiques Académiques
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.0, type: "spring", bounce: 0.6 }}
                whileHover={{ scale: 1.1, y: -10, rotate: 2 }}
                className="p-6 rounded-3xl shadow-2xl border-2 border-blue-300 relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200"
              >
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-blue-300/30 rounded-full -mr-10 -mt-10"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {profile.courses?.length || 0}
                    </motion.p>
                    <p className="text-sm font-medium text-blue-700">
                      📚 Cours suivis
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.1, type: "spring", bounce: 0.6 }}
                whileHover={{ scale: 1.1, y: -10, rotate: -2 }}
                className="p-6 rounded-3xl shadow-2xl border-2 border-green-300 relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200"
              >
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-green-300/30 rounded-full -mr-10 -mt-10"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    whileHover={{ scale: 1.2, rotate: -15 }}
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {profile.tauxPresence || 100}%
                    </motion.p>
                    <p className="text-sm font-medium text-green-700">
                      ✅ Taux de présence
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", bounce: 0.6 }}
                whileHover={{ scale: 1.1, y: -10, rotate: 2 }}
                className="p-6 rounded-3xl shadow-2xl border-2 border-purple-300 relative overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200"
              >
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-purple-300/30 rounded-full -mr-10 -mt-10"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300,
                      rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Award className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-2xl font-bold text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {profile.moyenne || 0}
                    </motion.p>
                    <p className="text-sm font-medium text-purple-700">
                      🏆 Moyenne générale
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
