import React, { useState, useContext } from "react";
import {
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  Globe,
  Moon,
  Sun,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Trash2,
  Download,
  Upload,
  Database,
  Key,
  Wifi,
  WifiOff
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const SettingsParent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simuler une sauvegarde
    setTimeout(() => {
      setSaving(false);
    }, 2000);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    // Logique de changement de mot de passe
    alert("Mot de passe modifié avec succès");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const tabs = [
    { id: "general", label: "Général", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "privacy", label: "Confidentialité", icon: Eye },
    { id: "data", label: "Données", icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <span>Paramètres</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              Gérez vos préférences et la sécurité de votre compte ✨
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar des onglets */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres généraux</h2>
                
                {/* Thème */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Apparence</h3>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={20} className="text-blue-600" /> : <Sun size={20} className="text-blue-600" />}
                      <div>
                        <p className="font-medium text-gray-900">Mode sombre</p>
                        <p className="text-sm text-gray-600">Activer le thème sombre</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDarkMode && setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Langue */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Langue</h3>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Français</p>
                        <p className="text-sm text-gray-600">Langue de l'interface</p>
                      </div>
                    </div>
                    <select className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Français</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Notifications push</p>
                        <p className="text-sm text-gray-600">Recevoir des notifications en temps réel</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Notifications par email</p>
                        <p className="text-sm text-gray-600">Recevoir des alertes par email</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>
                
                {/* Changement de mot de passe */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Changer le mot de passe</h3>
                  <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mot de passe actuel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nouveau mot de passe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirmer le nouveau mot de passe"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePasswordChange}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      <Lock size={16} className="inline mr-2" />
                      Changer le mot de passe
                    </motion.button>
                  </div>
                </div>

                {/* Authentification à deux facteurs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Authentification à deux facteurs</h3>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">2FA</p>
                        <p className="text-sm text-gray-600">Sécuriser votre compte avec 2FA</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Confidentialité</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Eye size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Profil public</p>
                        <p className="text-sm text-gray-600">Rendre votre profil visible</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Partage de données</p>
                        <p className="text-sm text-gray-600">Autoriser le partage de données anonymes</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Données</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Download size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Exporter mes données</p>
                        <p className="text-sm text-gray-600">Télécharger toutes vos données</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Exporter
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <Trash2 size={20} className="text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Supprimer mon compte</p>
                        <p className="text-sm text-gray-600">Action irréversible</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                      Supprimer
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsParent; 