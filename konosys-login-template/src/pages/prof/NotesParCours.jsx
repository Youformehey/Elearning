import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  Target,
  BarChart3,
  GraduationCap,
  Calculator,
  Sparkles,
  Zap,
  Trophy
} from "lucide-react";

const NotesParCours = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [localNotes, setLocalNotes] = useState({}); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [courseStats, setCourseStats] = useState({
    totalStudents: 0,
    courseAverage: 0,
    bestStudent: null,
    worstStudent: null,
    participationAvg: 0,
    assiduiteAvg: 0,
    comportementAvg: 0,
    devoirAvg: 0
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => {
        console.error("Erreur chargement cours:", err);
        setErrorMessage("Erreur lors du chargement du cours");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/notes/cours/${courseId}`)
      .then(res => setNotes(res.data))
      .catch(err => {
        console.error("Erreur chargement notes:", err);
        setErrorMessage("Erreur lors du chargement des notes");
      });
  }, [courseId]);

  // récupère la note existante ou la valeur modifiée
  const getNoteValue = (etudiantId, devoirKey) => {
    // priorité au local
    if (localNotes[etudiantId]?.[devoirKey] !== undefined) {
      return localNotes[etudiantId][devoirKey];
    }
    // sinon cherche dans notes[]
    const noteObj = notes.find(
      n => n.etudiant._id === etudiantId && n.devoir.toLowerCase() === devoirKey
    );
    return noteObj ? noteObj.note : "";
  };

  const handleChangeNote = (etudiantId, devoirKey, valeur) => {
    setLocalNotes(prev => ({
      ...prev,
      [etudiantId]: {
        ...(prev[etudiantId] || {}),
        [devoirKey]: valeur,
      },
    }));
  };

  const handleSaveNote = async etudiantId => {
    if (!localNotes[etudiantId]) return;
    setSavingId(etudiantId);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const devoirs = localNotes[etudiantId];
      // envoie simultané de toutes les clefs
      await Promise.all(
        Object.entries(devoirs).map(([devoirKey, note]) =>
          axios.post("http://localhost:5000/api/notes/add", {
            etudiant: etudiantId,
            cours: courseId,
            devoir: devoirKey.toUpperCase(),
            note: Number(note),
            enseignant: course.enseignant,
          })
        )
      );
      // rechargement des notes
      const res = await axios.get(`http://localhost:5000/api/notes/cours/${courseId}`);
      setNotes(res.data);
      // on nettoie le local pour cet étudiant
      setLocalNotes(prev => {
        const copy = { ...prev };
        delete copy[etudiantId];
        return copy;
      });
      setSuccessMessage("✅ Notes enregistrées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur enregistrement note :", err);
      setErrorMessage("❌ Erreur lors de l'enregistrement des notes");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSavingId(null);
    }
  };

  // Calculer la moyenne d'un étudiant
  const calculateAverage = (studentId) => {
    const values = critères.map(c => Number(getNoteValue(studentId, c.key)) || 0);
    const validValues = values.filter(v => v > 0);
    if (validValues.length === 0) return 0;
    return (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(2);
  };

  // Calculer les statistiques du cours
  useEffect(() => {
    if (course && course.etudiants && course.etudiants.length > 0) {
      const students = course.etudiants;
      let totalStudents = students.length;
      let allAverages = [];
      let bestStudent = null;
      let worstStudent = null;
      let bestAvg = 0;
      let worstAvg = 20;

      // Calculer les moyennes par critère
      let participationSum = 0, participationCount = 0;
      let assiduiteSum = 0, assiduiteCount = 0;
      let comportementSum = 0, comportementCount = 0;
      let devoirSum = 0, devoirCount = 0;

      students.forEach(student => {
        const avg = calculateAverage(student._id);
        if (avg > 0) {
          allAverages.push(avg);
          
          if (avg > bestAvg) {
            bestAvg = avg;
            bestStudent = { name: student.name, average: avg };
          }
          if (avg < worstAvg && avg > 0) {
            worstAvg = avg;
            worstStudent = { name: student.name, average: avg };
          }
        }

        // Calculer les moyennes par critère
        const participation = Number(getNoteValue(student._id, 'participation'));
        const assiduite = Number(getNoteValue(student._id, 'assiduite'));
        const comportement = Number(getNoteValue(student._id, 'comportement'));
        const devoir = Number(getNoteValue(student._id, 'devoir_maison'));

        if (participation > 0) { participationSum += participation; participationCount++; }
        if (assiduite > 0) { assiduiteSum += assiduite; assiduiteCount++; }
        if (comportement > 0) { comportementSum += comportement; comportementCount++; }
        if (devoir > 0) { devoirSum += devoir; devoirCount++; }
      });

      const courseAvg = allAverages.length > 0 ? 
        (allAverages.reduce((a, b) => a + b, 0) / allAverages.length).toFixed(2) : 0;

      setCourseStats({
        totalStudents,
        courseAverage: courseAvg,
        bestStudent,
        worstStudent,
        participationAvg: participationCount > 0 ? (participationSum / participationCount).toFixed(2) : 0,
        assiduiteAvg: assiduiteCount > 0 ? (assiduiteSum / assiduiteCount).toFixed(2) : 0,
        comportementAvg: comportementCount > 0 ? (comportementSum / comportementCount).toFixed(2) : 0,
        devoirAvg: devoirCount > 0 ? (devoirSum / devoirCount).toFixed(2) : 0
      });
    }
  }, [course, notes, localNotes]);

  // Obtenir la couleur selon la note
  const getNoteColor = (note) => {
    const num = parseFloat(note);
    if (isNaN(num) || num === 0) return "text-gray-400";
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

  if (loading) {
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
            Chargement du cours...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
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
            <AlertCircle className="w-20 h-20 text-red-300 mx-auto mb-4" />
          </motion.div>
          <p className="text-xl text-red-600 font-medium">Cours introuvable</p>
          <p className="text-red-400 mt-2">Le cours demandé n'existe pas ou a été supprimé</p>
        </motion.div>
      </div>
    );
  }

  // définition des colonnes
  const critères = [
    { key: "participation", label: "Participation", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
    { key: "assiduite", label: "Assiduité", icon: Users, color: "bg-emerald-100 text-emerald-700" },
    { key: "comportement", label: "Comportement", icon: Star, color: "bg-amber-100 text-amber-700" },
    { key: "devoir_maison", label: "Devoir Maison", icon: Award, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header avec notifications */}
      <motion.div 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-200"
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
                <GraduationCap className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                  Notes du Cours
                </h1>
                <p className="text-blue-600 font-medium">
                  {course.matiere} — Classe {course.classe}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-blue-600 font-medium">{course.etudiants?.length || 0} étudiants</p>
                <p className="text-xs text-blue-400">Inscrits au cours</p>
              </motion.div>
              <div className="h-8 w-px bg-blue-200"></div>
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-blue-600 font-medium">4 critères</p>
                <p className="text-xs text-blue-400">D'évaluation</p>
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
          {/* Carte d'informations du cours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
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
                    <BookOpen className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {course.matiere}
      </h2>
                    <p className="text-blue-100 font-medium">
                      Classe {course.classe} • {course.etudiants?.length || 0} étudiants inscrits
                    </p>
                  </div>
                </div>
                
                <motion.div 
                  className="text-right text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold">{course.etudiants?.length || 0}</div>
                  <div className="text-blue-100 text-sm">Étudiants</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Tableau des notes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
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
                  {(!course.etudiants || course.etudiants.length === 0) && (
                    <tr>
                      <td colSpan={critères.length + 3} className="py-12 text-center">
                        <motion.div 
                          className="text-blue-400"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">Aucun étudiant inscrit</p>
                          <p className="text-sm">Les étudiants apparaîtront ici une fois inscrits au cours</p>
                        </motion.div>
                      </td>
                    </tr>
                  )}

                  {course.etudiants?.map((student, i) => {
                    const moyenne = calculateAverage(student._id);
                    const performance = getPerformanceStatus(moyenne);

              return (
                <motion.tr
                  key={student._id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: i * 0.05,
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
                              {student.name.charAt(0).toUpperCase()}
                            </motion.div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">Étudiant</p>
                            </div>
                          </div>
                        </td>

                  {critères.map(c => (
                          <td key={c.key} className="py-4 px-4 text-center">
                            <div className="flex justify-center">
                              <motion.input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                                className={`w-20 px-3 py-2 rounded-lg border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-center font-semibold transition-all duration-200 ${getNoteColor(getNoteValue(student._id, c.key))}`}
                        value={getNoteValue(student._id, c.key)}
                        onChange={e => handleChangeNote(student._id, c.key, e.target.value)}
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
                      disabled={!localNotes[student._id] || savingId === student._id}
                      onClick={() => handleSaveNote(student._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                              savingId === student._id || !localNotes[student._id]
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                            }`}
                          >
                            {savingId === student._id ? (
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
          </motion.div>

          {/* Bloc des statistiques du cours */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              stiffness: 100
            }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Calculator className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Statistiques du Cours</h2>
                  <p className="text-blue-100 font-medium">Analyse détaillée des performances</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Moyenne du cours */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-800">Moyenne du Cours</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.courseAverage}/20
                  </motion.div>
                  <p className="text-blue-600 text-sm mt-2">
                    Sur {courseStats.totalStudents} étudiants
                  </p>
                </motion.div>

                {/* Meilleur étudiant */}
                <motion.div
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-emerald-800">Meilleur Étudiant</h3>
                  </div>
                  <motion.div 
                    className="text-lg font-bold text-emerald-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.bestStudent ? courseStats.bestStudent.name : "N/A"}
                  </motion.div>
                  <p className="text-emerald-600 text-sm mt-2">
                    {courseStats.bestStudent ? `${courseStats.bestStudent.average}/20` : ""}
                  </p>
                </motion.div>

                {/* Moyenne par critère - Participation */}
                <motion.div
                  className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-600 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-amber-800">Participation</h3>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-amber-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.participationAvg}/20
                  </motion.div>
                  <p className="text-amber-600 text-sm mt-2">
                    Moyenne générale
                  </p>
                </motion.div>

                {/* Moyenne par critère - Assiduité */}
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Assiduité</h3>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-purple-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.assiduiteAvg}/20
                  </motion.div>
                  <p className="text-purple-600 text-sm mt-2">
                    Moyenne générale
                  </p>
                </motion.div>
              </div>

              {/* Deuxième ligne de statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Comportement */}
                <motion.div
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-orange-800">Comportement</h3>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-orange-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.comportementAvg}/20
                  </motion.div>
                  <p className="text-orange-600 text-sm mt-2">
                    Moyenne générale
                  </p>
                </motion.div>

                {/* Devoir Maison */}
                <motion.div
                  className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-600 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-pink-800">Devoir Maison</h3>
                  </div>
                  <motion.div 
                    className="text-2xl font-bold text-pink-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  >
                    {courseStats.devoirAvg}/20
                  </motion.div>
                  <p className="text-pink-600 text-sm mt-2">
                    Moyenne générale
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesParCours;
