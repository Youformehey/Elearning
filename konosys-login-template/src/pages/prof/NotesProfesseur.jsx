import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  UserCheck,
  ClipboardList,
  FileText,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Users,
  Star,
  Award,
  BarChart3,
  Target,
  Calculator,
  Sparkles,
  Zap
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesProfesseur() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const [globalStats, setGlobalStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    globalAverage: 0,
    bestCourse: null,
    bestStudent: null
  });
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const email = userInfo?.email;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Chargement des cours
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/courses/teacher",
          authHeaders
        );
        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
        setCourses(data.filter((c) => c.teacher?.email === email));
      } catch (err) {
        console.error("Erreur chargement cours :", err);
        setErrorMessage("Erreur lors du chargement des cours");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [email]);

  // Chargement des notes
  useEffect(() => {
    async function loadNotes() {
      const obj = {};
      for (const course of courses) {
        try {
          const res = await axios.get(
            `http://localhost:5001/api/notes/cours/${course._id}`,
            authHeaders
          );
          res.data.forEach((n) => {
            if (!obj[course._id]) obj[course._id] = {};
            obj[course._id][n.etudiant._id] = {
              ...(obj[course._id][n.etudiant._id] || {}),
              [n.devoir.toLowerCase()]: n.note,
            };
          });
        } catch {}
      }
      setNotes(obj);
    }
    if (courses.length) loadNotes();
  }, [courses]);

  // Calculer les statistiques globales
  useEffect(() => {
    if (courses.length && Object.keys(notes).length) {
      const uniqueStudentIds = new Set();
      let allAverages = [];
      let courseAverages = [];
      let bestStudent = null;
      let bestStudentAvg = 0;
      let totalNotes = 0;
      let totalNoteSum = 0;

      courses.forEach(course => {
        const uniqueStudents = course.etudiants.filter(
          (s, idx, arr) => arr.findIndex((u) => u._id === s._id) === idx
        );

        let courseTotal = 0;
        let courseCount = 0;

        uniqueStudents.forEach(student => {
          uniqueStudentIds.add(student._id);
          
          const studentNotes = notes[course._id]?.[student._id] || {};
          const avg = calculateAverage(studentNotes);
          
          if (avg > 0) {
            allAverages.push(avg);
            courseTotal += avg;
            courseCount++;
          }

          Object.values(studentNotes).forEach(note => {
            const noteValue = parseFloat(note);
            if (!isNaN(noteValue) && noteValue > 0) {
              totalNotes++;
              totalNoteSum += noteValue;
            }
          });

          if (avg > bestStudentAvg) {
            bestStudentAvg = avg;
            bestStudent = { name: student.name, course: course.matiere?.nom, average: avg };
          }
        });

        if (courseCount > 0) {
          courseAverages.push({
            course: course.matiere?.nom,
            average: courseTotal / courseCount,
            students: courseCount
          });
        }
      });

      const globalAvg = totalNotes > 0 ? (totalNoteSum / totalNotes).toFixed(2) : 0;
      const bestCourse = courseAverages.reduce((best, current) => 
        current.average > best.average ? current : best, courseAverages[0] || null);

      setGlobalStats({
        totalStudents: uniqueStudentIds.size,
        totalCourses: courses.length,
        globalAverage: globalAvg,
        bestCourse,
        bestStudent
      });
    }
  }, [courses, notes]);

  // Modifier une note en local
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

  // Enregistrer les 4 critères
  const handleSave = async (courseId, studentId) => {
    const values = notes[courseId]?.[studentId];
    if (!values) return;
    setSaving((prev) => ({ ...prev, [studentId]: true }));
    setSuccessMessage("");
    setErrorMessage("");

    try {
      for (const devoir of [
        "participation",
        "assiduite",
        "comportement",
        "devoir_maison",
      ]) {
        const noteVal = parseFloat(values[devoir]);
        if (!isNaN(noteVal)) {
          await axios.post(
            "http://localhost:5001/api/notes/add",
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
      setSuccessMessage("✅ Notes enregistrées avec succès !");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch {
      setErrorMessage("❌ Erreur lors de l'enregistrement des notes");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setSaving((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // Calculer la moyenne d'un étudiant
  const calculateAverage = (studentNotes) => {
    const values = Object.values(studentNotes).filter(v => !isNaN(parseFloat(v)));
    if (values.length === 0) return 0;
    return (values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length).toFixed(2);
  };

  // Obtenir la couleur selon la note
  const getNoteColor = (note) => {
    const num = parseFloat(note);
    if (isNaN(num)) return "text-gray-400";
    if (num >= 16) return "text-emerald-600";
    if (num >= 14) return "text-blue-600";
    if (num >= 12) return "text-amber-600";
    if (num >= 10) return "text-orange-600";
    return "text-red-600";
  };

  // Obtenir le statut de performance
  const getPerformanceStatus = (average) => {
    const num = parseFloat(average);
    if (num >= 16) return { text: "Excellent", color: "bg-emerald-100 text-emerald-800", icon: Sparkles };
    if (num >= 14) return { text: "Très bien", color: "bg-blue-100 text-blue-800", icon: TrendingUp };
    if (num >= 12) return { text: "Bien", color: "bg-amber-100 text-amber-800", icon: Star };
    if (num >= 10) return { text: "Passable", color: "bg-orange-100 text-orange-800", icon: Target };
    return { text: "Insuffisant", color: "bg-red-100 text-red-800", icon: AlertCircle };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-700 font-medium"
          >
            Chargement des cours...
          </motion.p>
        </motion.div>
      </div>
    );

  if (!courses.length)
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gradient-to-br from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-blue-600 font-medium">Aucun cours disponible</p>
          <p className="text-blue-400 mt-2">Vous n'avez pas encore de cours assignés</p>
        </motion.div>
      </div>
    );

  // Définit les colonnes des critères
  const critères = [
    { key: "participation", label: "Participation", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
    { key: "assiduite", label: "Assiduité", icon: Users, color: "bg-emerald-100 text-emerald-700" },
    { key: "comportement", label: "Comportement", icon: Star, color: "bg-amber-100 text-amber-700" },
    { key: "devoir_maison", label: "Devoir Maison", icon: Award, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
      {/* Header avec notifications */}
      <motion.div 
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-blue-200'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ClipboardList className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent'}`}>
                  Gestion des Notes
                </h1>
                <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Suivi et évaluation des étudiants</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-blue-600 font-medium">{courses.length} cours</p>
                <p className="text-xs text-blue-400">En cours de gestion</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Messages de notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {courses.map((course, courseIndex) => {
            // On filtre les doublons d'étudiants
            const uniqueStudents = course.etudiants.filter(
              (s, idx, arr) => arr.findIndex((u) => u._id === s._id) === idx
            );

            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: courseIndex * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
              >
                {/* Header du cours */}
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6"
                  whileHover={{ background: "linear-gradient(to right, #2563eb, #1d4ed8)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-white/20 rounded-xl"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {course.matiere?.nom || "Matière inconnue"}
                        </h2>
                        <p className="text-blue-100 font-medium">
                          Classe {course.classe} • {uniqueStudents.length} étudiants
                        </p>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-right text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold">{uniqueStudents.length}</div>
                      <div className="text-blue-100 text-sm">Étudiants</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Tableau des notes */}
                <div className="p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <tr>
                          <th className="py-4 px-6 text-left font-bold text-blue-800 flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            Étudiant
                          </th>
                          {critères.map((c) => (
                            <th key={c.key} className="py-4 px-4 text-center">
                              <motion.div 
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${c.color}`}
                                whileHover={{ scale: 1.05 }}
                              >
                                <c.icon className="w-4 h-4" />
                                <span className="font-semibold text-sm">{c.label}</span>
                              </motion.div>
                            </th>
                          ))}
                          <th className="py-4 px-6 text-center font-bold text-blue-800">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700">
                              <BarChart3 className="w-4 h-4" />
                              <span className="font-semibold text-sm">Moyenne</span>
                            </div>
                          </th>
                          <th className="py-4 px-6 text-center font-bold text-blue-800">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700">
                              <Target className="w-4 h-4" />
                              <span className="font-semibold text-sm">Action</span>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-blue-100">
                        {uniqueStudents.length === 0 && (
                          <tr>
                            <td colSpan={critères.length + 3} className="py-12 text-center">
                              <motion.div 
                                className="text-blue-400"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-lg font-medium">Aucun étudiant inscrit</p>
                                <p className="text-sm">Les étudiants apparaîtront ici une fois inscrits</p>
                              </motion.div>
                            </td>
                          </tr>
                        )}

                        {uniqueStudents.map((etudiant, studentIndex) => {
                          const studentNotes = notes[course._id]?.[etudiant._id] || {};
                          const moyenne = calculateAverage(studentNotes);
                          const performance = getPerformanceStatus(moyenne);
                          
                          return (
                            <motion.tr
                              key={`${course._id}-${etudiant._id}`}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: studentIndex * 0.05,
                                type: "spring",
                                stiffness: 100
                              }}
                              whileHover={{ 
                                backgroundColor: "rgba(59, 130, 246, 0.05)",
                                scale: 1.01
                              }}
                              className="transition-all duration-200"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <motion.div 
                                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    {etudiant.name.charAt(0).toUpperCase()}
                                  </motion.div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{etudiant.name}</p>
                                    <p className="text-sm text-gray-500">Étudiant</p>
                                  </div>
                                </div>
                              </td>
                              
                              {critères.map((c) => (
                                <td key={c.key} className="py-4 px-4 text-center">
                                  <div className="flex justify-center">
                                    <motion.input
                                      type="number"
                                      min={0}
                                      max={20}
                                      step={0.5}
                                      className={`w-20 px-3 py-2 rounded-lg border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-center font-semibold transition-all duration-200 ${getNoteColor(studentNotes[c.key])}`}
                                      value={studentNotes[c.key] ?? ""}
                                      onChange={(e) =>
                                        handleChange(
                                          course._id,
                                          etudiant._id,
                                          c.key,
                                          e.target.value
                                        )
                                      }
                                      placeholder="0-20"
                                      whileFocus={{ scale: 1.05 }}
                                    />
                                  </div>
                                </td>
                              ))}

                              <td className="py-4 px-6 text-center">
                                <motion.div 
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${getNoteColor(moyenne)}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <performance.icon className="w-5 h-5" />
                                  {moyenne}
                                </motion.div>
                                <motion.div 
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mt-1 ${performance.color}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  {performance.text}
                                </motion.div>
                              </td>
                              
                              <td className="py-4 px-6 text-center">
                                <motion.button
                                  onClick={() => handleSave(course._id, etudiant._id)}
                                  disabled={saving[etudiant._id]}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    saving[etudiant._id]
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                                  }`}
                                >
                                  {saving[etudiant._id] ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Enregistrement...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4" />
                                      Enregistrer
                                    </>
                                  )}
                                </motion.button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
