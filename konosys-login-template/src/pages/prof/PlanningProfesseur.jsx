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
                <CalendarDays className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Planning des Cours
                </motion.h1>
                <motion.p 
                  className="text-blue-100 font-medium text-xl"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Gestion de vos séances et planning
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
                <div className="text-4xl font-bold text-white mb-1">{seances?.length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">Séances</div>
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
                <div className="text-4xl font-bold text-white mb-1">{seances?.filter(s => s.fait).length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">Terminées</div>
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
                <div className="text-4xl font-bold text-white mb-1">{seances?.filter(s => !s.fait).length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">À faire</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="space-y-6"
        >
          {/* Statistiques du planning ultra-modernes */}
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Effet de brillance sur les stats */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              <motion.div 
                className="text-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl border border-blue-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">{planningStats?.totalSeances || 0}</div>
                <div className="text-sm text-blue-600 font-medium">Total Séances</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-xl border border-emerald-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
              >
                <div className="text-3xl font-bold text-emerald-600 mb-1">{planningStats?.completedSeances || 0}</div>
                <div className="text-sm text-emerald-600 font-medium">Terminées</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 shadow-xl border border-amber-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <div className="text-3xl font-bold text-amber-600 mb-1">{planningStats?.todaySeances || 0}</div>
                <div className="text-sm text-amber-600 font-medium">Aujourd'hui</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 shadow-xl border border-purple-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                }}
              >
                <div className="text-3xl font-bold text-purple-600 mb-1">{planningStats?.upcomingSeances || 0}</div>
                <div className="text-sm text-purple-600 font-medium">À venir</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={generatePDF}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              Exporter PDF
            </motion.button>
          </div>

          {/* Liste des séances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seances?.map((seance, index) => (
              <motion.div
                key={seance._id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border transition-all duration-500 ${
                  seance.fait 
                    ? 'border-emerald-200 hover:shadow-emerald-200/50' 
                    : 'border-blue-100/50 hover:shadow-3xl'
                }`}
              >
                <div className={`px-6 sm:px-8 py-6 rounded-t-3xl ${
                  seance.fait 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-white/20 rounded-2xl shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {getStatusIcon(seance) === Calendar ? (
                          <Calendar className="w-6 h-6 text-white" />
                        ) : getStatusIcon(seance) === Clock ? (
                          <Clock className="w-6 h-6 text-white" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {getCourseName(seance)}
                        </h3>
                        <p className="text-white/80 font-medium">
                          {new Date(seance.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <motion.div 
                      className={`px-4 py-2 rounded-2xl font-semibold text-sm ${
                        seance.fait 
                          ? 'bg-emerald-400/20 text-emerald-100' 
                          : getStatusColor(seance)
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {getStatusText(seance)}
                    </motion.div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-2xl bg-blue-50">
                      <div className="text-lg font-bold text-blue-600">
                        {seance.heureDebut || '09:00'}
                      </div>
                      <div className="text-sm text-blue-600">Début</div>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-emerald-50">
                      <div className="text-lg font-bold text-emerald-600">
                        {calculateEndTime(seance.heureDebut, seance.heureFin, seance.duree)}
                      </div>
                      <div className="text-sm text-emerald-600">Fin</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Salle: {seance.salle || 'Non définie'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {seance.duree || 120} min
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleToggleDone(seance._id, seance.fait)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                        seance.fait
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {seance.fait ? 'Marquer non terminée' : 'Marquer terminée'}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(seance._id)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {(!seances || seances.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 p-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-24 h-24 text-blue-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl text-blue-600 font-medium mb-3">Aucune séance trouvée</h3>
              <p className="text-blue-400 text-lg">Vous n'avez pas encore de séances programmées</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
