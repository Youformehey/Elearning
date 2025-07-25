// src/pages/prof/MesCoursProf.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  PlusCircle,
  Trash2,
  UserCheck,
  Loader2,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterCard from "../../components/ChapterCard";
import { Btn, InputModern, ActionBtn } from "../../components/UI";

const API_URL = "http://localhost:5001";
const toggleVariants = {
  open: { rotate: 180, transition: { duration: 0.2 } },
  closed: { rotate: 0, transition: { duration: 0.2 } },
};
const contentVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.25 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

export default function MesCoursProf() {
  const navigate = useNavigate();
  const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
  if (!token) {
    navigate("/login");
    return null;
  }

  const [matieres, setMatieres]   = useState([]);
  const [chapitres, setChapitres] = useState([]);
  const [coursProf, setCoursProf] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [openCours, setOpenCours]         = useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [formCourse, setFormCourse]       = useState({
    matiere: "",    // ID de la matière
    titre: "",      // nom du cours en local
    classe: "",
    chapitres: [],
  });

  // Inline‑association state per course
  const [chapToAdd, setChapToAdd]           = useState({});
  const [showChapSelect, setShowChapSelect] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [rMa, rCh, rCo] = await Promise.all([
        fetch(`${API_URL}/api/matieres`,   { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/chapitres`,  { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/courses`,    { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!rMa.ok || !rCh.ok || !rCo.ok) throw new Error("Erreur chargement données");

      setMatieres(await rMa.json());
      setChapitres(await rCh.json());

      const courseData = await rCo.json();
      const list = Array.isArray(courseData.courses)
        ? courseData.courses
        : Array.isArray(courseData)
        ? courseData
        : [];
      setCoursProf(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleCours = (id) =>
    setOpenCours(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom:        formCourse.titre,
        matiere:    formCourse.matiere,
        classe:     formCourse.classe,
        groupe:     formCourse.classe,
        semestre:   "",
        date:       null,
        horaire:    "",
        duree:      120,
        salle:      "",
        chapitres:  formCourse.chapitres,
      }),
    });
    setShowAddCourse(false);
    setFormCourse({ matiere: "", titre: "", classe: "", chapitres: [] });
    fetchData();
  };

  const handleAssociateChap = async (coursId) => {
    const selected = chapToAdd[coursId];
    if (!selected) return;
    const cours    = coursProf.find(c => c._id === coursId) || {};
    const nouveaux = Array.from(new Set([...(cours.chapitres||[]), selected]));
    await fetch(`${API_URL}/api/courses/${coursId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chapitres: nouveaux }),
    });
    setChapToAdd(prev => ({ ...prev, [coursId]: "" }));
    setShowChapSelect(prev => ({ ...prev, [coursId]: false }));
    fetchData();
  };

  const supprimerChapitreDuCours = async (coursId, chapId) => {
    const cours    = coursProf.find(c => c._id === coursId) || {};
    const restants = (cours.chapitres||[]).filter(id => id !== chapId);
    await fetch(`${API_URL}/api/courses/${coursId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chapitres: restants }),
    });
    fetchData();
  };

  // ** NOUVEAU ** suppression d’un cours
  const handleDeleteCourse = async (coursId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;
    const res = await fetch(`${API_URL}/api/courses/${coursId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchData();
    } else {
      const err = await res.json();
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  if (loading) return <Loader2 className="animate-spin" size={48} />;
  if (error)   return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-indigo-900">Mes Cours</h1>
          <Btn onClick={() => setShowAddCourse(s => !s)} variant="blue">
            <PlusCircle /> Nouveau cours
          </Btn>
        </div>

        {/* FORM CREATION DE COURS */}
        <AnimatePresence>
          {showAddCourse && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit   ={{ opacity: 0, y: -10 }}
              onSubmit={handleCreateCourse}
              className="bg-white p-6 rounded-lg shadow space-y-4"
            >
              <h2 className="text-xl font-semibold">Créer un cours</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Sélect matière */}
                <div className="col-span-2">
                  <label className="block mb-1 font-medium">Matière</label>
                  <select
                    className="w-full border rounded p-2"
                    value={formCourse.matiere}
                    onChange={e => setFormCourse(f => ({ ...f, matiere: e.target.value }))}
                    required
                  >
                    <option value="">-- Choisir une matière --</option>
                    {matieres.map(m => (
                      <option key={m._id} value={m._id}>{m.nom}</option>
                    ))}
                  </select>
                </div>
                {/* Nom du cours */}
                <InputModern
                  label="Nom du cours"
                  value={formCourse.titre}
                  onChange={e => setFormCourse(f => ({ ...f, titre: e.target.value }))}
                  required
                />
                {/* Classe */}
                <InputModern
                  label="Classe"
                  value={formCourse.classe}
                  onChange={e => setFormCourse(f => ({ ...f, classe: e.target.value }))}
                  required
                />
                {/* multi‑select chapitres */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">
                    Chapitres (optionnel)
                  </label>
                  <select
                    multiple
                    className="w-full border rounded p-2 h-32"
                    value={formCourse.chapitres}
                    onChange={e => {
                      const vals = Array.from(e.target.options)
                        .filter(o => o.selected)
                        .map(o => o.value);
                      setFormCourse(f => ({ ...f, chapitres: vals }));
                    }}
                  >
                    {chapitres.map(ch => (
                      <option key={ch._id} value={ch._id}>{ch.titre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Btn type="submit" variant="primary">
                <Save /> Enregistrer
              </Btn>
            </motion.form>
          )}
        </AnimatePresence>

        {/* LISTE DES COURS */}
        <div className="space-y-6">
          {coursProf.map(cours => {
            const dispo = chapitres.filter(ch => !cours.chapitres.includes(ch._id));
            return (
              <div key={cours._id} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold">
                    {cours.nom} — {cours.classe}
                  </h3>
                  <div className="flex items-center gap-2">
                    <ActionBtn
                      icon={UserCheck}
                      label="Forum"
                      onClick={() => navigate(`/prof/cours/forum/${cours._id}`)}
                    />
                    <button onClick={() => toggleCours(cours._id)}>
                      <ChevronDown
                        size={24}
                        className={openCours[cours._id] ? "rotate-180" : ""}
                      />
                    </button>
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteCourse(cours._id)}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {openCours[cours._id] && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={contentVariants}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Chapitres existants */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cours.chapitres.map(chId => {
                          const ch = chapitres.find(x => x._id === chId);
                          return ch ? (
                            <div key={ch._id} className="relative">
                              <ChapterCard chapitre={ch} coursId={cours._id} />
                              <button
                                className="absolute top-1 right-1 text-red-500"
                                onClick={() => supprimerChapitreDuCours(cours._id, ch._id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>

                      {/* Associer un chapitre */}
                      <div className="flex items-center gap-2">
                        <Btn
                          variant="outline"
                          onClick={() => setShowChapSelect(prev => ({
                            ...prev, [cours._id]: !prev[cours._id]
                          }))}
                        >
                          <PlusCircle size={16} /> Associer un chapitre
                        </Btn>
                        <AnimatePresence>
                          {showChapSelect[cours._id] && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex items-center space-x-2"
                            >
                              <select
                                className="border rounded p-2"
                                value={chapToAdd[cours._id] || ""}
                                onChange={e => setChapToAdd(prev => ({
                                  ...prev, [cours._id]: e.target.value
                                }))}
                              >
                                <option value="">-- Choisir --</option>
                                {dispo.map(ch => (
                                  <option key={ch._id} value={ch._id}>{ch.titre}</option>
                                ))}
                              </select>
                              <Btn
                                size="sm"
                                onClick={() => handleAssociateChap(cours._id)}
                                disabled={!chapToAdd[cours._id]}
                              >
                                <Save size={16} />
                              </Btn>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
