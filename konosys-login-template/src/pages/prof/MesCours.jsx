import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Users,
  FileText,
  BookOpen,
  Trash2,
  MessageCircle,
  UserPlus,
  CheckCircle,
  XCircle,
  FolderOpen,
  FileQuestion,
  Loader2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Target,
  Calculator,
  Sparkles,
  Zap,
  Trophy,
  Calendar,
  Clock,
  Building,
  UserCheck,
  Eye,
  Edit3,
  Plus,
  GraduationCap,
  Award,
  Star,
  RefreshCw,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001/api";

export default function MesCoursProf() {
  const [coursProf, setCoursProf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChap, setShowAddChap] = useState({});
  const [newChapData, setNewChapData] = useState({});
  const [progress, setProgress] = useState({});
  const [openInscription, setOpenInscription] = useState({});
  const [emailInputByCourse, setEmailInputByCourse] = useState({});
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [openChapitres, setOpenChapitres] = useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    nom: "",
    matiere: "",
    classe: "",
    semestre: "",
    horaire: "",
    date: "",
    salle: "",
    groupe: "",
    duree: "120",
  });
  const [matieres, setMatieres] = useState([]);
  const [loadingMatieres, setLoadingMatieres] = useState(true);
  const [absencesStats, setAbsencesStats] = useState({});
  const [openAbsence, setOpenAbsence] = useState({});
  const [courseStats, setCourseStats] = useState({});
  
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const teacherId = userInfo?._id;
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  // Fetch initial data
  useEffect(() => {
    if (!token) return;
    fetchCourses();
    fetchMatieres();
  }, [token]);

  // Fetch all courses + students + absence stats for each course
  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur chargement cours");
      const data = await res.json();
      const courses = data.courses || data;
      setCoursProf(courses);

      const studentsMap = {};
      const absStatsMap = {};
      const statsMap = {};
      
      await Promise.all(
        courses.map(async (course) => {
          // Fetch students for each course
          const resStud = await fetch(`${API_URL}/courses/${course._id}/students`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resStud.ok) {
            const studData = await resStud.json();
            studentsMap[course._id] = Array.isArray(studData)
              ? studData
              : studData.students || [];
          } else {
            studentsMap[course._id] = [];
          }

          // Fetch absence stats per course
          const resAbs = await fetch(`${API_URL}/absences/stats/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resAbs.ok) {
            const absData = await resAbs.json();
            const stats = {};
            (absData.absences || []).forEach((s) => {
              stats[s._id] = s;
            });
            absStatsMap[course._id] = stats;
          } else {
            absStatsMap[course._id] = {};
          }

          // Calculer les statistiques du cours
          const students = studentsMap[course._id] || [];
          const uniqueStudents = students.filter((s, idx, arr) => 
            arr.findIndex((u) => u._id === s._id) === idx
          );
          
          // Récupérer le nombre de séances pour ce cours
          const seancesRes = await fetch(`${API_URL}/seances/professeur`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          let totalSeances = 0;
          let completedSeances = 0;
          if (seancesRes.ok) {
            const seancesData = await seancesRes.json();
            const courseSeances = seancesData.filter(s => {
              const courseId = typeof s.course === 'object' ? s.course._id : s.course;
              return courseId === course._id;
            });
            totalSeances = courseSeances.length;
            completedSeances = courseSeances.filter(s => s.fait).length;
            
            console.log(`Cours ${course.nom}: ${totalSeances} séances totales, ${completedSeances} terminées`);
          }
          
          statsMap[course._id] = {
            totalStudents: uniqueStudents.length,
            totalChapitres: course.chapitres?.length || 0,
            totalSeances: totalSeances,
            completedSeances: completedSeances,
            totalAbsences: Object.keys(absStatsMap[course._id] || {}).length,
            averageAbsences: uniqueStudents.length > 0 ? 
              (Object.keys(absStatsMap[course._id] || {}).length / uniqueStudents.length).toFixed(1) : 0
          };
        })
      );
      setStudentsByCourse(studentsMap);
      setAbsencesStats(absStatsMap);
      setCourseStats(statsMap);

      // Dummy progress (à remplacer par données réelles)
      const prog = {};
      courses.forEach((course) => {
        course.chapitres?.forEach((chap) => {
          prog[chap._id] = 50;
        });
      });
      setProgress(prog);
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  // Fetch all subjects/matieres
  async function fetchMatieres() {
    setLoadingMatieres(true);
    try {
      const res = await fetch(`${API_URL}/matieres`);
      const data = await res.json();
      setMatieres(data);
    } catch (e) {
      setMatieres([]);
    } finally {
      setLoadingMatieres(false);
    }
  }

  // Add a new course
  async function handleAddCourse(e) {
    e.preventDefault();
    if (!form.nom.trim() || !form.matiere || !form.classe.trim()) {
      setErrorMessage("Les champs nom, matière et classe sont obligatoires.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      const payload = { ...form, teacher: teacherId };
      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur création cours");
      }
      setShowAddCourse(false);
      setForm({
        nom: "",
        matiere: "",
        classe: "",
        semestre: "",
        horaire: "",
        date: "",
        salle: "",
        groupe: "",
        duree: "120",
      });
      setSuccessMessage("✅ Cours ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses();
    } catch (error) {
      setErrorMessage("Erreur lors de l'ajout du cours : " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Gestion inscription élève
  async function handleInscrireEleve(courseId) {
    const email = emailInputByCourse[courseId]?.trim();
    if (!email) {
      setErrorMessage("Veuillez saisir un email valide.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    const alreadyEnrolled = studentsByCourse[courseId]?.some(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (alreadyEnrolled) {
      setErrorMessage("Utilisateur déjà inscrit à ce cours.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (res.status === 403 || res.status === 401) {
        setErrorMessage("Accès refusé : vous n'avez pas les droits pour inscrire un élève à ce cours.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur inscription élève");
      }
      await fetchStudentsForCourse(courseId);
      setEmailInputByCourse((prev) => ({ ...prev, [courseId]: "" }));
      setSuccessMessage("✅ Élève inscrit avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Erreur inscription : " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Fetch students list for a course
  async function fetchStudentsForCourse(courseId) {
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const studData = await res.json();
        const students = Array.isArray(studData)
          ? studData
          : studData.students || [];
        setStudentsByCourse((prev) => ({ ...prev, [courseId]: students }));
      }
    } catch (e) {}
  }

  // Supprimer un cours
  async function deleteCourse(id) {
    if (!window.confirm("Supprimer ce cours ?")) return;
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression cours");
      setSuccessMessage("✅ Cours supprimé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses();
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Supprimer un chapitre d'un cours
  async function deleteChapitre(courseId, chapId) {
    if (!window.confirm("Supprimer ce chapitre ?")) return;
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/chapitres/${chapId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression chapitre");
      setSuccessMessage("✅ Chapitre supprimé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses();
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Toggle formulaire ajout chapitre
  function toggleAddChapForm(courseId) {
    setShowAddChap((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
    setNewChapData((prev) => ({
      ...prev,
      [courseId]: { titre: "", description: "", order: 0 },
    }));
  }

  // Gérer la saisie d'un nouveau chapitre
  function handleNewChapChange(courseId, field, value) {
    setNewChapData((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], [field]: value },
    }));
  }

  // Ajouter un chapitre via API
  async function addChapitre(courseId) {
    const chap = newChapData[courseId];
    if (!chap?.titre || chap.titre.trim() === "") {
      setErrorMessage("Le titre est obligatoire");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/chapitres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(chap),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur création chapitre");
      }
      toggleAddChapForm(courseId);
      setSuccessMessage("✅ Chapitre ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses();
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Accordéon chapitres open/close
  function toggleChapitre(courseId, chapId) {
    setOpenChapitres((prev) => ({
      ...prev,
      [`${courseId}_${chapId}`]: !prev[`${courseId}_${chapId}`],
    }));
  }

  // Gestion suppression élève
  async function handleRemoveStudent(courseId, studentId) {
    if (!window.confirm("Supprimer cet élève du cours ?")) return;
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId }),
      });
      if (res.status === 403 || res.status === 401) {
        setErrorMessage("Accès refusé : vous n'avez pas les droits pour supprimer un élève de ce cours.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur suppression élève");
      }
      await fetchStudentsForCourse(courseId);
      setSuccessMessage("✅ Élève supprimé du cours !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Erreur suppression : " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Supprimer toutes les séances d'un cours
  async function deleteAllSeancesForCourse(course) {
    if (!window.confirm(`Supprimer toutes les séances pour le cours "${course.nom}" ?`)) return;
    try {
      const res = await fetch(`${API_URL}/courses/${course._id}/seances`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur suppression séances");
      }
      setSuccessMessage("✅ Séances supprimées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses(); // Rafraîchir la liste pour mettre à jour les statistiques
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression des séances : " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Générer les séances pour un cours
  async function generateSeancesForCourse(course) {
    if (!window.confirm(`Générer les séances pour le cours "${course.nom}" ?`)) return;
    try {
      const res = await fetch(`${API_URL}/courses/${course._id}/generate-seances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur génération séances");
      }
      setSuccessMessage("✅ Séances générées avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchCourses(); // Rafraîchir la liste pour mettre à jour les statistiques
    } catch (error) {
      setErrorMessage("Erreur lors de la génération des séances : " + error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  if (!token) return <p>Merci de vous connecter</p>;
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-[60vh] ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
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
            className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}
          >
            Chargement de vos cours...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">
      
      {/* Header ultra-moderne avec effets 3D */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8 px-10 shadow-2xl relative overflow-hidden"
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
                <BookOpen className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Mes Cours
                </motion.h1>
                <motion.p 
                  className="text-blue-100 font-medium text-xl"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Gestion de vos cours et étudiants
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
                <div className="text-4xl font-bold text-white mb-1">{coursProf.length}</div>
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
                <div className="text-4xl font-bold text-white mb-1">{Object.values(courseStats).reduce((sum, stats) => sum + (stats.totalStudents || 0), 0)}</div>
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
                <div className="text-4xl font-bold text-white mb-1">{Object.values(courseStats).reduce((sum, stats) => sum + (stats.totalChapitres || 0), 0)}</div>
                <div className="text-blue-100 text-sm font-medium">Chapitres</div>
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Formulaire ajout de cours */}
          {showAddCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-3 bg-white/20 rounded-2xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <UserPlus className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Ajouter un Cours</h2>
                      <p className="text-blue-100 font-medium">Créez un nouveau cours</p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setShowAddCourse(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleAddCourse} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <motion.input
                    type="text"
                    name="nom"
                    placeholder="Nom du cours"
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.select
                    name="matiere"
                    value={form.matiere}
                    onChange={(e) => setForm((f) => ({ ...f, matiere: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">-- Sélectionnez une matière --</option>
                    {matieres.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.nom.trim()}
                      </option>
                    ))}
                  </motion.select>
                  
                  <motion.input
                    type="text"
                    name="classe"
                    placeholder="Classe"
                    value={form.classe}
                    onChange={(e) => setForm((f) => ({ ...f, classe: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="text"
                    name="semestre"
                    placeholder="Semestre"
                    value={form.semestre}
                    onChange={(e) => setForm((f) => ({ ...f, semestre: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="text"
                    name="horaire"
                    placeholder="Horaire (ex: 14h)"
                    value={form.horaire}
                    onChange={(e) => setForm((f) => ({ ...f, horaire: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="text"
                    name="salle"
                    placeholder="Salle"
                    value={form.salle}
                    onChange={(e) => setForm((f) => ({ ...f, salle: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="text"
                    name="groupe"
                    placeholder="Groupe"
                    value={form.groupe}
                    onChange={(e) => setForm((f) => ({ ...f, groupe: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.input
                    type="number"
                    name="duree"
                    placeholder="Durée en minutes"
                    value={form.duree}
                    onChange={(e) => setForm((f) => ({ ...f, duree: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-blue-200 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none text-base font-medium transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-2xl py-4 font-bold text-lg shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  Ajouter le Cours
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Liste des cours */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {coursProf.map((cours, index) => (
              <motion.div
                key={cours._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 overflow-hidden hover:shadow-3xl transition-all duration-500"
              >
                {/* Header du cours */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-white/20 rounded-2xl shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <GraduationCap className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                          {cours.nom} — {cours.classe}
                        </h2>
                        <p className="text-blue-100 font-medium">
                          {cours.matiere?.nom || "Matière non définie"}
                        </p>
                        {/* Indicateur de séances terminées */}
                        {courseStats[cours._id]?.completedSeances > 0 && (
                          <motion.div 
                            className="flex items-center gap-2 mt-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                            <span className="text-emerald-300 text-sm font-medium">
                              {courseStats[cours._id]?.completedSeances} séance(s) terminée(s)
                            </span>
                          </motion.div>
                        )}
                        {/* Indicateur de séances totales */}
                        {courseStats[cours._id]?.totalSeances > 0 && (
                          <motion.div 
                            className="flex items-center gap-2 mt-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Calendar className="w-4 h-4 text-blue-300" />
                            <span className="text-blue-300 text-sm font-medium">
                              {courseStats[cours._id]?.totalSeances} séance(s) au total
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <motion.div 
                      className="text-right text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold">{courseStats[cours._id]?.totalStudents || 0}</div>
                      <div className="text-blue-100 text-sm">Étudiants</div>
                    </motion.div>
                  </div>
                </div>

                {/* Statistiques du cours */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="grid grid-cols-4 gap-4">
                    <motion.div 
                      className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {courseStats[cours._id]?.totalChapitres || 0}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">Chapitres</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-emerald-600">
                        {courseStats[cours._id]?.totalStudents || 0}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium">Étudiants</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-purple-600">
                        {courseStats[cours._id]?.totalSeances || 0}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">Séances</div>
                      {courseStats[cours._id]?.completedSeances > 0 && (
                        <div className="text-xs text-emerald-600 font-medium mt-1">
                          {courseStats[cours._id]?.completedSeances} terminée(s)
                        </div>
                      )}
                      {courseStats[cours._id]?.totalSeances > 0 && courseStats[cours._id]?.completedSeances === 0 && (
                        <div className="text-xs text-amber-600 font-medium mt-1">
                          En attente
                        </div>
                      )}
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.05, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl font-bold text-amber-600">
                        {courseStats[cours._id]?.averageAbsences || 0}
                      </div>
                      <div className="text-sm text-amber-600 font-medium">Abs. moy.</div>
                    </motion.div>
                  </div>
                </div>

                {/* Actions principales */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <motion.button
                      onClick={() => setOpenInscription((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden lg:inline">Inscrire élèves</span>
                      <span className="lg:hidden">Inscrire</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate(`/prof/cours/forum/${cours._id}`)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden lg:inline">Forum</span>
                      <span className="lg:hidden">Forum</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate(`/prof/cours/quiz/${cours._id}`)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <FileQuestion className="w-4 h-4" />
                      <span className="hidden lg:inline">Quiz</span>
                      <span className="lg:hidden">Quiz</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate(`/prof/gerer-devoirs`)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden lg:inline">Devoirs</span>
                      <span className="lg:hidden">Devoirs</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate(`/prof/documents-cours/${cours._id}`)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span className="hidden lg:inline">Documents</span>
                      <span className="lg:hidden">Docs</span>
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <motion.button
                      onClick={() => generateSeancesForCourse(cours)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                        courseStats[cours._id]?.completedSeances > 0
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                          : courseStats[cours._id]?.totalSeances > 0
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="hidden lg:inline">
                        {courseStats[cours._id]?.completedSeances > 0 
                          ? `✅ Terminé` 
                          : courseStats[cours._id]?.totalSeances > 0 
                          ? `🔄 Regénérer` 
                          : "➕ Générer"
                        }
                      </span>
                      <span className="lg:hidden">
                        {courseStats[cours._id]?.completedSeances > 0 
                          ? `✅` 
                          : courseStats[cours._id]?.totalSeances > 0 
                          ? `🔄` 
                          : "➕"
                        }
                      </span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setOpenAbsence((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="hidden lg:inline">Absences</span>
                      <span className="lg:hidden">Abs.</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setOpenChapitres((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden lg:inline">Chapitres</span>
                      <span className="lg:hidden">Chap.</span>
                    </motion.button>
                  </div>

                  {/* Section inscription élève */}
                  {openInscription[cours._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 shadow-lg"
                    >
                      <h4 className="text-emerald-800 font-bold mb-4 flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="p-2 bg-emerald-200 rounded-xl"
                        >
                          <UserPlus className="w-5 h-5 text-emerald-600" />
                        </motion.div>
                        Inscrire un élève par email
                      </h4>
                      <div className="flex gap-3 mb-6">
                        <motion.input
                          type="email"
                          placeholder="Email de l'élève"
                          value={emailInputByCourse[cours._id] || ""}
                          onChange={(e) =>
                            setEmailInputByCourse((prev) => ({
                              ...prev,
                              [cours._id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-4 py-3 rounded-2xl border-2 border-emerald-300 focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-400 focus:outline-none transition-all duration-300"
                          whileFocus={{ scale: 1.02 }}
                        />
                        <motion.button
                          onClick={() => handleInscrireEleve(cours._id)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Ajouter
                        </motion.button>
                      </div>
                      
                      {/* Liste des étudiants */}
                      <div>
                        <h5 className="text-emerald-800 font-semibold mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Élèves inscrits ({studentsByCourse[cours._id]?.length || 0})
                        </h5>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {(() => {
                            const seen = new Set();
                            return (studentsByCourse[cours._id] || [])
                              .filter((el) => {
                                if (seen.has(el.email)) return false;
                                seen.add(el.email);
                                return true;
                              })
                              .map((el, idx) => {
                                const abs = absencesStats[cours._id]?.[el._id];
                                const totalHours = abs?.totalHours || 0;
                                const isDanger = totalHours >= 12;
                                return (
                                  <motion.div
                                    key={el._id || idx}
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-lg border border-emerald-100"
                                  >
                                    <div className="flex items-center gap-3">
                                      <motion.div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          isDanger ? 'bg-red-100' : 'bg-emerald-100'
                                        }`}
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                      >
                                        <User className={`w-5 h-5 ${isDanger ? 'text-red-600' : 'text-emerald-600'}`} />
                                      </motion.div>
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {el.name || el.email}
                                        </div>
                                        <div className="text-sm text-gray-500">{el.email}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <motion.span 
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                                          isDanger 
                                            ? "bg-red-100 text-red-600 border border-red-200" 
                                            : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {abs ? `${totalHours}h absences` : "0h absence"}
                                      </motion.span>
                                      <motion.button
                                        onClick={() => handleRemoveStudent(cours._id, el._id)}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200 transition-all duration-300 shadow-md"
                                        title="Supprimer l'élève"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                );
                              });
                          })()}
                          {(!studentsByCourse[cours._id] || studentsByCourse[cours._id].length === 0) && (
                            <motion.div 
                              className="text-gray-500 text-center py-6 italic bg-white/50 rounded-2xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              Aucun élève inscrit
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Chapitres */}
                  <div>
                    <motion.h3 
                      className="text-blue-800 font-bold text-lg mb-6 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-2 bg-blue-100 rounded-xl"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      Chapitres ({cours.chapitres?.length || 0})
                    </motion.h3>
                    {cours.chapitres?.length > 0 ? (
                      <div className="space-y-4">
                        {cours.chapitres.map((chap, idx) => (
                          <motion.div
                            key={chap._id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, y: -3 }}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1 min-w-0">
                                <motion.div
                                  className="p-3 bg-white/80 rounded-2xl shadow-md flex-shrink-0"
                                  whileHover={{ scale: 1.1, rotate: 10 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <FolderOpen className="w-6 h-6 text-blue-600" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-blue-800 text-lg mb-2 break-words">
                                    {chap.titre}
                                  </div>
                                  <div className="text-sm text-blue-600 break-words">
                                    {chap.description || "Pas de description"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <motion.span 
                                  className="text-xs text-blue-600 bg-blue-200 px-3 py-2 rounded-full font-medium whitespace-nowrap"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  Ordre: {chap.order}
                                </motion.span>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    onClick={() => navigate(`/prof/cours/quiz/${chap._id}`)}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                    title="Gérer les quiz"
                                  >
                                    <FileQuestion className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => navigate(`/prof/documents-cours/${cours._id}`)}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                                    title="Gérer les documents"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => deleteChapitre(cours._id, chap._id)}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                                    title="Supprimer le chapitre"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-gray-500 text-center py-12 italic bg-white/50 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        </motion.div>
                        <h4 className="text-lg font-medium text-gray-600 mb-2">Pas encore de chapitres</h4>
                        <p className="text-gray-500">Créez votre premier chapitre pour commencer</p>
                      </motion.div>
                    )}

                    {/* Bouton ajout chapitre */}
                    <motion.button
                      onClick={() => toggleAddChapForm(cours._id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <PlusCircle className="w-5 h-5" />
                      {showAddChap[cours._id] ? "Annuler ajout chapitre" : "Ajouter un chapitre"}
                    </motion.button>

                    {showAddChap[cours._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg"
                      >
                        <div className="space-y-4">
                          <motion.input
                            type="text"
                            placeholder="Titre du chapitre"
                            value={newChapData[cours._id]?.titre || ""}
                            onChange={(e) =>
                              handleNewChapChange(cours._id, "titre", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-2xl border-2 border-blue-300 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                          />
                          <motion.textarea
                            placeholder="Description (optionnel)"
                            value={newChapData[cours._id]?.description || ""}
                            onChange={(e) =>
                              handleNewChapChange(cours._id, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-blue-300 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                            whileFocus={{ scale: 1.02 }}
                          />
                          <motion.input
                            type="number"
                            placeholder="Ordre (optionnel)"
                            value={newChapData[cours._id]?.order || 0}
                            onChange={(e) =>
                              handleNewChapChange(cours._id, "order", Number(e.target.value))
                            }
                            className="w-full px-4 py-3 rounded-2xl border-2 border-blue-300 focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                          />
                          <motion.button
                            onClick={() => addChapitre(cours._id)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Ajouter le chapitre
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Section actions dangereuses */}
                <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-t border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-2 bg-red-200 rounded-xl"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </motion.div>
                      <div>
                        <h4 className="text-red-800 font-bold">Actions dangereuses</h4>
                        <p className="text-red-600 text-sm">Ces actions sont irréversibles</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => {
                        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.")) {
                          deleteCourse(cours._id);
                        }
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden lg:inline">Supprimer le cours</span>
                      <span className="lg:hidden">Supprimer</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* État vide */}
          {coursProf.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 p-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-24 h-24 text-blue-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl text-blue-600 font-medium mb-3">Aucun cours trouvé</h3>
              <p className="text-blue-400 text-lg">Vous n'avez pas encore créé de cours</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
