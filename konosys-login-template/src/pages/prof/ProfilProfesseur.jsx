import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Pencil, User, Mail, Phone, MapPin, BookOpen, Save, Loader2, Camera, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function ProfilProfesseur() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode } = useContext(ThemeContext);

  const email = localStorage.getItem("userEmail") || "sofo@gmail.com";

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/teachers/profile?email=${email}`)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setErrorMessage("Erreur lors du chargement du profil");
      });
  }, [email]);

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
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await axios.put("http://localhost:5001/api/teachers", profile);
      setSuccessMessage("✅ Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Erreur lors de la mise à jour");
      setTimeout(() => setErrorMessage(""), 3000);
    }
    setLoading(false);
  };

  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Chargement du profil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <User className="text-white" size={32} />
          </motion.div>
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>Mon Profil</h1>
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Gérez vos informations personnelles</p>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo de profil */}
          <motion.div 
            className={`rounded-2xl shadow-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Camera className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Photo de profil</h2>
                  <p className="text-blue-100 font-medium">Personnalisez votre apparence</p>
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center">
              <motion.div
                className="relative group cursor-pointer w-48 h-48 rounded-full overflow-hidden border-8 border-blue-200 shadow-xl mb-6"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src={`http://localhost:5001${profile.photo || "/uploads/default-avatar.png"}`}
                  alt="Photo de profil"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:5001/uploads/default-avatar.png";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <label
                    htmlFor="upload-photo"
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
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

              <p className="text-blue-600 text-center text-sm">
                Cliquez sur l'icône pour changer votre photo
              </p>
            </div>
          </motion.div>

          {/* Informations */}
          <motion.div 
            className={`rounded-2xl shadow-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Informations personnelles</h2>
                  <p className="text-blue-100 font-medium">Modifiez vos données</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:outline-none text-lg font-medium ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white' 
                        : 'border-blue-200 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    required
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="flex items-center gap-2 text-blue-800 font-semibold">
                    <BookOpen className="w-4 h-4" />
                    Matière
                  </label>
                  <input
                    name="matiere"
                    type="text"
                    value={profile.matiere || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    required
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="flex items-center gap-2 text-blue-800 font-semibold">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    name="tel"
                    type="tel"
                    value={profile.tel || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                  />
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="flex items-center gap-2 text-blue-800 font-semibold">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </label>
                  <input
                    name="adresse"
                    type="text"
                    value={profile.adresse || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                  />
                </motion.div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
