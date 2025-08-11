import React, { useState, useEffect, useContext } from "react";
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
  BarChart3,
  Target,
  Calculator,
  Sparkles,
  Zap,
  Trophy,
  Calendar,
  Clock,
  UserX,
  UserPlus,
  CheckSquare,
  XSquare
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function AbsencesProfesseur() {
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [absences, setAbsences] = useState({});
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const [courseStats, setCourseStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    totalAbsences: 0,
    attendanceRate: 0
  });
  const today = new Date().toISOString().split("T")[0];

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 1. Charger une seule fois la liste des cours (normalisée en tableau)
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5001/api/courses/teacher", authHeaders)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
        setCoursList(data);
      })
      .catch((err) => {
        console.error("Erreur chargement cours :", err);
        setErrorMessage("Erreur lors du chargement des cours");
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Sélectionner un cours et reset attendance
  const handleSelectCours = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/courses/${id}`, authHeaders);
      setSelectedCours(data);
      setAttendance({});
    } catch (err) {
      console.error("Erreur cours sélectionné :", err);
      setErrorMessage("Erreur lors de la sélection du cours");
    }
  };

  // 3. Charger les absences existantes pour le cours sélectionné
  useEffect(() => {
    if (!selectedCours) return;

    axios
      .get(`http://localhost:5001/api/absences/cours/${selectedCours._id}`, authHeaders)
      .then(({ data }) => {
        const mapped = {};
        data.forEach((abs) => {
          const id = abs.student?._id || abs.etudiant;
          if (!mapped[id]) mapped[id] = [];
          mapped[id].push(abs.date.split("T")[0]);
        });
        setAbsences(mapped);
      })
      .catch((err) => {
        console.error("Erreur chargement absences :", err);
        setAbsences({});
      });
  }, [selectedCours]);

  // 4. Calculer les statistiques du cours
  useEffect(() => {
    if (!selectedCours) return;

    const students = selectedCours.etudiants || [];
    const totalStudents = students.length;
    const presentToday = Object.values(attendance).filter(Boolean).length;
    const absentToday = totalStudents - presentToday;
    const totalAbsences = Object.values(absences).reduce((sum, dates) => sum + dates.length, 0);
    const attendanceRate = totalStudents > 0 ? ((totalStudents - totalAbsences) / totalStudents * 100).toFixed(1) : 0;

    setCourseStats({
      totalStudents,
      presentToday,
      absentToday,
      totalAbsences,
      attendanceRate
    });
  }, [selectedCours, attendance, absences]);

  const toggleLocalAbsence = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = async () => {
    if (!selectedCours) return;
    
    setSaving(true);
    try {
      // Préparer les données selon le format attendu par le backend
      const attendanceData = {};
      Object.entries(attendance).forEach(([studentId, isPresent]) => {
        attendanceData[studentId] = !isPresent; // Inverser car le backend attend true pour absent
      });

      const payload = {
        courseId: selectedCours._id,
        attendance: attendanceData
      };

      console.log("Absences à sauvegarder:", payload);

      const response = await axios.post("http://localhost:5001/api/absences", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Réponse du serveur:", response.data);

      setSuccessMessage("Absences enregistrées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Réinitialiser les absences locales
      setAttendance({});
      
    } catch (err) {
      console.error("Erreur sauvegarde absences :", err);
      setErrorMessage("Erreur lors de la sauvegarde des absences: " + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden text-gray-800">
      
      {/* Header avec animations améliorées */}
      <motion.div 
        className="bg-white shadow-lg border-b border-blue-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Titre et icône avec animations */}
            <motion.div 
              className="flex items-center gap-6"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserX className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Gestion des Absences
                </motion.h1>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Suivi de la présence des étudiants
                </motion.p>
              </div>
            </motion.div>
            
            {/* Statistiques avec animations améliorées */}
            <motion.div 
              className="flex items-center gap-6"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { value: coursList.length, label: "Cours", color: "blue" },
                { value: selectedCours?.etudiants?.length || 0, label: "Étudiants", color: "emerald" },
                { value: Object.values(absences).reduce((sum, dates) => sum + dates.length, 0), label: "Absences", color: "red" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`text-center p-4 bg-${stat.color}-50 rounded-xl border border-${stat.color}-200`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                  <div className={`text-sm text-${stat.color}-600 font-medium`}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Messages de notification avec animations améliorées */}
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {loading ? (
            <motion.div 
              className="flex justify-center items-center h-[60vh]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center">
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
              </div>
            </motion.div>
          ) : !selectedCours ? (
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Sélectionner un Cours
                </motion.h2>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Choisissez le cours pour gérer les absences
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursList.map((cours, index) => (
                  <motion.div
                    key={cours._id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleSelectCours(cours._id)}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="p-3 bg-white/80 rounded-xl shadow-md"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-800 text-lg mb-1">
                          {cours.nom} — {cours.classe}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {cours.matiere?.nom || "Matière non définie"}
                        </p>
                        <p className="text-blue-500 text-xs mt-1">
                          {cours.etudiants?.length || 0} étudiants
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header du cours sélectionné avec animations */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {selectedCours.nom} — {selectedCours.classe}
                        </h2>
                        <p className="text-blue-100 text-sm font-medium">
                          {selectedCours.matiere?.nom || "Matière non définie"}
                        </p>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-right text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold">{courseStats.totalStudents}</div>
                      <div className="text-blue-100 text-sm font-medium">Étudiants</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Statistiques avec animations */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { value: courseStats.totalStudents, label: "Total", color: "blue" },
                      { value: courseStats.presentToday, label: "Présents", color: "emerald" },
                      { value: courseStats.absentToday, label: "Absents", color: "red" },
                      { value: courseStats.attendanceRate + "%", label: "Taux", color: "amber" }
                    ].map((stat, index) => (
                                             <motion.div 
                         key={stat.label}
                         className={`text-center p-4 rounded-xl bg-white shadow-lg border border-gray-100`}
                         whileHover={{ scale: 1.05, y: -3 }}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ 
                           delay: 0.3 + index * 0.1,
                           type: "spring", 
                           stiffness: 300 
                         }}
                       >
                        <div className={`text-2xl font-bold text-${stat.color}-600`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm text-${stat.color}-600 font-medium`}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Liste des étudiants avec animations améliorées */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Users className="w-6 h-6" />
                    Liste des étudiants
                  </motion.h3>
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg disabled:opacity-50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {saving ? (
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCours.etudiants?.map((student, index) => {
                    const isPresent = attendance[student._id];
                    const studentAbsences = absences[student._id] || [];
                    const totalAbsences = studentAbsences.length;

                    return (
                      <motion.div
                        key={student._id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`rounded-xl p-4 shadow-lg border transition-all duration-300 ${
                          isPresent 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isPresent ? 'bg-emerald-100' : 'bg-red-100'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {isPresent ? (
                              <CheckSquare className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <XSquare className="w-6 h-6 text-red-600" />
                            )}
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

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Présence aujourd'hui</span>
                            <motion.button
                              onClick={() => toggleLocalAbsence(student._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                                isPresent
                                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {isPresent ? 'Présent' : 'Absent'}
                            </motion.button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total absences</span>
                            <span className="text-sm font-semibold text-amber-600">
                              {totalAbsences} jour(s)
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
