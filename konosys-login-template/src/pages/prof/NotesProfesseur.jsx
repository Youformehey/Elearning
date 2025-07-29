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
    setSaving((prev) => ({ ...prev, [`${courseId}_${studentId}`]: true }));
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
      setSaving((prev) => ({ ...prev, [`${courseId}_${studentId}`]: false }));
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
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">
      
      {/* Header ultra-moderne avec effets 3D */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-6 px-8 shadow-2xl relative overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Effet de brillance amélioré */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          animate={{ x: [-200, 400] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Effet de particules */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-white rounded-full" />
          <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Titre et icône avec effets 3D */}
            <motion.div 
              className="flex items-center gap-8"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-5 bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden"
                whileHover={{ scale: 1.2, rotate: 15, y: -10 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Effet de brillance sur l'icône */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-50, 50] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <ClipboardList className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Gestion des Notes
                </motion.h1>
                <motion.p 
                  className="text-blue-100 font-medium text-lg"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Suivi et évaluation des étudiants
                </motion.p>
              </div>
            </motion.div>
            
            {/* Statistiques avec effets 3D */}
            <motion.div 
              className="flex items-center gap-10"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">{courses.length}</div>
                <div className="text-blue-100 text-sm font-medium">Cours</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">{globalStats.totalStudents}</div>
                <div className="text-blue-100 text-sm font-medium">Étudiants</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">{globalStats.globalAverage}</div>
                <div className="text-blue-100 text-sm font-medium">Moyenne</div>
              </motion.div>
            </motion.div>
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
              className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-base backdrop-blur-sm"
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
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-base backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="space-y-6"
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
                whileHover={{ y: -12, scale: 1.03, rotateY: 2 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500 relative group"
              >
                {/* Header du cours avec effets 3D */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-6 relative overflow-hidden">
                  {/* Effet de brillance sur le header */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-white/25 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                        whileHover={{ scale: 1.15, rotate: 15, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300,
                          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                          {course.nom} — {course.classe}
                        </h2>
                        <p className="text-blue-100 font-medium text-base">
                          {course.matiere?.nom || "Matière non définie"}
                        </p>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-right text-white p-3 bg-white/15 rounded-2xl backdrop-blur-sm"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl font-bold">{uniqueStudents.length}</div>
                      <div className="text-blue-100 text-sm font-medium">Étudiants</div>
                    </motion.div>
                  </div>
                </div>

                {/* Contenu du cours */}
                <div className="p-6 sm:p-8">
                  {uniqueStudents.length === 0 ? (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg text-blue-600 font-medium mb-2">Aucun étudiant inscrit</h3>
                      <p className="text-blue-400">Les étudiants apparaîtront ici une fois inscrits</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* Navigation des critères */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {critères.map((critère, idx) => (
                          <motion.button
                            key={critère.key}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${critère.color}`}
                          >
                            <critère.icon className="w-4 h-4" />
                            <span className="text-sm">{critère.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Tableau des étudiants */}
                      <div className="overflow-x-auto">
                        <div className="min-w-full bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                            {uniqueStudents.map((student, studentIndex) => {
                              const studentNotes = notes[course._id]?.[student._id] || {};
                              const average = calculateAverage(studentNotes);
                              const status = getPerformanceStatus(average);

                              return (
                                <motion.div
                                  key={student._id}
                                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ delay: studentIndex * 0.1 }}
                                  whileHover={{ scale: 1.02, y: -3 }}
                                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3 mb-4">
                                    <motion.div
                                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        status === 'excellent' ? 'bg-emerald-100' :
                                        status === 'bon' ? 'bg-blue-100' :
                                        status === 'moyen' ? 'bg-amber-100' : 'bg-red-100'
                                      }`}
                                      whileHover={{ scale: 1.1, rotate: 360 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <UserCheck className={`w-6 h-6 ${
                                        status === 'excellent' ? 'text-emerald-600' :
                                        status === 'bon' ? 'text-blue-600' :
                                        status === 'moyen' ? 'text-amber-600' : 'text-red-600'
                                      }`} />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-gray-900 truncate">
                                        {student.name || student.email}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate">
                                        {student.email}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notes par critère */}
                                  <div className="space-y-3">
                                    {critères.map((critère) => (
                                      <div key={critère.key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <critère.icon className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">{critère.label}</span>
                                        </div>
                                        <motion.input
                                          type="number"
                                          min="0"
                                          max="20"
                                          step="0.5"
                                          value={studentNotes[critère.key] || ""}
                                          onChange={(e) => handleChange(course._id, student._id, critère.key, e.target.value)}
                                          className={`w-16 px-2 py-1 text-center rounded-lg border-2 focus:ring-2 focus:outline-none transition-all duration-300 ${
                                            getNoteColor(studentNotes[critère.key] || 0)
                                          }`}
                                          whileFocus={{ scale: 1.05 }}
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Moyenne et actions */}
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-600">Moyenne</span>
                                      <motion.span 
                                        className={`text-lg font-bold px-3 py-1 rounded-full ${
                                          getNoteColor(average)
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {typeof average === 'number' ? average.toFixed(1) : parseFloat(average || 0).toFixed(1)}
                                      </motion.span>
                                    </div>
                                    <motion.button
                                      onClick={() => handleSave(course._id, student._id)}
                                      disabled={saving[`${course._id}_${student._id}`]}
                                      whileHover={{ scale: 1.02, y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                      {saving[`${course._id}_${student._id}`] ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Sauvegarde...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-4 h-4" />
                                          Sauvegarder
                                        </>
                                      )}
                                    </motion.button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
