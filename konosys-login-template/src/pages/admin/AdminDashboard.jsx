import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  RefreshCw,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Database,
  Clock,
  Star,
  Award,
  Target,
  Sparkles,
  UserPlus,
  Building,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Crown,
  Zap,
  Sun,
  Moon
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { getDashboardStats, getRecentActivities } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    teachers: 0,
    activeClasses: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Utiliser le service admin pour récupérer les vraies données
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Ajouter un étudiant",
      icon: UserPlus,
      color: "from-emerald-500 via-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      textColor: "text-emerald-700",
      darkTextColor: "dark:text-emerald-300",
      description: "Créer un nouveau compte étudiant",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Créer une classe",
      icon: Building,
      color: "from-blue-500 via-blue-600 to-blue-700",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/30",
      textColor: "text-blue-700",
      darkTextColor: "dark:text-blue-300",
      description: "Ajouter une nouvelle classe",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Gérer les notes",
      icon: FileText,
      color: "from-purple-500 via-purple-600 to-purple-700",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/30",
      textColor: "text-purple-700",
      darkTextColor: "dark:text-purple-300",
      description: "Accéder au système de notes",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Configuration système",
      icon: Settings,
      color: "from-orange-500 via-orange-600 to-orange-700",
      bgColor: "bg-orange-100",
      darkBgColor: "dark:bg-orange-900/30",
      textColor: "text-orange-700",
      darkTextColor: "dark:text-orange-300",
      description: "Paramètres avancés",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const systemStatus = [
    { 
      name: "Serveur", 
      status: "Online", 
      icon: Activity, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      pulse: true
    },
    { 
      name: "Base de données", 
      status: "Online", 
      icon: Database, 
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      darkBgColor: "dark:bg-emerald-900/30",
      pulse: true
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-700 dark:text-gray-300 font-medium"
          >
            Chargement du dashboard...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Préparation de votre espace d'administration
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header */}
      <motion.div 
        className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-blue-200/50'
        }`}
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
            <div>
              <motion.h1 
                className={`text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Tableau de bord d'administration
              </motion.h1>
              <motion.p 
                className={`font-medium ${darkMode ? 'text-gray-300' : 'text-purple-600'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Bienvenue dans le panneau de contrôle LearnUp. Gérez tous les aspects de votre plateforme éducative.
              </motion.p>
            </div>
            
            <motion.button
              onClick={loadDashboardData}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
            >
              <RefreshCw className="w-5 h-5" />
              Actualiser
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setHoveredCard('users')}
              onHoverEnd={() => setHoveredCard(null)}
              className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-blue-100/50'
              } ${hoveredCard === 'users' ? 'shadow-2xl' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Utilisateurs totaux
                  </p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">+12% ce mois</p>
                </div>
                <motion.div
                  className="p-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ scale: hoveredCard === 'users' ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setHoveredCard('students')}
              onHoverEnd={() => setHoveredCard(null)}
              className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-emerald-100/50'
              } ${hoveredCard === 'students' ? 'shadow-2xl' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Étudiants actifs
                  </p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stats.activeStudents}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">+8% ce mois</p>
                </div>
                <motion.div
                  className="p-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ scale: hoveredCard === 'students' ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setHoveredCard('teachers')}
              onHoverEnd={() => setHoveredCard(null)}
              className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-purple-100/50'
              } ${hoveredCard === 'teachers' ? 'shadow-2xl' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Professeurs
                  </p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stats.teachers}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">+5% ce mois</p>
                </div>
                <motion.div
                  className="p-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ scale: hoveredCard === 'teachers' ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setHoveredCard('classes')}
              onHoverEnd={() => setHoveredCard(null)}
              className={`p-6 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-orange-100/50'
              } ${hoveredCard === 'classes' ? 'shadow-2xl' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Classes actives
                  </p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stats.activeClasses}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">+3% ce mois</p>
                </div>
                <motion.div
                  className="p-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ scale: hoveredCard === 'classes' ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Building className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white/80 border-blue-100/50'
            }`}
          >
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Actions rapides
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Accès rapide aux fonctionnalités principales
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left backdrop-blur-sm ${
                      darkMode 
                        ? 'border-gray-700/50 hover:border-gray-600/50 bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'border-gray-200/50 hover:border-gray-300/50 bg-white/50 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {action.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-blue-100/50'
              }`}
            >
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Activités récentes
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Dernières actions sur la plateforme
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'
                      }`}
                    >
                      <motion.div
                        className={`p-2 rounded-lg ${activity.bgColor} ${activity.darkBgColor} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </motion.div>
                      <div className="flex-1">
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {activity.message}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-blue-100/50'
              }`}
            >
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Statut système
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  État des services
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {systemStatus.map((status, index) => (
                    <motion.div
                      key={status.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, x: -5 }}
                      className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-sm ${
                        darkMode ? 'bg-gray-700/50' : 'bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`p-2 rounded-lg ${status.bgColor} ${status.darkBgColor} shadow-lg`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <status.icon className={`w-5 h-5 ${status.color}`} />
                        </motion.div>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {status.name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {status.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className={`w-2 h-2 bg-emerald-500 rounded-full ${status.pulse ? 'animate-pulse' : ''}`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm text-emerald-600 font-medium">Online</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Platform Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-700/50' 
                : 'bg-white/80 border-blue-100/50'
            }`}
          >
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Utilisation de la plateforme
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Statistiques d'utilisation
              </p>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Graphiques en cours de développement
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Fonctionnalités avancées à venir
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 