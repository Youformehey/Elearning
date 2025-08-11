import React, { useContext, useState, useEffect } from "react";
import {
  ClipboardList,
  Calendar,
  PlusCircle,
  Pencil,
  Trash2,
  BookOpen,
  Eye,
  Target,
  AlertCircle,
  Clock,
  GraduationCap,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Zap,
  Trophy,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RappelsContext } from "../../context/RappelsContext";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

const RappelsProfesseur = () => {
  const { rappels, fetchRappels } = useContext(RappelsContext);
  const [form, setForm] = useState({ type: "devoir", texte: "", date: "", classe: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const role = userInfo?.role;

  useEffect(() => {
    fetchRappels();
  }, [fetchRappels]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.texte || !form.date || !form.classe) {
      setError("Tous les champs sont requis.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `${API_URL}/api/rappels/${editingId}` : `${API_URL}/api/rappels`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      await fetchRappels();
      setForm({ type: "devoir", texte: "", date: "", classe: "" });
      setEditingId(null);
      setShowAddForm(false);
      setSuccessMessage(editingId ? "✅ Rappel modifié avec succès !" : "✅ Rappel ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/rappels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression.");
      await fetchRappels();
      setSuccessMessage("✅ Rappel supprimé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleEdit = (rappel) => {
    setEditingId(rappel._id);
    setForm({
      type: rappel.type,
      texte: rappel.texte,
      date: rappel.date.slice(0, 10),
      classe: rappel.classe,
    });
    setShowAddForm(true);
  };

  const getIconForType = (type) => {
    switch (type) {
      case "devoir":
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case "quiz":
        return <Target className="w-6 h-6 text-blue-600" />;
      case "note":
        return <ClipboardList className="w-6 h-6 text-blue-600" />;
      case "tache":
        return <Calendar className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getColorForType = (type) => {
    return "from-blue-50 to-blue-100 border-blue-200 text-blue-800";
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ClipboardList className="text-white" size={32} />
            </motion.div>
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                {role === "teacher" || role === "prof" ? "Gestion des Rappels" : "Mes Rappels"}
              </h1>
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Organisez vos tâches et devoirs</p>
            </div>
          </div>

          {(role === "teacher" || role === "prof") && (
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusCircle className="w-6 h-6" />
              {showAddForm ? "Fermer" : "Ajouter un rappel"}
            </motion.button>
          )}
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">{error}</span>
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
          {/* Formulaire */}
          {(role === "teacher" || role === "prof") && showAddForm && (
            <motion.div 
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
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
                    <PlusCircle className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingId ? "Modifier un rappel" : "Ajouter un rappel"}
                    </h2>
                    <p className="text-blue-100 font-medium">Créez un nouveau rappel pour vos étudiants</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                    required
                  >
                    <option value="devoir">📚 Devoir</option>
                    <option value="quiz">🎯 Quiz</option>
                    <option value="note">📝 Note</option>
                    <option value="tache">📅 Tâche</option>
                  </motion.select>

                  <motion.input
                    type="text"
                    name="texte"
                    placeholder="Ex : Préparer le contrôle"
                    value={form.texte}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />

                  <motion.input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />

                  <motion.select
                    name="classe"
                    value={form.classe}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-medium"
                    whileFocus={{ scale: 1.02 }}
                    required
                  >
                    <option value="">-- Sélectionner une classe --</option>
                    <option value="6A">6A</option>
                    <option value="5A">5A</option>
                    <option value="4B">4B</option>
                    <option value="3C">3C</option>
                  </motion.select>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    isLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingId ? "Modification..." : "Ajout..."}
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      {editingId ? "Mettre à jour" : "Ajouter le rappel"}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Liste des rappels */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
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
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Liste des rappels</h2>
                  <p className="text-blue-100 font-medium">{rappels.length} rappel(s) au total</p>
                </div>
              </div>
            </div>

            <div className="p-8 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {rappels.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ClipboardList className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl text-blue-600 font-medium mb-2">Aucun rappel</h3>
                    <p className="text-blue-400">Aucun rappel n'a encore été créé</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {rappels.map((rappel, index) => (
                      <motion.div
                        key={rappel._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`bg-gradient-to-r ${getColorForType(rappel.type)} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <motion.div 
                              className="p-3 bg-white rounded-xl shadow-sm"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {getIconForType(rappel.type)}
                            </motion.div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold capitalize">
                                  {rappel.type}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-lg font-medium">
                                  {rappel.texte}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{new Date(rappel.date).toLocaleDateString("fr-FR")}</span>
                                </div>
                                {rappel.classe && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <GraduationCap className="w-4 h-4" />
                                      <span>{rappel.classe}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {role === "teacher" && (
                            <div className="flex items-center gap-2 ml-4">
                              <motion.button
                                onClick={() => handleEdit(rappel)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all duration-200"
                                title="Modifier"
                              >
                                <Pencil className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(rappel._id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => navigate(`/prof/rappels/${rappel._id}/etudiants`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium"
                                title="Voir les étudiants"
                              >
                                <Eye className="w-4 h-4" />
                                Voir qui a fait
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RappelsProfesseur;
