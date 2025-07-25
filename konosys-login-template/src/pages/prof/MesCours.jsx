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
  open:   { rotate: 180, transition: { duration: 0.2 } },
  closed: { rotate:   0, transition: { duration: 0.2 } },
};
const contentVariants = {
  open:   { opacity: 1, height: "auto", transition: { duration: 0.25 } },
  closed: { opacity: 0, height:     0, transition: { duration: 0.2 } },
};

export default function MesCoursProf() {
  const navigate     = useNavigate();
  const userInfo     = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token        = userInfo.token;
  const currentProfId= userInfo.user?._id;

  const [chapitres,  setChapitres] = useState([]);
  const [coursProf,  setCoursProf] = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState(null);
  const [openCours,  setOpenCours] = useState({});
  const [selectedChapitre, setSelectedChapitre] = useState("");
  const [showAddCourse,    setShowAddCourse]    = useState(false);
  const [formCourse, setFormCourse] = useState({
    matiere:   "",
    classe:    "",
    semestre:  "",
    date:      "",
    horaire:   "",
    duree:     120,
    salle:     "Salle A",
    groupe:    "",
    etudiants: [],
    chapitres: [],             // <-- initialement vide
  });

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchData();
  }, [token]);

  async function fetchData() {
    setLoading(true);
    try {
      const [rCh, rCo] = await Promise.all([
        fetch(`${API_URL}/api/chapitres`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/courses/teacher`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!rCh.ok || !rCo.ok) throw new Error("Erreur chargement données");

      const chapData = await rCh.json();
      setChapitres(chapData);

      const payload = await rCo.json();
      const raw = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.courses)
        ? payload.courses
        : [];

      const myCourses = raw
        .filter((c) =>
          c.teacher
            ? c.teacher._id === currentProfId
            : c.teacherId === currentProfId
        )
        .filter((c, i, arr) => arr.findIndex((x) => x._id === c._id) === i);

      setCoursProf(myCourses);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleCours = (id) =>
    setOpenCours((prev) => ({ ...prev, [id]: !prev[id] }));

  // associer un chapitre existant à un cours
  const ajouterChapitreAuCours = async (coursId) => {
    if (!selectedChapitre) return;
    const cours = coursProf.find((c) => c._id === coursId) || {};
    const nouveaux = Array.from(
      new Set([...(cours.chapitres || []), selectedChapitre])
    );
    await fetch(`${API_URL}/api/courses/${coursId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chapitres: nouveaux }),
    });
    setSelectedChapitre("");
    fetchData();
  };

  // désassocier un chapitre
  const supprimerChapitreDuCours = async (coursId, chapitreId) => {
    const cours = coursProf.find((c) => c._id === coursId) || {};
    const restants = (cours.chapitres || []).filter((id) => id !== chapitreId);
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

  // création de cours
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formCourse),  // envoie aussi formCourse.chapitres
    });
    setShowAddCourse(false);
    setFormCourse({
      matiere:   "",
      classe:    "",
      semestre:  "",
      date:      "",
      horaire:   "",
      duree:     120,
      salle:     "Salle A",
      groupe:    "",
      etudiants: [],
      chapitres: [],
    });
    fetchData();
  };

  if (loading) return <Loader2 className="animate-spin" size={48} />;
  if (error)   return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-indigo-900">Mes Cours</h1>
          <Btn onClick={() => setShowAddCourse((s) => !s)} variant="blue">
            <PlusCircle /> Nouveau cours
          </Btn>
        </div>

        {/* FORM CREATION DE COURS */}
        <AnimatePresence>
          {showAddCourse && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleCreateCourse}
              className="bg-white p-6 rounded-lg shadow space-y-4"
            >
              <h2 className="text-xl font-semibold">Créer un cours</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputModern
                  label="Matière"
                  value={formCourse.matiere}
                  onChange={(e) =>
                    setFormCourse((f) => ({ ...f, matiere: e.target.value }))
                  }
                />
                <InputModern
                  label="Classe"
                  value={formCourse.classe}
                  onChange={(e) =>
                    setFormCourse((f) => ({ ...f, classe: e.target.value }))
                  }
                />
                {/* … autres champs (semestre, date, horaire, etc.) */}
                {/* Multi‑select des chapitres */}
                <div className="col-span-2">
                  <label className="block font-medium mb-1">Chapitres</label>
                  <select
                    multiple
                    className="w-full border rounded p-2 h-32"
                    value={formCourse.chapitres}
                    onChange={(e) => {
                      const opts = Array.from(e.target.options);
                      const values = opts
                        .filter((o) => o.selected)
                        .map((o) => o.value);
                      setFormCourse((f) => ({ ...f, chapitres: values }));
                    }}
                  >
                    {chapitres.map((ch) => (
                      <option key={ch._id} value={ch._id}>
                        {ch.titre}
                      </option>
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

        {/* SELECT CHAPITRE GLOBAL */}
        <div className="max-w-md">
          <label className="block mb-1 font-semibold">
            Associer un chapitre existant
          </label>
          <div className="relative">
            <select
              className="w-full border rounded p-2"
              value={selectedChapitre}
              onChange={(e) => setSelectedChapitre(e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {chapitres.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.titre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* LISTE DES COURS */}
        <div className="space-y-6">
          {coursProf.map((cours) => (
            <div
              key={cours._id}
              className="bg-white p-6 rounded-lg shadow space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">
                  {cours.matiere?.nom} — {cours.classe}
                </h3>
                <div className="flex items-center gap-2">
                  <ActionBtn
                    icon={UserCheck}
                    label="Forum"
                    onClick={() =>
                      navigate(`/prof/cours/forum/${cours._id}`)
                    }
                  />
                  <button onClick={() => toggleCours(cours._id)}>
                    <ChevronDown
                      size={24}
                      className={
                        openCours[cours._id] ? "rotate-180" : ""
                      }
                    />
                  </button>
                  <Trash2
                    size={20}
                    className="text-red-500 cursor-pointer"
                    onClick={() => alert("Supprimer cours")}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(cours.chapitres || []).map((cid) => {
                        const ch = chapitres.find((c) => c._id === cid);
                        return ch ? (
                          <div key={cid} className="relative">
                            <ChapterCard
                              chapitre={ch}
                              coursId={cours._id}
                            />
                            <button
                              className="absolute top-1 right-1 text-red-500"
                              onClick={() =>
                                supprimerChapitreDuCours(cours._id, cid)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <Btn
                      variant="primary"
                      disabled={!selectedChapitre}
                      onClick={() => ajouterChapitreAuCours(cours._id)}
                    >
                      Associer chapitre
                    </Btn>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
