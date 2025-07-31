import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Target,
  Users,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const HomeNavbarParent = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    childrenCount: 0,
    averageGrade: 0,
    alertsCount: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Fonction pour récupérer les vraies données
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Récupérer les données du parent
      const parentResponse = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const parent = parentResponse.data;
      let totalAlerts = 0;
      let totalGrades = 0;
      let gradeCount = 0;
      let allNotifications = [];

      // Pour chaque enfant, récupérer les données
      for (const child of parent.children) {
        try {
          // Récupérer les absences récentes (alertes)
          const absencesResponse = await axios.get(`/api/absences/student/${child._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Récupérer les notes
          const notesResponse = await axios.get(`/api/notes/student/${child._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Compter les absences récentes (dernières 48h)
          const recentAbsences = absencesResponse.data.filter(absence => {
            const absenceDate = new Date(absence.date);
            const now = new Date();
            const diffHours = (now - absenceDate) / (1000 * 60 * 60);
            return diffHours <= 48;
          });
          totalAlerts += recentAbsences.length;

          // Créer des notifications pour les absences récentes
          recentAbsences.forEach(absence => {
            allNotifications.push({
              id: `absence_${absence._id}`,
              type: "absence",
              title: "Absence signalée",
              message: `${child.name} a été absent(e) en ${absence.course?.matiere?.nom || absence.course?.nom || 'cours'}`,
              time: getTimeAgo(new Date(absence.date)),
              read: false,
              priority: "high",
              icon: <AlertCircle size={18} className="text-orange-500" />
            });
          });

          // Compter les mauvaises notes (< 10)
          const badNotes = notesResponse.data.filter(note => note.note < 10);
          totalAlerts += badNotes.length;

          // Créer des notifications pour les mauvaises notes
          badNotes.forEach(note => {
            allNotifications.push({
              id: `bad_note_${note._id}`,
              type: "bad_note",
              title: "Note préoccupante",
              message: `${child.name} a reçu ${note.note}/20 en ${note.cours?.nom || 'matière'}`,
              time: getTimeAgo(new Date(note.createdAt)),
              read: false,
              priority: "high",
              icon: <TrendingUp size={18} className="text-red-500" />
            });
          });

          // Créer des notifications pour les bonnes notes (≥ 16)
          const goodNotes = notesResponse.data.filter(note => note.note >= 16);
          goodNotes.forEach(note => {
            allNotifications.push({
              id: `good_note_${note._id}`,
              type: "good_note",
              title: "Excellente note !",
              message: `${child.name} a reçu ${note.note}/20 en ${note.cours?.nom || 'matière'}`,
              time: getTimeAgo(new Date(note.createdAt)),
              read: false,
              priority: "medium",
              icon: <Star size={18} className="text-yellow-500" />
            });
          });

          // Calculer la moyenne des notes
          notesResponse.data.forEach(note => {
            totalGrades += note.note;
            gradeCount++;
          });
        } catch (err) {
          console.error(`Erreur récupération données pour ${child.name}:`, err);
        }
      }

      const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(1) : 0;

      // Ajouter des notifications de formations (si pas assez de vraies notifications)
      if (allNotifications.length < 3) {
        allNotifications.push(
          {
            id: 'formation_1',
            type: 'formation',
            title: 'Nouvelle formation disponible',
            message: 'Formation Mathématiques Avancées - 49€',
            time: 'Il y a 2 heures',
            read: false,
            priority: 'medium',
            icon: <GraduationCap size={18} className="text-blue-500" />
          },
          {
            id: 'formation_2',
            type: 'formation',
            title: 'Promotion formations',
            message: '-20% sur toutes les formations cette semaine',
            time: 'Il y a 1 jour',
            read: false,
            priority: 'low',
            icon: <Award size={18} className="text-blue-600" />
          }
        );
      }

      // Trier par priorité et date
      allNotifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setStats({
        childrenCount: parent.children.length,
        averageGrade: parseFloat(averageGrade),
        alertsCount: totalAlerts
      });

      setNotifications(allNotifications);
    } catch (err) {
      console.error("Erreur récupération stats:", err);
      // Valeurs par défaut en cas d'erreur
      setStats({
        childrenCount: 0,
        averageGrade: 0,
        alertsCount: 0
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-blue-200/50 px-8 py-6 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'espace parent..."
              className="pl-12 pr-6 py-3 border border-blue-300/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 w-80 bg-white/50 backdrop-blur-sm transition-all duration-300"
            />
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Users size={16} className="text-blue-600" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-semibold text-blue-700">{stats.childrenCount} Enfants</span>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Award size={16} className="text-blue-600" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-semibold text-blue-700">Moy. {stats.averageGrade}</span>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <AlertCircle size={16} className="text-orange-600" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-semibold text-orange-700">{stats.alertsCount} Alertes</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200/50"
            >
              <Bell size={20} className="text-blue-600" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                >
                  {unreadCount}
                </motion.div>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 z-50"
                >
                  <div className="p-6 border-b border-blue-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                      <span className="text-sm text-gray-500 font-medium">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-gray-100/50 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          } ${notification.priority === 'high' ? 'ring-2 ring-red-200' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-xl ${
                              notification.priority === 'high' ? 'bg-red-100' :
                              notification.priority === 'medium' ? 'bg-orange-100' :
                              'bg-blue-100'
                            }`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                                {notification.priority === 'high' && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    Urgent
                                  </span>
                                )}
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {notification.time}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-blue-200/50">
                    <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                      Voir toutes les notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200/50"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{userInfo.name}</p>
                <p className="text-xs text-blue-600 font-medium">Parent • Connecté</p>
              </div>
              <ChevronDown size={16} className="text-blue-400" />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 z-50"
                >
                  <div className="p-6 border-b border-blue-200/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{userInfo.name}</p>
                        <p className="text-sm text-gray-500">{userInfo.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600 font-semibold">En ligne</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-blue-50 transition-colors text-left">
                      <User size={18} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Mon profil</span>
                    </button>
                    <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-blue-50 transition-colors text-left">
                      <Settings size={18} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Paramètres</span>
                    </button>
                    <button className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-blue-50 transition-colors text-left">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Sécurité</span>
                    </button>
                    <div className="border-t border-blue-200/50 my-3"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-red-600" />
                      <span className="text-sm font-semibold text-red-600">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default HomeNavbarParent; 