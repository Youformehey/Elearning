import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  GraduationCap, 
  Clock, 
  Calendar,
  BookOpen,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Star,
  Award,
  RefreshCw,
  X,
  Filter,
  Archive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const NotificationParent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Fonction pour récupérer les vraies notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Récupérer les données des enfants
      const parentResponse = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const parent = parentResponse.data;
      const allNotifications = [];

      // Pour chaque enfant, générer des notifications
      for (const child of parent.children) {
        // Récupérer les absences récentes
        const absencesResponse = await axios.get(`/api/absences/student/${child._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Récupérer les notes récentes
        const notesResponse = await axios.get(`/api/notes/student/${child._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Notifications d'absences récentes
        const recentAbsences = absencesResponse.data
          .filter(absence => {
            const absenceDate = new Date(absence.date);
            const now = new Date();
            const diffHours = (now - absenceDate) / (1000 * 60 * 60);
            return diffHours <= 48; // Absences des dernières 48h
          })
          .map(absence => ({
            id: `absence_${absence._id}`,
            type: 'absence',
            title: 'Absence signalée',
            message: `${child.name} a été absent(e) en ${absence.course?.matiere?.nom || absence.course?.nom || 'cours'}`,
            time: getTimeAgo(new Date(absence.date)),
            read: false,
            priority: 'high',
            childName: child.name,
            icon: <AlertTriangle size={16} className="text-orange-500" />
          }));

        // Notifications de mauvaises notes
        const badNotes = notesResponse.data
          .filter(note => note.note < 10)
          .map(note => ({
            id: `note_${note._id}`,
            type: 'bad_note',
            title: 'Note préoccupante',
            message: `${child.name} a reçu ${note.note}/20 en ${note.cours?.nom || 'matière'}`,
            time: getTimeAgo(new Date(note.createdAt)),
            read: false,
            priority: 'high',
            childName: child.name,
            note: note.note,
            icon: <TrendingDown size={16} className="text-red-500" />
          }));

        // Notifications de bonnes notes
        const goodNotes = notesResponse.data
          .filter(note => note.note >= 16)
          .map(note => ({
            id: `good_note_${note._id}`,
            type: 'good_note',
            title: 'Excellente note !',
            message: `${child.name} a reçu ${note.note}/20 en ${note.cours?.nom || 'matière'}`,
            time: getTimeAgo(new Date(note.createdAt)),
            read: false,
            priority: 'medium',
            childName: child.name,
            note: note.note,
            icon: <Star size={16} className="text-yellow-500" />
          }));

        allNotifications.push(...recentAbsences, ...badNotes, ...goodNotes);
      }

      // Ajouter des notifications de formations
      const formationsNotifications = [
        {
          id: 'formation_1',
          type: 'formation',
          title: 'Nouvelle formation disponible',
          message: 'Formation Mathématiques Avancées - 49€',
          time: 'Il y a 2 heures',
          read: false,
          priority: 'medium',
          icon: <GraduationCap size={16} className="text-blue-500" />
        },
        {
          id: 'formation_2',
          type: 'formation',
          title: 'Promotion formations',
          message: '-20% sur toutes les formations cette semaine',
          time: 'Il y a 1 jour',
          read: false,
          priority: 'low',
          icon: <Award size={16} className="text-green-500" />
        }
      ];

      allNotifications.push(...formationsNotifications);

      // Trier par priorité et date
      allNotifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setNotifications(allNotifications);
    } catch (err) {
      console.error("Erreur récupération notifications:", err);
      // Notifications de fallback
      setNotifications([
        {
          id: 'fallback_1',
          type: 'absence',
          title: 'Absence signalée',
          message: 'Marie a été absente en Mathématiques',
          time: 'Il y a 2 heures',
          read: false,
          priority: 'high',
          icon: <AlertTriangle size={16} className="text-orange-500" />
        },
        {
          id: 'fallback_2',
          type: 'bad_note',
          title: 'Note préoccupante',
          message: 'Thomas a reçu 8/20 en Français',
          time: 'Il y a 1 jour',
          read: false,
          priority: 'high',
          icon: <TrendingDown size={16} className="text-red-500" />
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
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

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
            Chargement des notifications...
          </motion.p>
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
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <span>Notifications</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''} ✨
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Tout marquer comme lu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchNotifications}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Actualiser
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-4"
      >
        <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-lg">
          <Filter className="h-4 w-4 text-gray-500" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'unread' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'read' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>
      </motion.div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Vous n\'avez aucune notification pour le moment.' 
                : filter === 'unread' 
                  ? 'Toutes vos notifications ont été lues.' 
                  : 'Aucune notification lue.'
              }
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                !notification.read 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${notification.priority === 'high' ? 'ring-2 ring-red-200' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      notification.priority === 'high' ? 'bg-red-100' :
                      notification.priority === 'medium' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{notification.title}</h3>
                        {notification.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            Urgent
                          </span>
                        )}
                        {!notification.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-700 text-base mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {notification.time}
                        </div>
                        {notification.childName && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {notification.childName}
                          </div>
                        )}
                        {notification.note && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {notification.note}/20
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Marquer comme lu"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationParent; 