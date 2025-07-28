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
  Unlock
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
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Erreur lors de la mise à jour");
      setTimeout(() => setErrorMessage(""), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'}`}>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
          />
          <p className={`font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Chargement du profil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity }
              }}
            >
              <User className="text-white" size={32} />
            </motion.div>
            <div>
              <motion.h1 
                className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                🎓 Mon Profil Étudiant
              </motion.h1>
              <motion.p 
                className={`font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Gérez vos informations personnelles ✨
              </motion.p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode && setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-300 border border-gray-600 hover:bg-gray-600' 
                  : 'bg-white text-purple-700 border border-gray-200 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="hidden sm:inline">{darkMode ? "Clair" : "Sombre"}</span>
            </motion.button>

            {/* Edit Toggle */}
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                isEditing
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEditing ? <XCircle size={20} /> : <Edit size={20} />}
              <span className="hidden sm:inline">{isEditing ? "Annuler" : "Modifier"}</span>
            </motion.button>

            {/* Refresh Button */}
            <motion.button
              onClick={fetchProfile}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title="Actualiser le profil"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Actualiser</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-2xl flex items-center gap-3 shadow-lg"
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-2xl flex items-center gap-3 shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo de profil */}
          <motion.div 
            className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-purple-500/30' : 'bg-white/90 border-pink-200'}`}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
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
                  <Camera className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Photo de profil</h2>
                  <p className="text-pink-100 font-medium">Personnalisez votre apparence</p>
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
            className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-purple-500/30' : 'bg-white/90 border-pink-200'}`}
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
                  <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-purple-800'}`}>
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-white disabled:bg-gray-800 disabled:text-gray-400' 
                        : 'border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500'
                    }`}
                    required
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-purple-800'}`}>
                    <GraduationCap className="w-4 h-4" />
                    Classe
                  </label>
                  <input
                    name="classe"
                    type="text"
                    value={profile.classe || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-white disabled:bg-gray-800 disabled:text-gray-400' 
                        : 'border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500'
                    }`}
                    required
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-purple-800'}`}>
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    name="tel"
                    type="tel"
                    value={profile.tel || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-white disabled:bg-gray-800 disabled:text-gray-400' 
                        : 'border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500'
                    }`}
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-purple-800'}`}>
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </label>
                  <input
                    name="adresse"
                    type="text"
                    value={profile.adresse || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:ring-pink-500 focus:border-pink-500 text-white disabled:bg-gray-800 disabled:text-gray-400' 
                        : 'border-pink-200 focus:ring-pink-400 focus:border-pink-400 disabled:bg-gray-100 disabled:text-gray-500'
                    }`}
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
            className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}
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
              className={`p-6 rounded-2xl shadow-2xl border-2 relative overflow-hidden ${
                darkMode ? 'bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-400/30' : 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
              }`}
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
                    className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {profile.courses?.length || 0}
                  </motion.p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
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
              className={`p-6 rounded-2xl shadow-2xl border-2 relative overflow-hidden ${
                darkMode ? 'bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-400/30' : 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
              }`}
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
                    className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {profile.tauxPresence || 100}%
                  </motion.p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
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
              className={`p-6 rounded-2xl shadow-2xl border-2 relative overflow-hidden ${
                darkMode ? 'bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-purple-400/30' : 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300'
              }`}
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
                    className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {profile.moyenne || 0}
                  </motion.p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                    🏆 Moyenne générale
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
