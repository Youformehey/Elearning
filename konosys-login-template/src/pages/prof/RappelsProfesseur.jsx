import React, { useContext, useState, useEffect } from "react";
import {
  ClipboardList,
  Calendar,
  PlusCircle,
  Pencil,
  Trash2,
  BookOpen,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RappelsContext } from "../../context/RappelsContext";

const API_URL = "http://localhost:5001";

const RappelsProfesseur = () => {
  const { rappels, fetchRappels } = useContext(RappelsContext);
  const [form, setForm] = useState({ type: "devoir", texte: "", date: "", classe: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      alert("Tous les champs sont requis.");
      return;
    }
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
    } catch (err) {
      alert("❌ " + err.message);
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
    } catch (err) {
      alert("❌ " + err.message);
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
  };

  return (
    <motion.div className="max-w-7xl mx-auto px-6 py-10 md:py-16 font-sans text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="flex items-center gap-4 mb-12"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ClipboardList className="text-blue-700" size={36} />
        <h1 className="text-4xl font-extrabold tracking-tight">
          {role === "teacher" ? "Gestion des Rappels" : "Mes Rappels"}
        </h1>
      </motion.div>

      {error && <p className="text-center text-red-600 font-semibold mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {role === "teacher" && (
          <motion.div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <PlusCircle className="text-green-600" size={28} />
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingId ? "Modifier un rappel" : "Ajouter un rappel"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                >
                  <option value="devoir">Devoir</option>
                  <option value="quiz">Quiz</option>
                  <option value="note">Note</option>
                  <option value="tache">Tâche</option>
                </select>

                <input
                  type="text"
                  name="texte"
                  placeholder="Ex : Préparer le contrôle"
                  value={form.texte}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                />

                <select
                  name="classe"
                  value={form.classe}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  <option value="5A">5A</option>
                  <option value="4B">4B</option>
                  <option value="3C">3C</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                <PlusCircle size={22} />
                {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
            </form>
          </motion.div>
        )}

        <motion.div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-h-[680px] overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-indigo-700" size={28} />
            <h2 className="text-2xl font-semibold text-gray-900">Liste des rappels</h2>
          </div>

          <AnimatePresence>
            {rappels.length === 0 ? (
              <p className="text-gray-500 italic">Aucun rappel enregistré.</p>
            ) : (
              <ul className="space-y-6">
                {rappels.map((r) => (
                  <motion.li key={r._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-300 pb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <div className="mb-4 sm:mb-0">
                      <span className="text-blue-800 font-semibold capitalize">{r.type}</span> : {r.texte}
                      <br />
                      <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar size={18} /> {new Date(r.date).toLocaleDateString()} – {r.classe}
                      </span>
                    </div>

                    {role === "teacher" && (
                      <div className="flex flex-wrap gap-5 items-center text-sm">
                        <button onClick={() => handleEdit(r)} className="text-yellow-500 hover:text-yellow-700" title="Modifier">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700" title="Supprimer">
                          <Trash2 size={20} />
                        </button>
                        <button onClick={() => navigate(`/prof/rappels/${r._id}/etudiants`)} className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1" title="Voir les étudiants">
                          <Eye size={18} /> Voir qui a fait
                        </button>
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RappelsProfesseur;
