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

  // Fonction pour recharger les données
  const reloadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      console.log('🔍 reloadData - UserInfo:', userInfo);
      console.log('🔍 reloadData - Token:', token ? 'Present' : 'Missing');
      
      // Charger les cours du professeur avec toutes les données
      const coursesRes = await axios.get(`${API_URL}/courses/teacher`, authHeaders);
      const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.courses || [];
      
      console.log('🔍 reloadData - Cours récupérés:', coursesData);
      
      // Filtrer les cours par ID du professeur au lieu de l'email
      const filteredCourses = coursesData.filter(c => c.teacher?._id === userInfo?._id || c.teacher === userInfo?._id);
      
      // S'assurer que chaque cours a ses données complètes
      const enrichedCourses = filteredCourses.map(course => ({
        ...course,
        nom: course.nom || course.matiere?.nom || 'Cours sans nom',
        classe: course.classe || 'Classe non définie',
        matiere: course.matiere || { nom: 'Matière non définie' }
      }));
      
      console.log('🔍 reloadData - Cours enrichis:', enrichedCourses);
      console.log('🔍 reloadData - Cours filtrés par ID:', filteredCourses.length);
      setCourses(enrichedCourses);

      // Charger toutes les séances du professeur
      const seancesRes = await axios.get(`${API_URL}/seances/professeur`, authHeaders);
      console.log('🔍 reloadData - Séances chargées:', seancesRes.data);
      
      // Les séances sont déjà filtrées par le backend selon le professeur connecté
      // Pas besoin de filtrer à nouveau côté frontend
      const allSeances = seancesRes.data;
      
      console.log('🔍 reloadData - Toutes les séances du professeur:', allSeances);
      console.log('🔍 reloadData - Nombre total de séances:', allSeances.length);
      
      setSeances(allSeances);
      
      // Calculer les statistiques
      const today = new Date().toISOString().split('T')[0];
      const stats = {
        totalSeances: allSeances.length,
        completedSeances: allSeances.filter(s => s.fait).length,
        upcomingSeances: allSeances.filter(s => !s.fait && s.date >= today).length,
        todaySeances: allSeances.filter(s => s.date === today).length,
        averageDuration: allSeances.length > 0 
          ? Math.round(allSeances.reduce((sum, s) => sum + (s.duree || 120), 0) / allSeances.length)
          : 0
      };
      setPlanningStats(stats);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      console.error('❌ Détails de l\'erreur:', error.response?.data);
      setErrorMessage("Erreur lors du chargement des données: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Charger les cours et séances du professeur
  useEffect(() => {
    reloadData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.text('Planning des Cours', 20, 20);
    
    // Tableau des séances
    const tableData = seances.map(seance => [
      getCourseName(seance),
      new Date(seance.date).toLocaleDateString('fr-FR'),
      seance.heureDebut || '09:00',
      calculateEndTime(seance.heureDebut, seance.heureFin, seance.duree),
      seance.salle || 'Non définie',
      seance.fait ? 'Terminée' : 'À faire'
    ]);
    
    autoTable(doc, {
      head: [['Cours', 'Date', 'Début', 'Fin', 'Salle', 'Statut']],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
    
    doc.save('planning-cours.pdf');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/seances/${id}`, authHeaders);
      setSeances(prev => prev.filter(s => s._id !== id));
      setSuccessMessage("Séance supprimée avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErrorMessage("Erreur lors de la suppression");
    }
  };

  const handleToggleDone = async (id, currentStatus) => {
    try {
      console.log('🔍 Marquer séance comme faite:', id, 'Status actuel:', currentStatus);
      
      // Utiliser la route correcte pour marquer comme faite
      await axios.put(`${API_URL}/seances/${id}/mark`, {
        fait: !currentStatus
      }, authHeaders);
      
      // Mettre à jour l'état local
      setSeances(prev => prev.map(s => 
        s._id === id ? { ...s, fait: !currentStatus } : s
      ));
      
      setSuccessMessage(`Séance marquée comme ${!currentStatus ? 'terminée' : 'non terminée'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      setErrorMessage("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
    }
  };

  const getCourseName = (seance) => {
    console.log('🔍 getCourseName - Séance:', seance);
    console.log('🔍 getCourseName - Courses disponibles:', courses);
    
    // Vérifier si seance.course est un objet complet
    if (seance.course && typeof seance.course === 'object' && seance.course.nom) {
      return `${seance.course.nom} — ${seance.course.classe || 'Classe non définie'}`;
    }
    
    // Sinon, chercher dans la liste des cours
    const courseId = typeof seance.course === 'object' ? seance.course._id : seance.course;
    const course = courses.find(c => c._id === courseId);
    
    if (course) {
      return `${course.nom} — ${course.classe || 'Classe non définie'}`;
    }
    
    // Si on a un nom de cours dans la séance elle-même
    if (seance.nomCours) {
      return `${seance.nomCours} — ${seance.classe || 'Classe non définie'}`;
    }
    
    console.log('❌ Cours non trouvé pour séance:', seance._id);
    return 'Cours non trouvé';
  };

  const getStatusColor = (seance) => {
    if (seance.fait) return 'bg-emerald-400/20 text-emerald-100';
    
    const today = new Date().toISOString().split('T')[0];
    const seanceDate = seance.date;
    
    if (seanceDate < today) return 'bg-red-400/20 text-red-100';
    if (seanceDate === today) return 'bg-amber-400/20 text-amber-100';
    return 'bg-blue-400/20 text-blue-100';
  };

  const getStatusIcon = (seance) => {
    if (seance.fait) return CheckCircle;
    
    const today = new Date().toISOString().split('T')[0];
    const seanceDate = seance.date;
    
    if (seanceDate < today) return XCircle;
    if (seanceDate === today) return Clock;
    return Calendar;
  };

  const getStatusText = (seance) => {
    if (seance.fait) return 'Terminée';
    
    const today = new Date().toISOString().split('T')[0];
    const seanceDate = seance.date;
    
    if (seanceDate < today) return 'En retard';
    if (seanceDate === today) return 'Aujourd\'hui';
    return 'À venir';
  };

  const calculateEndTime = (heureDebut, heureFin, dureeMinutes = 120) => {
    if (heureFin) return heureFin;
    
    if (!heureDebut) return '11:00';
    
    const [hours, minutes] = heureDebut.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + dureeMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
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
                <CalendarDays className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Planning des Cours
                </motion.h1>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Gestion de vos séances et planning
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
              {/* Bouton de rafraîchissement */}
              <motion.button
                onClick={reloadData}
                disabled={loading}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <span className="text-sm font-medium">Actualiser</span>
              </motion.button>
              
              {[
                { value: seances?.length || 0, label: "Séances", color: "blue" },
                { value: seances?.filter(s => s.fait).length || 0, label: "Terminées", color: "emerald" },
                { value: seances?.filter(s => !s.fait).length || 0, label: "À faire", color: "amber" }
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
              <motion.button
                onClick={() => setSuccessMessage("")}
                className="ml-2 text-emerald-600 hover:text-emerald-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-4 h-4" />
              </motion.button>
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
              <motion.button
                onClick={() => setErrorMessage("")}
                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-4 h-4" />
              </motion.button>
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
          {/* Statistiques du planning avec animations améliorées */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: planningStats?.totalSeances || 0, label: "Total Séances", color: "blue" },
                { value: planningStats?.completedSeances || 0, label: "Terminées", color: "emerald" },
                { value: planningStats?.todaySeances || 0, label: "Aujourd'hui", color: "amber" },
                { value: planningStats?.upcomingSeances || 0, label: "À venir", color: "purple" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`text-center p-4 rounded-xl bg-${stat.color}-50 border border-${stat.color}-200`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.4 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
                  <div className={`text-sm text-${stat.color}-600 font-medium`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions avec animations */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={generatePDF}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              Exporter PDF
            </motion.button>
          </motion.div>

          {/* Liste des séances avec animations améliorées */}
          {seances?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Calendar className="w-16 h-16 text-blue-400 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune séance trouvée</h3>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore de séances dans votre planning.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Comment créer des séances :</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Allez dans "Mes Cours"</li>
                  <li>• Cliquez sur "Générer" pour un cours</li>
                  <li>• Les séances apparaîtront automatiquement ici</li>
                  <li>• Cliquez sur "Actualiser" pour recharger</li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {seances?.map((seance, index) => (
                <motion.div
                  key={seance._id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-white rounded-2xl shadow-xl border transition-all duration-500 ${
                    seance.fait 
                      ? 'border-emerald-200 hover:shadow-emerald-200/50' 
                      : 'border-gray-200 hover:shadow-2xl'
                  }`}
                >
                  <motion.div 
                    className={`px-6 py-6 rounded-t-2xl ${
                      seance.fait 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
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
                          <p className="text-white/80 text-sm font-medium">
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
                        className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                          seance.fait 
                            ? 'bg-emerald-400/20 text-emerald-100' 
                            : getStatusColor(seance)
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {getStatusText(seance)}
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="text-center p-3 rounded-xl bg-blue-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-lg font-bold text-blue-600">
                          {seance.heureDebut || '09:00'}
                        </div>
                        <div className="text-sm text-blue-600">Début</div>
                      </motion.div>
                      <motion.div 
                        className="text-center p-3 rounded-xl bg-emerald-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-lg font-bold text-emerald-600">
                          {calculateEndTime(seance.heureDebut, seance.heureFin, seance.duree)}
                        </div>
                        <div className="text-sm text-emerald-600">Fin</div>
                      </motion.div>
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
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
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
                        className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
