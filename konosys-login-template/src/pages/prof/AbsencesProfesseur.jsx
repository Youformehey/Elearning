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
      const absencesToSave = Object.entries(attendance)
        .filter(([_, isPresent]) => !isPresent)
        .map(([studentId]) => ({
          student: studentId,
          course: selectedCours._id,
          date: today,
          justified: false
        }));

      await Promise.all(
        absencesToSave.map(abs => 
          axios.post("http://localhost:5001/api/absences", abs, authHeaders)
        )
      );

      setSuccessMessage("Absences enregistrées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur sauvegarde absences :", err);
      setErrorMessage("Erreur lors de la sauvegarde des absences");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
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
            Chargement des cours...
          </motion.p>
        </motion.div>
      </div>
    );
  }

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
                className="p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UserX className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent'}`}>
                  Gestion des Absences
                </h1>
                <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-red-600'}`}>Suivi de la présence des étudiants</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-red-600 font-medium">{coursList.length} cours</p>
                <p className="text-xs text-red-400">En cours de gestion</p>
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
          {/* Sélection du cours */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
          >
            <motion.div 
              className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6"
              whileHover={{ background: "linear-gradient(to right, #dc2626, #b91c1c)" }}
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
                    <h2 className="text-2xl font-bold text-white">Sélectionner un Cours</h2>
                    <p className="text-red-100 font-medium">Choisissez le cours pour gérer les absences</p>
                  </div>
                </div>
                
                <motion.div 
                  className="text-right text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold">{coursList.length}</div>
                  <div className="text-red-100 text-sm">Cours disponibles</div>
                </motion.div>
              </div>
            </motion.div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coursList.map((cours, index) => (
                  <motion.button
                    key={cours._id}
                    onClick={() => handleSelectCours(cours._id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedCours?._id === cours._id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        selectedCours?._id === cours._id
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          selectedCours?._id === cours._id
                            ? 'text-red-700'
                            : 'text-gray-800'
                        }`}>
                          {cours.nom}
                        </h3>
                        <p className={`text-sm ${
                          selectedCours?._id === cours._id
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}>
                          {cours.classe} • {cours.matiere?.nom || "Matière non définie"}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Statistiques du cours sélectionné */}
          {selectedCours && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
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
                      <Users className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedCours.nom} — {selectedCours.classe}
                      </h2>
                      <p className="text-blue-100 font-medium">
                        Gestion des présences pour aujourd'hui ({today})
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      saving
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enregistrement...
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

              <div className="p-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 text-white rounded-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-800">{courseStats.totalStudents}</p>
                        <p className="text-sm text-blue-600">Total étudiants</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 text-white rounded-lg">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-800">{courseStats.presentToday}</p>
                        <p className="text-sm text-green-600">Présents aujourd'hui</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500 text-white rounded-lg">
                        <UserX className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-800">{courseStats.absentToday}</p>
                        <p className="text-sm text-red-600">Absents aujourd'hui</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500 text-white rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-800">{courseStats.totalAbsences}</p>
                        <p className="text-sm text-orange-600">Total absences</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 text-white rounded-lg">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-800">{courseStats.attendanceRate}%</p>
                        <p className="text-sm text-purple-600">Taux de présence</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Liste des étudiants */}
                {selectedCours.etudiants && selectedCours.etudiants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCours.etudiants.map((student, index) => {
                      const isPresent = attendance[student._id] !== false;
                      const absenceCount = absences[student._id]?.length || 0;
                      
                      return (
                        <motion.div
                          key={student._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            isPresent
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                          onClick={() => toggleLocalAbsence(student._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              isPresent
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : 'bg-gradient-to-r from-red-500 to-red-600'
                            }`}>
                              {isPresent ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <XSquare className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${
                                isPresent
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}>
                                {student.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {student.email}
                              </p>
                              <p className={`text-xs font-medium ${
                                isPresent
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                {isPresent ? 'Présent' : 'Absent'} • {absenceCount} absence(s)
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-lg text-gray-600 font-medium">Aucun étudiant inscrit</p>
                    <p className="text-gray-400 mt-2">Les étudiants apparaîtront ici une fois inscrits</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
