import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CalendarDays,
  Download,
  School,
  Clock3,
  MapPin,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  BookOpen,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  Building,
  UserCheck,
  FileText,
  TrendingUp,
  BarChart3,
  Target,
  Calculator,
  Sparkles,
  Zap,
  Trophy,
  Plus,
  Edit3,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001/api";

export default function PlanningProfesseur() {
  const [seances, setSeances] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [planningStats, setPlanningStats] = useState({
    totalSeances: 0,
    completedSeances: 0,
    upcomingSeances: 0,
    todaySeances: 0,
    averageDuration: 0
  });

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
  const { darkMode } = useContext(ThemeContext);

  // Charger les cours et séances du professeur
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Charger les cours du professeur avec toutes les données
        const coursesRes = await axios.get(`${API_URL}/courses/teacher`, authHeaders);
        const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.courses || [];
        const filteredCourses = coursesData.filter(c => c.teacher?.email === userInfo?.email);
        
        // S'assurer que chaque cours a ses données complètes
        const enrichedCourses = filteredCourses.map(course => ({
          ...course,
          nom: course.nom || 'Cours sans nom',
          classe: course.classe || 'Classe non définie',
          matiere: course.matiere || { nom: 'Matière non définie' }
        }));
        
        console.log('Cours chargés:', enrichedCourses);
        setCourses(enrichedCourses);

        // Charger toutes les séances du professeur
        const seancesRes = await axios.get(`${API_URL}/seances/professeur`, authHeaders);
        console.log('Séances chargées:', seancesRes.data);
        
        // Filtrer les séances pour ne garder que celles des cours du professeur
        const courseIds = enrichedCourses.map(c => c._id);
        const filteredSeances = seancesRes.data.filter(s => {
          const courseId = typeof s.course === 'object' ? s.course._id : s.course;
          return courseIds.includes(courseId);
        });
        
        console.log('Séances filtrées pour les cours du prof:', filteredSeances);
        console.log('IDs des cours du prof:', courseIds);
        console.log('Nombre total de séances:', seancesRes.data.length);
        console.log('Nombre de séances filtrées:', filteredSeances.length);
        
        // Debug: vérifier chaque séance
        seancesRes.data.forEach((seance, index) => {
          const courseId = typeof seance.course === 'object' ? seance.course._id : seance.course;
          console.log(`Séance ${index + 1}:`, {
            id: seance._id,
            courseId: courseId,
            courseName: typeof seance.course === 'object' ? seance.course.nom : 'Pas de nom',
            isInCourseIds: courseIds.includes(courseId),
            date: seance.date,
            heureDebut: seance.heureDebut
          });
        });
        
        setSeances(filteredSeances);

      } catch (err) {
        console.error("Erreur chargement données :", err);
        setErrorMessage("Erreur lors du chargement des données");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculer les statistiques du planning
  useEffect(() => {
    if (seances.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const totalSeances = seances.length;
      const completedSeances = seances.filter(s => s.fait).length;
      const upcomingSeances = seances.filter(s => new Date(s.date) > now).length;
      const todaySeances = seances.filter(s => {
        const seanceDate = new Date(s.date);
        return seanceDate >= today && seanceDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      }).length;

      const totalDuration = seances.reduce((sum, s) => {
        try {
          const start = new Date(`2000-01-01T${s.heureDebut || '08:00'}`);
          const end = new Date(`2000-01-01T${s.heureFin || s.heureDebut || '10:00'}`);
          const duration = (end - start) / (1000 * 60); // en minutes
          return sum + (isNaN(duration) ? 120 : duration); // 120 min par défaut si calcul invalide
        } catch (error) {
          return sum + 120; // 120 min par défaut en cas d'erreur
        }
      }, 0);
      const averageDuration = totalSeances > 0 ? Math.round(totalDuration / totalSeances) : 0;

      setPlanningStats({
        totalSeances,
        completedSeances,
        upcomingSeances,
        todaySeances,
        averageDuration
      });
    }
  }, [seances]);

  // Filtrer les séances par cours
  const filteredSeances = selectedCourse === "all" 
    ? seances 
    : seances.filter(s => {
        const courseId = typeof s.course === 'object' ? s.course._id : s.course;
        return courseId === selectedCourse;
      });

  // Générer un PDF pour toutes les séances
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Planning complet des séances", 14, 14);
    autoTable(doc, {
      head: [["Date", "Heure", "Cours", "Salle", "Groupe", "Fait"]],
      body: filteredSeances.map((s) => [
        new Date(s.date).toLocaleDateString("fr-FR"),
        s.heureDebut || "08:00",
        s.classe + " / " + s.matiere,
        s.salle || "—",
        s.groupe || "—",
        s.fait ? "Oui" : "Non",
      ]),
    });
    doc.save("planning_seances.pdf");
  };

  // Supprimer une séance
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette séance ?")) return;
    try {
      await axios.delete(`${API_URL}/seances/${id}`, authHeaders);
      setSeances((prev) => prev.filter((s) => s._id !== id));
      setSuccessMessage("✅ Séance supprimée avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("❌ Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Marquer une séance comme faite
  const handleToggleDone = async (id, currentStatus) => {
    try {
      console.log('Tentative de modification séance:', id, 'Status actuel:', currentStatus);
      
      const response = await axios.put(`${API_URL}/seances/${id}/mark`, 
        { fait: !currentStatus }, 
        authHeaders
      );
      
      console.log('Réponse du serveur:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        setSeances((prev) => 
          prev.map((s) => s._id === id ? { ...s, fait: !currentStatus } : s)
        );
        
        const newStatus = !currentStatus;
        const message = newStatus ? 'terminée' : 'à faire';
        setSuccessMessage(`✅ Séance marquée comme ${message} !`);
        setTimeout(() => setSuccessMessage(""), 3000);
        
        // Mettre à jour les statistiques
        setTimeout(() => {
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          const totalSeances = seances.length;
          const completedSeances = seances.filter(s => s.fait).length + (newStatus ? 1 : -1);
          const upcomingSeances = seances.filter(s => new Date(s.date) > now).length;
          const todaySeances = seances.filter(s => {
            const seanceDate = new Date(s.date);
            return seanceDate >= today && seanceDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          }).length;

          setPlanningStats(prev => ({
            ...prev,
            completedSeances,
            totalSeances
          }));
        }, 100);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      console.error("Détails de l'erreur:", error.response?.data);
      setErrorMessage("❌ Erreur lors de la modification: " + (error.response?.data?.message || error.message));
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Obtenir le nom du cours
  const getCourseName = (seance) => {
    // Chercher le cours correspondant par ID
    const courseId = typeof seance.course === 'object' ? seance.course._id : seance.course;
    const course = courses.find(c => c._id === courseId);
    console.log('Recherche cours pour séance:', seance._id, 'Course ID:', courseId, 'Course trouvé:', course);
    
    if (course) {
      const courseInfo = {
        nom: course.nom || 'Cours sans nom',
        classe: course.classe || 'Classe non définie',
        matiere: course.matiere?.nom || 'Matière non définie'
      };
      console.log('Informations du cours:', courseInfo);
      return courseInfo;
    }
    
    // Si le cours n'est pas trouvé, essayer de récupérer depuis la séance
    if (seance.course && typeof seance.course === 'object') {
      const courseInfo = {
        nom: seance.course.nom || 'Cours sans nom',
        classe: seance.course.classe || 'Classe non définie',
        matiere: seance.course.matiere?.nom || 'Matière non définie'
      };
      console.log('Informations du cours depuis séance:', courseInfo);
      return courseInfo;
    }
    
    // Fallback avec les données de la séance
    const fallbackInfo = {
      nom: seance.classe || 'Cours sans nom',
      classe: seance.classe || 'Classe non définie',
      matiere: 'Matière non définie'
    };
    console.log('Informations de fallback:', fallbackInfo);
    return fallbackInfo;
  };

  // Obtenir la couleur selon le statut
  const getStatusColor = (seance) => {
    if (seance.fait) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return "bg-red-100 text-red-800 border-red-200";
    if (seanceDate.toDateString() === now.toDateString()) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Obtenir l'icône selon le statut
  const getStatusIcon = (seance) => {
    if (seance.fait) return CheckCircle;
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return XCircle;
    if (seanceDate.toDateString() === now.toDateString()) return Clock;
    return Calendar;
  };

  // Obtenir le texte du statut
  const getStatusText = (seance) => {
    if (seance.fait) return "Terminée";
    const seanceDate = new Date(seance.date);
    const now = new Date();
    if (seanceDate < now) return "En retard";
    if (seanceDate.toDateString() === now.toDateString()) return "Aujourd'hui";
    return "Programmée";
  };

  // Calculer l'heure de fin
  const calculateEndTime = (heureDebut, heureFin, dureeMinutes = 120) => {
    try {
      // Si l'heure de fin est valide et différente de "Inval"
      if (heureFin && heureFin !== 'Inval' && heureFin !== 'Invalid Date' && heureFin !== 'NaN:NaN') {
        return heureFin;
      }
      
      // Si on a une heure de début valide
      if (heureDebut && heureDebut !== 'Inval' && heureDebut !== 'Invalid Date') {
        const start = new Date(`2000-01-01T${heureDebut}`);
        const end = new Date(start.getTime() + (dureeMinutes * 60 * 1000));
        const endTime = end.toTimeString().slice(0, 5);
        
        // Vérifier que l'heure de fin est après l'heure de début
        if (endTime <= heureDebut) {
          // Si l'heure de fin est avant l'heure de début, ajouter 2 heures
          const correctedEnd = new Date(start.getTime() + (2 * 60 * 60 * 1000));
          return correctedEnd.toTimeString().slice(0, 5);
        }
        
        return endTime;
      }
      
      // Heure par défaut si pas d'heure de début valide
      return '10:00';
    } catch (error) {
      console.error('Erreur calcul heure fin:', error);
      return '10:00'; // Heure par défaut en cas d'erreur
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
            Chargement du planning...
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
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CalendarDays className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent'}`}>
                  Planning des Séances
                </h1>
                <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Gestion et suivi de vos cours</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
          onClick={generatePDF}
                disabled={filteredSeances.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  filteredSeances.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                }`}
              >
                <Download className="w-5 h-5" />
                Télécharger PDF
              </motion.button>
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
          {/* Statistiques du planning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  <h2 className="text-2xl font-bold text-white">Statistiques du Planning</h2>
                  <p className="text-blue-100 font-medium">Vue d'ensemble de vos séances</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total séances */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-blue-800">Total Séances</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  >
                    {planningStats.totalSeances}
                  </motion.div>
                  <p className="text-blue-600 text-sm mt-2">
                    Séances programmées
                  </p>
                </motion.div>

                {/* Séances terminées */}
                <motion.div
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-emerald-800">Terminées</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-emerald-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    {planningStats.completedSeances}
                  </motion.div>
                  <p className="text-emerald-600 text-sm mt-2">
                    Séances effectuées
                  </p>
                </motion.div>

                {/* Séances à venir */}
                <motion.div
                  className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-600 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-amber-800">À Venir</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-amber-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  >
                    {planningStats.upcomingSeances}
                  </motion.div>
                  <p className="text-amber-600 text-sm mt-2">
                    Séances futures
                  </p>
                </motion.div>

                {/* Séances aujourd'hui */}
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Aujourd'hui</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-purple-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                  >
                    {planningStats.todaySeances}
                  </motion.div>
                  <p className="text-purple-600 text-sm mt-2">
                    Séances du jour
                  </p>
                </motion.div>

                {/* Durée moyenne */}
                <motion.div
                  className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-600 rounded-lg">
                      <Clock3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-pink-800">Durée Moy.</h3>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-pink-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                  >
                    {planningStats.averageDuration}min
                  </motion.div>
                  <p className="text-pink-600 text-sm mt-2">
                    Par séance
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Filtre par cours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Filtrer par Cours</h2>
                  <p className="text-blue-100 font-medium">Sélectionnez un cours pour voir ses séances</p>
                </div>
              </div>
      </div>

            <div className="p-8">
              <motion.select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg font-semibold bg-white shadow-lg"
                whileFocus={{ scale: 1.02 }}
              >
                <option value="all">📚 Tous les cours ({seances.length} séances)</option>
                {courses.map((course) => {
                  const courseSeances = seances.filter(s => {
                    const courseId = typeof s.course === 'object' ? s.course._id : s.course;
                    return courseId === course._id;
                  });
                  const courseName = course.nom || 'Cours sans nom';
                  const courseClass = course.classe || 'Classe non définie';
                  const courseSubject = course.matiere?.nom || 'Matière non définie';
                  
                  console.log(`Cours ${courseName}: ${courseSeances.length} séances trouvées`);
                  
                  return (
                    <option key={course._id} value={course._id}>
                      📖 {courseName} - {courseClass} ({courseSubject}) - {courseSeances.length} séance(s)
                    </option>
                  );
                })}
              </motion.select>
            </div>
          </motion.div>

          {/* Liste des séances */}
          {filteredSeances.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-20 h-20 text-blue-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl text-blue-600 font-medium mb-2">
                {selectedCourse === "all" ? "Aucune séance trouvée" : "Aucune séance pour ce cours"}
              </h3>
              <p className="text-blue-400">
                {selectedCourse === "all" 
                  ? "Vous n'avez pas encore de séances programmées" 
                  : "Ce cours n'a pas encore de séances programmées"
                }
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeances.map((seance, index) => {
                const StatusIcon = getStatusIcon(seance);
                const courseName = getCourseName(seance);
                
                return (
                  <motion.div
                    key={seance._id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`relative bg-white rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-200 ${
                      seance.fait ? "border-emerald-200" : "border-blue-200"
              }`}
            >
                    {/* Badge de date */}
                    <motion.div 
                      className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-4 py-2 rounded-bl-2xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="font-bold">
                        {new Date(seance.date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="text-xs opacity-90">
                        {new Date(seance.date).toLocaleDateString("fr-FR", {
                          year: "numeric"
                        })}
                      </div>
                    </motion.div>

                    {/* Contenu principal */}
                    <div className="p-6 pt-8">
                      {/* En-tête avec statut */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(seance)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {getStatusText(seance)}
                        </motion.div>
              </div>

                      {/* Titre du cours */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <School className="w-5 h-5 text-blue-600" />
                        {courseName.nom} - {courseName.classe}
                      </h3>

                      {/* Matière */}
                      <div className="flex items-center gap-3 text-gray-700 mb-3">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-purple-700">{courseName.matiere}</span>
                      </div>

                      {/* Détails de la séance */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Clock3 className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">
                            {seance.heureDebut && seance.heureDebut !== 'Inval' ? seance.heureDebut : '08:00'}
                          </span>
                        </div>

                        {seance.salle && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Building className="w-4 h-4 text-blue-500" />
                            <span>Salle {seance.salle}</span>
                          </div>
                        )}
                        
                        {seance.groupe && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>Groupe {seance.groupe}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-6">
                        <motion.button
                          onClick={() => handleToggleDone(seance._id, seance.fait)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                            seance.fait
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          {seance.fait ? (
                            <>
                              <XCircle className="w-4 h-4 inline mr-2" />
                              Marquer non terminée
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 inline mr-2" />
                              Marquer terminée
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={() => handleDelete(seance._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                title="Supprimer la séance"
              >
                <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
            </motion.div>
                );
              })}
        </div>
      )}
        </motion.div>
      </div>
    </div>
  );
}
