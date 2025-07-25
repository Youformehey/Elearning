import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCheck,
  Award,
  ClipboardList,
  FileText,
  Loader2,
} from "lucide-react";

export default function NotesProfesseur() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const email = userInfo?.email;

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await axios.get("/api/courses/teacher", authHeaders);
        const myCourses = res.data.filter((c) => c.teacher?.email === email);
        setCourses(myCourses);
      } catch (err) {
        console.error("Erreur chargement cours :", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [email]);

  useEffect(() => {
    async function loadNotes() {
      const notesObj = {};
      for (const course of courses) {
        try {
          const res = await axios.get(`/api/notes/cours/${course._id}`, authHeaders);
          res.data.forEach((n) => {
            if (!notesObj[course._id]) notesObj[course._id] = {};
            notesObj[course._id][n.etudiant._id] = {
              ...notesObj[course._id][n.etudiant._id],
              [n.devoir.toLowerCase()]: n.note,
            };
          });
        } catch {}
      }
      setNotes(notesObj);
    }
    if (courses.length) loadNotes();
  }, [courses]);

  const handleChange = (courseId, studentId, field, value) => {
    setNotes((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [studentId]: {
          ...(prev[courseId]?.[studentId] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (courseId, studentId) => {
    const values = notes[courseId]?.[studentId];
    if (!values) return;
    setSaving((prev) => ({ ...prev, [studentId]: true }));

    try {
      for (const devoir of ["ds", "dm", "projet"]) {
        const noteVal = parseFloat(values[devoir]);
        if (!isNaN(noteVal)) {
          await axios.post(
            "/api/notes/add",
            {
              etudiant: studentId,
              cours: courseId,
              devoir: devoir.toUpperCase(),
              note: noteVal,
              enseignant: userInfo._id,
            },
            authHeaders
          );
        }
      }
      alert("✅ Notes enregistrées !");
    } catch {
      alert("❌ Erreur lors de l'enregistrement.");
    } finally {
      setSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[40vh]">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-700" />
      </div>
    );

  if (!courses.length)
    return (
      <p className="text-center text-indigo-600 mt-10">
        Aucun cours disponible pour cet enseignant.
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-indigo-50 to-white">
      <h1 className="text-3xl font-extrabold text-indigo-800 mb-12 flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-indigo-600" /> Notes des étudiants
      </h1>

      <div className="space-y-12 max-w-6xl mx-auto">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg border border-indigo-200"
          >
            <header className="bg-indigo-100 px-6 py-4 rounded-t-xl">
              <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {course.matiere?.nom || "Matière inconnue"} —{" "}
                <span className="font-mono">{course.classe}</span>
              </h2>
            </header>

            {/* Table responsive wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm text-left border-collapse">
                <thead className="bg-indigo-50 text-indigo-600 select-none sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-6 font-semibold flex items-center gap-1">
                      <UserCheck className="w-4 h-4" /> Étudiant
                    </th>
                    {["DS", "DM", "Projet"].map((label) => (
                      <th
                        key={label}
                        className="py-3 px-4 font-semibold flex items-center gap-1"
                        title={label}
                      >
                        <Award className="w-4 h-4" /> {label}
                      </th>
                    ))}
                    <th className="py-3 px-6 font-semibold flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Moyenne
                    </th>
                    <th className="py-3 px-6 font-semibold text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {course.etudiants.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-indigo-400 italic"
                      >
                        Aucun étudiant
                      </td>
                    </tr>
                  )}

                  {course.etudiants.map((etudiant) => {
                    const n = notes[course._id]?.[etudiant._id] || {};
                    const ds = parseFloat(n.ds) || 0;
                    const dm = parseFloat(n.dm) || 0;
                    const projet = parseFloat(n.projet) || 0;
                    const moyenne = ((ds + dm + projet) / 3).toFixed(2);

                    return (
                      <tr
                        key={etudiant._id}
                        className="border-b border-indigo-100 hover:bg-indigo-200 transition duration-150"
                      >
                        <td className="py-3 px-6 font-semibold">{etudiant.name}</td>

                        {["ds", "dm", "projet"].map((field) => (
                          <td key={field} className="py-3 px-4">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              step={0.5}
                              className="w-20 px-3 py-1 rounded border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-indigo-900 text-center transition-shadow duration-200 shadow-sm"
                              value={n[field] || ""}
                              onChange={(e) =>
                                handleChange(course._id, etudiant._id, field, e.target.value)
                              }
                            />
                          </td>
                        ))}

                        <td className="py-3 px-6 font-semibold text-indigo-700 text-center">
                          {isNaN(moyenne) ? "-" : moyenne}
                        </td>

                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => handleSave(course._id, etudiant._id)}
                            disabled={saving[etudiant._id]}
                            className={`inline-flex items-center gap-2 justify-center
                              px-5 py-1 rounded text-white
                              ${
                                saving[etudiant._id]
                                  ? "bg-indigo-300 cursor-not-allowed"
                                  : "bg-indigo-600 hover:bg-indigo-700"
                              }
                              transition-colors duration-200`}
                          >
                            {saving[etudiant._id] ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                              </>
                            ) : (
                              "Enregistrer"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
