import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NotesParCours = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [localNotes, setLocalNotes] = useState({}); // Pour stocker notes modifiées avant enregistrement

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/courses/${courseId}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/notes/cours/${courseId}`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  // Récupérer la note dans la liste (notes ou locale modifiée)
  const getNoteValue = (etudiantId, devoir) => {
    if (localNotes[etudiantId]?.[devoir] !== undefined) {
      return localNotes[etudiantId][devoir];
    }
    const note = notes.find((n) => n.etudiant._id === etudiantId && n.devoir === devoir);
    return note ? note.note : "";
  };

  const handleChangeNote = (etudiantId, devoir, valeur) => {
    setLocalNotes((prev) => ({
      ...prev,
      [etudiantId]: {
        ...prev[etudiantId],
        [devoir]: valeur,
      },
    }));
  };

  const handleSaveNote = async (etudiantId) => {
    if (!localNotes[etudiantId]) return;
    setSavingId(etudiantId);
    try {
      const devoirs = localNotes[etudiantId];
      const promises = Object.entries(devoirs).map(([devoir, note]) =>
        axios.post("http://localhost:5000/api/notes/add", {
          etudiant: etudiantId,
          cours: courseId,
          devoir,
          note: Number(note),
          enseignant: course.enseignant,
        })
      );
      await Promise.all(promises);
      const res = await axios.get(`http://localhost:5000/api/notes/cours/${courseId}`);
      setNotes(res.data);
      setLocalNotes((prev) => {
        const copy = { ...prev };
        delete copy[etudiantId];
        return copy;
      });
    } catch (err) {
      console.error("Erreur enregistrement note :", err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="text-gray-600 p-6">Chargement...</div>;
  if (!course) return <div className="text-red-600 p-6">Cours introuvable.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">
        Notes — {course.matiere} — <span className="text-indigo-600">{course.classe}</span>
      </h2>

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Étudiant</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DM</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Projet</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Moyenne</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {course.etudiants.map((student, i) => {
              const ds = getNoteValue(student._id, "DS");
              const dm = getNoteValue(student._id, "DM");
              const projet = getNoteValue(student._id, "Projet");
              const moyenne = (
                (Number(ds || 0) + Number(dm || 0) + Number(projet || 0)) / 3
              ).toFixed(2);

              return (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                  {["DS", "DM", "Projet"].map((devoir) => (
                    <td key={devoir} className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
                        value={getNoteValue(student._id, devoir)}
                        onChange={(e) => handleChangeNote(student._id, devoir, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-800">{moyenne}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      disabled={!localNotes[student._id] || savingId === student._id}
                      onClick={() => handleSaveNote(student._id)}
                      className={`inline-block px-4 py-1 rounded text-white ${
                        savingId === student._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {savingId === student._id ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesParCours;
