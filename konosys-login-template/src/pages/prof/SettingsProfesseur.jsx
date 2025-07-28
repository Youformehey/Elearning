import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { 
  Settings, 
  User, 
  Mail, 
  Lock, 
  Moon, 
  Sun, 
  Save, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Shield,
  Bell,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsProfesseur() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Utilisation du ThemeContext global
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Erreur récupération utilisateur :", err);
        setErrorMessage("Erreur lors du chargement des données");
      }
    };

    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validation des mots de passe
    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage("❌ Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const updateData = { ...user };
      if (newPassword) {
        updateData.password = newPassword;
      }

      await axios.put(
        "/api/users/update",
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("✅ Informations mises à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Erreur lors de la mise à jour");
      setTimeout(() => setErrorMessage(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-4xl mx-auto">
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
            <Settings className="text-white" size={32} />
          </motion.div>
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>Paramètres</h1>
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Gérez vos préférences et votre compte</p>
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
          {/* Informations du compte */}
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
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Informations du compte</h2>
                  <p className="text-blue-100 font-medium">Modifiez vos données personnelles</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <label className={`flex items-center gap-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                  <User className="w-4 h-4" />
                  Nom
                </label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
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
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <label className="flex items-center gap-2 text-blue-800 font-semibold">
                  <Lock className="w-4 h-4" />
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                  placeholder="Laissez vide pour ne pas changer"
                />
              </motion.div>

              {newPassword && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <label className="flex items-center gap-2 text-blue-800 font-semibold">
                    <Shield className="w-4 h-4" />
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </motion.div>
              )}

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

          {/* Préférences */}
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
                  <Palette className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Préférences</h2>
                  <p className="text-blue-100 font-medium">Personnalisez votre expérience</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <motion.div 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Mode sombre</h3>
                    <p className="text-sm text-blue-600">
                      {darkMode ? "Activer le thème clair" : "Activer le thème sombre"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                    darkMode ? "bg-blue-600" : "bg-blue-200"
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: darkMode ? 28 : 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.button>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Notifications</h3>
                    <p className="text-sm text-blue-600">Gérer les alertes et rappels</p>
                  </div>
                </div>
                <div className="text-blue-400 text-sm">Activées</div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Sécurité</h3>
                    <p className="text-sm text-blue-600">Paramètres de sécurité du compte</p>
                  </div>
                </div>
                <div className="text-blue-400 text-sm">Standard</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
