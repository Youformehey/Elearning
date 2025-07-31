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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden text-gray-800">
      
      {/* Header moderne avec glassmorphism */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Titre et icône */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Mes Cours</h1>
                <p className="text-gray-600 text-sm">Gestion de vos cours et étudiants</p>
              </div>
            </div>
            
            {/* Statistiques compactes */}
            <div className="flex items-center gap-4">
              <div className="text-center p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 shadow-lg">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">{coursProf.length}</div>
                <div className="text-gray-600 text-xs font-medium">Cours</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 shadow-lg">
                <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{Object.values(courseStats).reduce((sum, stats) => sum + (stats.totalStudents || 0), 0)}</div>
                <div className="text-gray-600 text-xs font-medium">Étudiants</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 shadow-lg">
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">{Object.values(courseStats).reduce((sum, stats) => sum + (stats.totalChapitres || 0), 0)}</div>
                <div className="text-gray-600 text-xs font-medium">Chapitres</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-4 h-4" />
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
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Vos cours</h2>
            <p className="text-gray-600 text-sm">Gérez vos cours et vos étudiants</p>
          </div>
          <motion.button
            onClick={() => setShowAddCourse(!showAddCourse)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PlusCircle className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Ajouter un cours</span>
            </div>
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Formulaire ajout de cours compact */}
          {showAddCourse && (
            <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Ajouter un cours</h2>
                      <p className="text-blue-100 text-xs">Créez un nouveau cours</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(false)}
                    className="text-white hover:text-blue-100 transition-colors p-1 rounded-lg hover:bg-white/10"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddCourse} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nom du cours</label>
                    <input
                      type="text"
                      name="nom"
                      placeholder="Entrez le nom du cours"
                      value={form.nom}
                      onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Matière</label>
                    <select
                      name="matiere"
                      value={form.matiere}
                      onChange={(e) => setForm((f) => ({ ...f, matiere: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
                    >
                      <option value="">-- Sélectionnez une matière --</option>
                      {matieres.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.nom.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Classe</label>
                    <input
                      type="text"
                      name="classe"
                      placeholder="Ex: 5A, 6B, etc."
                      value={form.classe}
                      onChange={(e) => setForm((f) => ({ ...f, classe: e.target.value }))}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Salle</label>
                    <input
                      type="text"
                      name="salle"
                      placeholder="Ex: A101, B205"
                      value={form.salle}
                      onChange={(e) => setForm((f) => ({ ...f, salle: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Créer le cours
                </button>
              </form>
            </div>
          )}

          {/* Liste des cours compacte */}
          {coursProf.map((cours, index) => (
            <motion.div
              key={cours._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 min-h-[400px]"
            >
              {/* Header du cours compact */}
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-6 py-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg shadow-md border border-white/30">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {cours.nom}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {cours.classe} • {cours.matiere?.nom || "Matière non définie"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right text-white">
                    <div className="text-xl font-bold">{courseStats[cours._id]?.totalStudents || 0}</div>
                    <div className="text-blue-100 text-sm">Étudiants</div>
                  </div>
                </div>
              </div>

              {/* Statistiques compactes */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 group">
                    <div className="text-base font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                      {courseStats[cours._id]?.totalChapitres || 0}
                    </div>
                    <div className="text-xs text-blue-600">Chapitres</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-all duration-300 group">
                    <div className="text-base font-bold text-emerald-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                      {courseStats[cours._id]?.totalStudents || 0}
                    </div>
                    <div className="text-xs text-emerald-600">Étudiants</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all duration-300 group">
                    <div className="text-base font-bold text-purple-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                      {courseStats[cours._id]?.totalSeances || 0}
                    </div>
                    <div className="text-xs text-purple-600">Séances</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-all duration-300 group">
                    <div className="text-base font-bold text-amber-600 mb-1 group-hover:scale-110 transition-transform duration-300">
                      {courseStats[cours._id]?.averageAbsences || 0}
                    </div>
                    <div className="text-xs text-amber-600">Abs. moy.</div>
                  </div>
                </div>
              </div>

              {/* Actions compactes */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    onClick={() => setOpenInscription((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Inscrire</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate(`/prof/cours/forum/${cours._id}`)}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Forum</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate(`/prof/cours/quiz/${cours._id}`)}
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <FileQuestion className="w-4 h-4" />
                      <span>Quiz</span>
                    </div>
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    onClick={() => navigate(`/prof/gerer-devoirs`)}
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Devoirs</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate(`/prof/documents-cours/${cours._id}`)}
                    className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>Docs</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setOpenChapitres((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Chapitres</span>
                    </div>
                  </motion.button>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => generateSeancesForCourse(cours)}
                    className={`group relative overflow-hidden flex-1 py-3 px-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                      courseStats[cours._id]?.completedSeances > 0
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                        : courseStats[cours._id]?.totalSeances > 0
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                        : "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      courseStats[cours._id]?.completedSeances > 0
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
                        : courseStats[cours._id]?.totalSeances > 0
                        ? "bg-gradient-to-r from-amber-600 to-amber-700"
                        : "bg-gradient-to-r from-cyan-600 to-cyan-700"
                    }`} />
                    <div className="relative z-10 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {courseStats[cours._id]?.completedSeances > 0 
                          ? "Terminé" 
                          : courseStats[cours._id]?.totalSeances > 0 
                          ? "Regénérer" 
                          : "Générer"
                        }
                      </span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setOpenAbsence((prev) => ({ ...prev, [cours._id]: !prev[cours._id] }))}
                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-3 rounded-lg font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Absences</span>
                    </div>
                  </motion.button>
                </div>

                {/* Section inscription élève compacte */}
                {openInscription[cours._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-lg"
                  >
                    <h4 className="text-blue-800 font-bold mb-3 flex items-center gap-2 text-sm">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-2 bg-blue-200 rounded-lg"
                      >
                        <UserPlus className="w-4 h-4 text-blue-600" />
                      </motion.div>
                      Inscrire un élève
                    </h4>
                    <div className="flex gap-3 mb-4">
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
                        className="flex-1 px-3 py-2 rounded-lg border border-blue-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <motion.button
                        onClick={() => handleInscrireEleve(cours._id)}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Ajouter
                      </motion.button>
                    </div>
                    
                    {/* Liste des étudiants compacte */}
                    <div>
                      <h5 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        Élèves ({studentsByCourse[cours._id]?.length || 0})
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
                                  initial={{ opacity: 0, x: -10, scale: 0.9 }}
                                  animate={{ opacity: 1, x: 0, scale: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                  whileHover={{ scale: 1.02, y: -1 }}
                                  className="bg-white/80 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between shadow-md border border-blue-100"
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isDanger ? 'bg-red-100' : 'bg-blue-100'
                                      }`}
                                      whileHover={{ scale: 1.1, rotate: 360 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <User className={`w-4 h-4 ${isDanger ? 'text-red-600' : 'text-blue-600'}`} />
                                    </motion.div>
                                    <div>
                                      <div className="font-semibold text-gray-900 text-sm">
                                        {el.name || el.email}
                                      </div>
                                      <div className="text-xs text-gray-500">{el.email}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <motion.span 
                                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                                        isDanger 
                                          ? "bg-red-100 text-red-600 border border-red-200" 
                                          : "bg-blue-100 text-blue-600 border border-blue-200"
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {abs ? `${totalHours}h` : "0h"}
                                    </motion.span>
                                    <motion.button
                                      onClick={() => handleRemoveStudent(cours._id, el._id)}
                                      whileHover={{ scale: 1.1, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-all duration-300 shadow-sm"
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
                            className="text-gray-500 text-center py-4 italic bg-gray-50 rounded-lg text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Users className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                            Aucun élève inscrit
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Chapitres compact */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-indigo-800 font-bold text-sm flex items-center gap-2">
                      <div className="p-2 bg-indigo-200 rounded-lg">
                        <FileText className="w-4 h-4 text-indigo-600" />
                      </div>
                      Chapitres ({cours.chapitres?.length || 0})
                    </h3>
                    <motion.button
                      onClick={() => toggleAddChapForm(cours._id)}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        <span>{showAddChap[cours._id] ? "Annuler" : "Ajouter"}</span>
                      </div>
                    </motion.button>
                  </div>
                  
                  {cours.chapitres?.length > 0 ? (
                    <div className="space-y-3">
                      {cours.chapitres.map((chap, idx) => (
                        <div
                          key={chap._id}
                          className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 hover:bg-white transition-all duration-300 group hover:-translate-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg shadow-sm">
                                <FolderOpen className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm mb-1">
                                  {chap.titre}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {chap.description || "Pas de description"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full font-medium">
                                {chap.order}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/prof/cours/quiz/${chap._id}`)}
                                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                  title="Gérer les quiz"
                                >
                                  <FileQuestion className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => navigate(`/prof/documents-cours/${cours._id}`)}
                                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                  title="Gérer les documents"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteChapitre(cours._id, chap._id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                  title="Supprimer le chapitre"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="font-bold text-gray-600 mb-2 text-sm">Pas encore de chapitres</h4>
                      <p className="text-gray-500 text-sm">Créez votre premier chapitre</p>
                    </div>
                  )}

                  {showAddChap[cours._id] && (
                    <div className="mt-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Titre du chapitre</label>
                          <input
                            type="text"
                            placeholder="Entrez le titre du chapitre"
                            value={newChapData[cours._id]?.titre || ""}
                            onChange={(e) =>
                              handleNewChapChange(cours._id, "titre", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Description (optionnel)</label>
                          <textarea
                            placeholder="Décrivez le contenu de ce chapitre"
                            value={newChapData[cours._id]?.description || ""}
                            onChange={(e) =>
                              handleNewChapChange(cours._id, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 focus:outline-none transition-all duration-300 resize-none text-sm"
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Ordre</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={newChapData[cours._id]?.order || 0}
                              onChange={(e) =>
                                handleNewChapChange(cours._id, "order", Number(e.target.value))
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 focus:outline-none transition-all duration-300 text-sm"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => addChapitre(cours._id)}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-md text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* État vide compact */}
          {coursProf.length === 0 && (
            <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-gray-200 p-6 text-center col-span-full shadow-lg">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg text-gray-600 font-medium mb-1">Aucun cours trouvé</h3>
              <p className="text-gray-500 text-sm">Vous n'avez pas encore créé de cours</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
