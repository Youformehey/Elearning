import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const ProfilParent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildEmail, setNewChildEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Fetch le profil
  const fetchProfile = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      console.error("Erreur récupération profil:", err);
      setError("Impossible de charger le profil. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/parents/me", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(false);
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleAddChild = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/parents/children/add", {
        studentEmail: newChildEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewChildEmail("");
      setShowAddChild(false);
      fetchProfile(); // Rafraîchir pour voir le nouvel enfant
    } catch (err) {
      console.error("Erreur ajout enfant:", err);
      alert("Erreur lors de l'ajout de l'enfant. Vérifiez l'email.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mon profil</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gérez vos informations personnelles et vos enfants.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span className="text-sm font-medium text-gray-700">
            {refreshing ? "Actualisation..." : "Actualiser"}
          </span>
        </motion.button>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Informations personnelles</h2>
            {!editing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit size={16} />
                <span className="text-sm font-medium">Modifier</span>
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Save size={16} />
                  <span className="text-sm font-medium">Sauvegarder</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                  <span className="text-sm font-medium">Annuler</span>
                </motion.button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                {editing ? (
                  <input
                    type="text"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.name || "Non renseigné"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={profile?.email || ""}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.email || "Non renseigné"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={profile?.tel || ""}
                    onChange={(e) => setProfile({...profile, tel: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.tel || "Non renseigné"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                {editing ? (
                  <textarea
                    value={profile?.adresse || ""}
                    onChange={(e) => setProfile({...profile, adresse: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.adresse || "Non renseignée"}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enfants liés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes enfants</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChild(true)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Ajouter</span>
            </motion.button>
          </div>

          {profile?.children?.length === 0 ? (
            <div className="text-center py-8">
              <User size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Aucun enfant lié</p>
              <p className="text-gray-400 text-xs">Ajoutez vos enfants pour suivre leur progression</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profile?.children?.map((child, index) => (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{child.name}</p>
                    <p className="text-sm text-gray-500">{child.email}</p>
                    {child.classe && (
                      <p className="text-xs text-gray-400">{child.classe}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-xs text-green-600">Lié</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal ajout enfant */}
      {showAddChild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddChild(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ajouter un enfant
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de l'enfant
              </label>
              <input
                type="email"
                value={newChildEmail}
                onChange={(e) => setNewChildEmail(e.target.value)}
                placeholder="enfant@email.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddChild(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddChild}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilParent; 