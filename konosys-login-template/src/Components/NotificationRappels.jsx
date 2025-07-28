import React, { useContext, useState, useEffect } from "react";
import { Bell, CalendarCheck, ClipboardList, GraduationCap, Clock, Target, BookOpen, AlertCircle, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RappelsContext } from "../context/RappelsContext";

export default function NotificationRappels() {
  const { rappels, fetchRappels } = useContext(RappelsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ type: "devoir", texte: "", date: "", classe: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadRappels = async () => {
      setIsLoading(true);
      await fetchRappels();
      setIsLoading(false);
    };
    loadRappels();
  }, [fetchRappels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.texte || !form.date || !form.classe) {
      alert("Tous les champs sont requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `http://localhost:5001/api/rappels/${editingId}` : "http://localhost:5001/api/rappels";
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      
      await fetchRappels();
      setForm({ type: "devoir", texte: "", date: "", classe: "" });
      setEditingId(null);
      setShowAddForm(false);
      alert(editingId ? "✅ Rappel modifié avec succès !" : "✅ Rappel ajouté avec succès !");
    } catch (error) {
      alert("❌ Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch(`http://localhost:5001/api/rappels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression.");
      await fetchRappels();
      alert("✅ Rappel supprimé avec succès !");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bouton Ajouter Rappel */}
      <motion.button
        onClick={() => {
          setShowAddForm(!showAddForm);
          if (!showAddForm) {
            setEditingId(null);
            setForm({ type: "devoir", texte: "", date: "", classe: "" });
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
      >
        <PlusCircle className="w-5 h-5" />
        {showAddForm ? "Fermer" : editingId ? "Modifier le rappel" : "Ajouter un rappel"}
      </motion.button>

      {/* Formulaire Ajout/Modification */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4"
          >
            <h4 className="font-semibold text-blue-800 text-center">
              {editingId ? "Modifier le Rappel" : "Nouveau Rappel"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm"
                required
              >
                <option value="devoir">📚 Devoir</option>
                <option value="quiz">🎯 Quiz</option>
                <option value="note">📝 Note</option>
                <option value="tache">📅 Tâche</option>
              </select>

              <input
                type="text"
                name="texte"
                placeholder="Ex : Préparer le contrôle"
                value={form.texte}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm"
                required
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm"
                required
              />

              <select
                name="classe"
                value={form.classe}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm"
                required
              >
                <option value="">-- Classe --</option>
                <option value="6A">6A</option>
                <option value="5A">5A</option>
                <option value="4B">4B</option>
                <option value="3C">3C</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ type: "devoir", texte: "", date: "", classe: "" });
                      setShowAddForm(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des rappels */}
      {rappels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bell className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg text-blue-600 font-medium mb-2">Aucun rappel</h3>
          <p className="text-blue-400 text-sm">Vous n'avez aucun rappel pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {rappels.map((rappel, index) => (
            <motion.div
              key={rappel._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <motion.div 
                    className="p-2 bg-white rounded-lg shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-800 capitalize">
                        {rappel.type}
                      </span>
                      <span className="text-blue-400">•</span>
                      <span className="text-sm text-blue-700 font-medium">
                        {rappel.texte}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-blue-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(rappel.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                      {rappel.classe && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>{rappel.classe}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={() => handleEdit(rappel)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all duration-200"
                    title="Modifier"
                  >
                    <Pencil className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(rappel._id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
