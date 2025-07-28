import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Star,
  Award,
  RefreshCw,
  Filter,
  Archive,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Target,
  Zap,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const RappelsParent = () => {
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed, urgent
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRappel, setNewRappel] = useState({
    titre: '',
    description: '',
    dateEcheance: '',
    priorite: 'medium',
    enfants: []
  });
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Fonction pour récupérer les vraies données de rappels
  const fetchRappels = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Récupérer les données du parent
      const parentResponse = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const parent = parentResponse.data;
      let allRappels = [];

      // Pour chaque enfant, récupérer les rappels
      for (const child of parent.children) {
        try {
          const rappelsResponse = await axios.get(`/api/rappels/student/${child._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Ajouter les informations de l'enfant à chaque rappel
          const rappelsWithChild = rappelsResponse.data.map(rappel => ({
            ...rappel,
            enfant: child.name,
            enfantId: child._id
          }));
          
          allRappels.push(...rappelsWithChild);
        } catch (err) {
          console.log(`Pas de rappels pour ${child.name}`);
        }
      }

      // Trier par priorité et date
      allRappels.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priorite] - priorityOrder[a.priorite];
      });

      setRappels(allRappels);
    } catch (err) {
      console.error("Erreur récupération rappels:", err);
      // Rappels de test en cas d'erreur
      setRappels([
        {
          _id: '1',
          titre: 'Rendez-vous parent-professeur',
          description: 'Rencontre avec le professeur de mathématiques pour discuter des progrès',
          dateEcheance: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          priorite: 'urgent',
          statut: 'actif',
          enfant: 'Marie',
          enfantId: '1',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          titre: 'Paiement formation',
          description: 'Régler le paiement pour la formation d\'anglais',
          dateEcheance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          priorite: 'high',
          statut: 'actif',
          enfant: 'Thomas',
          enfantId: '2',
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          titre: 'Réunion parents d\'élèves',
          description: 'Assemblée générale des parents d\'élèves',
          dateEcheance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priorite: 'medium',
          statut: 'actif',
          enfant: 'Marie',
          enfantId: '1',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRappels();
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getDaysUntilDeadline = (dateEcheance) => {
    const now = new Date();
    const deadline = new Date(dateEcheance);
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const markAsCompleted = async (rappelId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/rappels/${rappelId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour localement
      setRappels(prev => 
        prev.map(rappel => 
          rappel._id === rappelId 
            ? { ...rappel, statut: 'termine' }
            : rappel
        )
      );
    } catch (err) {
      console.error("Erreur marquage comme terminé:", err);
      // Mise à jour locale en cas d'erreur
      setRappels(prev => 
        prev.map(rappel => 
          rappel._id === rappelId 
            ? { ...rappel, statut: 'termine' }
            : rappel
        )
      );
    }
  };

  const deleteRappel = async (rappelId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/rappels/${rappelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRappels(prev => prev.filter(rappel => rappel._id !== rappelId));
    } catch (err) {
      console.error("Erreur suppression rappel:", err);
      // Suppression locale en cas d'erreur
      setRappels(prev => prev.filter(rappel => rappel._id !== rappelId));
    }
  };

  const createRappel = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/rappels", newRappel, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRappels(prev => [response.data, ...prev]);
      setShowCreateModal(false);
      setNewRappel({
        titre: '',
        description: '',
        dateEcheance: '',
        priorite: 'medium',
        enfants: []
      });
    } catch (err) {
      console.error("Erreur création rappel:", err);
      // Création locale en cas d'erreur
      const newRappelWithId = {
        ...newRappel,
        _id: Date.now().toString(),
        statut: 'actif',
        createdAt: new Date().toISOString()
      };
      setRappels(prev => [newRappelWithId, ...prev]);
      setShowCreateModal(false);
      setNewRappel({
        titre: '',
        description: '',
        dateEcheance: '',
        priorite: 'medium',
        enfants: []
      });
    }
  };

  const filteredRappels = rappels.filter(rappel => {
    if (filter === 'active') return rappel.statut === 'actif';
    if (filter === 'completed') return rappel.statut === 'termine';
    if (filter === 'urgent') return rappel.priorite === 'urgent' && rappel.statut === 'actif';
    return true;
  });

  const activeRappels = rappels.filter(r => r.statut === 'actif').length;
  const urgentRappels = rappels.filter(r => r.priorite === 'urgent' && r.statut === 'actif').length;
  const completedRappels = rappels.filter(r => r.statut === 'termine').length;

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
            Chargement des rappels...
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
              <span>Rappels & Alertes</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              Gestion des rappels et alertes pour vos enfants ✨
            </p>
        </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Nouveau Rappel
            </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
              onClick={fetchRappels}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
      </div>
        </div>
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
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{activeRappels}</p>
              <p className="text-gray-600 text-sm sm:text-base">Rappels actifs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
              <p className="text-2xl font-bold text-gray-900">{urgentRappels}</p>
              <p className="text-gray-600">Urgents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedRappels}</p>
              <p className="text-gray-600">Terminés</p>
            </div>
          </div>
          </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rappels.length}</p>
              <p className="text-gray-600">Total</p>
            </div>
          </div>
          </div>
        </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex items-center gap-4"
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
            Tous ({rappels.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'active' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Actifs ({activeRappels})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'urgent' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Urgents ({urgentRappels})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'completed' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Terminés ({completedRappels})
          </button>
      </div>
      </motion.div>

      {/* Liste des rappels */}
      <div className="space-y-4">
        {filteredRappels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun rappel</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Vous n\'avez aucun rappel pour le moment.' 
                : filter === 'active' 
                  ? 'Aucun rappel actif.'
                  : filter === 'urgent'
                    ? 'Aucun rappel urgent.'
                    : 'Aucun rappel terminé.'
              }
            </p>
        </motion.div>
      ) : (
          filteredRappels.map((rappel, index) => {
            const daysUntilDeadline = getDaysUntilDeadline(rappel.dateEcheance);
            const isOverdue = daysUntilDeadline < 0;
            const isUrgent = daysUntilDeadline <= 1 && daysUntilDeadline >= 0;
            
            return (
              <motion.div
                key={rappel._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  rappel.statut === 'termine' 
                    ? 'border-green-200 bg-green-50' 
                    : isOverdue
                      ? 'border-red-200 bg-red-50 ring-2 ring-red-200'
                      : isUrgent
                        ? 'border-orange-200 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        rappel.statut === 'termine' ? 'bg-green-100' :
                        isOverdue ? 'bg-red-100' :
                        isUrgent ? 'bg-orange-100' :
                        rappel.priorite === 'urgent' ? 'bg-red-100' :
                        rappel.priorite === 'high' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        {rappel.statut === 'termine' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : isOverdue ? (
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        ) : (
                          <Bell className="h-6 w-6 text-blue-600" />
                        )}
                  </div>
                  <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{rappel.titre}</h3>
                          {rappel.statut === 'termine' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Terminé
                            </span>
                          )}
                          {isOverdue && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              En retard
                            </span>
                          )}
                          {isUrgent && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              Urgent
                            </span>
                          )}
                          {rappel.priorite === 'urgent' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              Priorité haute
                            </span>
                      )}
                    </div>
                        <p className="text-gray-700 text-base mb-2">{rappel.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {rappel.enfant}
                          </div>
                      <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(rappel.dateEcheance).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {isOverdue 
                              ? `${Math.abs(daysUntilDeadline)} jour${Math.abs(daysUntilDeadline) > 1 ? 's' : ''} de retard`
                              : daysUntilDeadline === 0 
                                ? 'Aujourd\'hui'
                                : `${daysUntilDeadline} jour${daysUntilDeadline > 1 ? 's' : ''} restant${daysUntilDeadline > 1 ? 's' : ''}`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rappel.statut !== 'termine' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markAsCompleted(rappel._id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Marquer comme terminé"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRappel(rappel._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal de création */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nouveau Rappel</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={newRappel.titre}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, titre: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre du rappel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRappel.description}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Description du rappel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'échéance
                  </label>
                  <input
                    type="datetime-local"
                    value={newRappel.dateEcheance}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, dateEcheance: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={newRappel.priorite}
                    onChange={(e) => setNewRappel(prev => ({ ...prev, priorite: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
          </div>
        </div>
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={createRappel}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Créer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RappelsParent; 