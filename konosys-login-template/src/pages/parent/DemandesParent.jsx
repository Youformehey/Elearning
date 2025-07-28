import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { 
  FileText,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const DemandesParent = () => {
  const [demandesByChild, setDemandesByChild] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  const fetchDemandes = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/parents/children/demandes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemandesByChild(response.data);
    } catch (err) {
      console.error("Erreur récupération demandes:", err);
      setError("Impossible de charger les demandes. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDemandes();
  };

  // Calcul des statistiques globales
  const getGlobalStats = () => {
    const allDemandes = Object.values(demandesByChild).flatMap(child => child.demandes);
    const totalDemandes = allDemandes.length;
    const totalChildren = Object.keys(demandesByChild).length;
    const totalEnCours = allDemandes.filter(d => d.statut === "en_cours").length;
    const totalTraitees = allDemandes.filter(d => d.statut === "traitee").length;

    return { totalDemandes, totalChildren, totalEnCours, totalTraitees };
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case "en_cours":
        return "text-orange-600 bg-orange-50";
      case "traitee":
        return "text-green-600 bg-green-50";
      case "rejetee":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statut) => {
    switch (statut) {
      case "en_cours":
        return <Clock className="h-4 w-4" />;
      case "traitee":
        return <CheckCircle className="h-4 w-4" />;
      case "rejetee":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = getGlobalStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Demandes de vos enfants</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Consultez et suivez les demandes de vos {stats.totalChildren} enfant(s)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </motion.button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total demandes</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalDemandes}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnCours}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Traitées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTraitees}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enfants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalChildren}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Liste des demandes par enfant */}
      {Object.values(demandesByChild).map(({ enfant, demandes }) => (
        <motion.div
          key={enfant._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{enfant.name}</h2>
                <p className="text-gray-600">{enfant.classe}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-600">{demandes.length} demande(s)</span>
            </div>
          </div>

          {demandes.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune demande enregistrée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {demandes.map(demande => (
                <div
                  key={demande._id}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(demande.statut)}`}>
                        {getStatusIcon(demande.statut)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{demande.type}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(demande.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(demande.statut)}`}>
                      {demande.statut === "en_cours" ? "En cours" :
                       demande.statut === "traitee" ? "Traitée" :
                       demande.statut === "rejetee" ? "Rejetée" : "Inconnue"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{demande.description}</p>
                  {demande.reponse && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Réponse :</span>
                      </div>
                      <p className="text-gray-600">{demande.reponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DemandesParent; 