import React, { useEffect, useState, useContext } from "react";
import {
  User,
  AlertCircle,
  Award,
  CreditCard,
  Eye,
  Bell,
  RefreshCw,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Target,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

const DashboardParent = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [childrenStats, setChildrenStats] = useState({
    totalChildren: 0,
    totalNotes: 0,
    totalAbsences: 0,
    averageGrade: 0,
    children: []
  });
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Récupérer le profil parent avec les enfants
  const fetchParentProfile = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      return response.data;
    } catch (err) {
      console.error("Erreur récupération profil:", err);
      setError("Impossible de charger le profil. Vérifiez votre connexion.");
      return null;
    }
  };

  // Récupérer les statistiques des enfants
  const fetchChildrenStats = async (parentData) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!parentData || !parentData.children || parentData.children.length === 0) {
        setChildrenStats({
          totalChildren: 0,
          totalNotes: 0,
          totalAbsences: 0,
          averageGrade: 0,
          children: []
        });
        return;
      }

      const stats = {
        totalChildren: parentData.children.length,
        totalNotes: 0,
        totalAbsences: 0,
        averageGrade: 0,
        children: []
      };

      // Pour chaque enfant, récupérer les données
      for (const child of parentData.children) {
        try {
          // Récupérer les notes de l'enfant
          const notesResponse = await axios.get(`/api/notes/student/${child._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Récupérer les absences de l'enfant
          const absencesResponse = await axios.get(`/api/absences/student/${child._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const childNotes = notesResponse.data || [];
          const childAbsences = absencesResponse.data || [];
          
          const validNotes = childNotes.filter(note => note.note && !isNaN(note.note));
          const average = validNotes.length > 0 
            ? validNotes.reduce((acc, n) => acc + n.note, 0) / validNotes.length 
            : 0;

          stats.totalNotes += childNotes.length;
          stats.totalAbsences += childAbsences.length;
          stats.children.push({
            ...child,
            notes: childNotes,
            absences: childAbsences,
            average: average.toFixed(2)
          });
        } catch (err) {
          console.error(`Erreur récupération données pour ${child.name}:`, err);
          // Ajouter l'enfant même sans données
          stats.children.push({
            ...child,
            notes: [],
            absences: [],
            average: 0
          });
        }
      }

      // Calculer la moyenne générale
      if (stats.children.length > 0) {
        const allValidNotes = stats.children.flatMap(child => 
          child.notes.filter(note => note.note && !isNaN(note.note))
        );
        stats.averageGrade = allValidNotes.length > 0 
          ? (allValidNotes.reduce((acc, n) => acc + n.note, 0) / allValidNotes.length).toFixed(2)
          : 0;
      }

      setChildrenStats(stats);
    } catch (err) {
      console.error("Erreur récupération stats enfants:", err);
      setChildrenStats({
        totalChildren: 0,
        totalNotes: 0,
        totalAbsences: 0,
        averageGrade: 0,
        children: []
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const parentData = await fetchParentProfile();
      if (parentData) {
        await fetchChildrenStats(parentData);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const parentData = await fetchParentProfile();
    if (parentData) {
      await fetchChildrenStats(parentData);
    }
    setRefreshing(false);
  };

  const quickActions = [
    {
      icon: <Eye size={20} />,
      title: "Voir les absences",
      description: "Consultez les absences de vos enfants",
      color: "from-orange-500 to-orange-600",
      href: "/parent/absences"
    },
    {
      icon: <Award size={20} />,
      title: "Consulter les notes",
      description: "Suivez la progression scolaire",
      color: "from-green-500 to-green-600",
      href: "/parent/notes"
    },
    {
      icon: <CreditCard size={20} />,
      title: "Gérer les formations",
      description: "Payez et gérez l'accès aux formations",
      color: "from-blue-500 to-blue-600",
      href: "/parent/formations"
    },
    {
      icon: <Bell size={20} />,
      title: "Rappels importants",
      description: "Consultez les notifications importantes",
      color: "from-purple-500 to-purple-600",
      href: "/parent/notifications"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-700 font-medium"
          >
            Chargement du tableau de bord...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
          >
            Réessayer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Tableau de bord - {profile?.name || userInfo.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Suivez la progression de vos {childrenStats.totalChildren} enfant{childrenStats.totalChildren > 1 ? 's' : ''} ✨
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg text-sm sm:text-base"
        >
          <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{childrenStats.totalChildren}</p>
              <p className="text-gray-600 text-sm sm:text-base">Enfants</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{childrenStats.totalNotes}</p>
              <p className="text-gray-600">Notes totales</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{childrenStats.averageGrade}/20</p>
              <p className="text-gray-600">Moyenne générale</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{childrenStats.totalAbsences}</p>
              <p className="text-gray-600">Absences</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Children Details */}
      {childrenStats.children.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails par enfant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childrenStats.children.map((child, index) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-gray-600">{child.classe}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Notes</span>
                    <span className="font-semibold">{child.notes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Moyenne</span>
                    <span className="font-semibold text-purple-600">{child.average}/20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Absences</span>
                    <span className="font-semibold text-orange-600">{child.absences.length}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Children Alert */}
      {childrenStats.totalChildren === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center"
        >
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">
            Aucun enfant lié à votre compte
          </h3>
          <p className="text-yellow-700 mb-4">
            Pour voir les données de vos enfants, ils doivent être liés à votre compte parent.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all duration-200"
          >
            Contacter l'administration
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardParent; 