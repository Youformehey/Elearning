import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  BookOpen,
  Loader2,
  Send,
  Filter,
  Search,
  Users,
  Reply,
  Eye
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// Données de test pour les demandes des étudiants
const demandesEtudiantsTest = [
  {
    _id: "1",
    etudiant: {
      name: "Seyf Ben Ali",
      email: "seyf@gmail.com",
      classe: "6A"
    },
    professeur: {
      _id: "prof1",
      name: "Sofiane Jardak",
      email: "sofiane@gmail.com"
    },
    sujet: "Justification d'absence",
    message: "Bonjour, j'ai été absent le 15/12/2024 car j'étais malade. J'ai un certificat médical. Pouvez-vous justifier mon absence ?",
    statut: "En attente",
    type: "absence",
    dateAbsence: "2024-12-15",
    createdAt: "2024-12-16T10:30:00Z",
    reponse: null,
    cours: "Mathématiques"
  },
  {
    _id: "2",
    etudiant: {
      name: "Sonia Ben Ali",
      email: "sonia@gmail.com",
      classe: "5A"
    },
    professeur: {
      _id: "prof1",
      name: "Sofiane Jardak",
      email: "sofiane@gmail.com"
    },
    sujet: "Demande de rattrapage",
    message: "J'ai raté le contrôle de mathématiques à cause d'un rendez-vous médical. Est-ce possible de le rattraper ?",
    statut: "En attente",
    type: "rattrapage",
    dateAbsence: "2024-12-10",
    createdAt: "2024-12-11T14:20:00Z",
    reponse: null,
    cours: "Mathématiques"
  },
  {
    _id: "3",
    etudiant: {
      name: "Ahmed Ben Salem",
      email: "ahmed@gmail.com",
      classe: "6A"
    },
    professeur: {
      _id: "prof2",
      name: "Neil Johnson",
      email: "neil@gmail.com"
    },
    sujet: "Question sur le cours",
    message: "Je n'ai pas bien compris la leçon sur les équations. Pouvez-vous m'expliquer ?",
    statut: "En attente",
    type: "question",
    dateAbsence: null,
    createdAt: "2024-12-14T09:15:00Z",
    reponse: null,
    cours: "Physique"
  },
  {
    _id: "4",
    etudiant: {
      name: "Fatma Ben Othman",
      email: "fatma@gmail.com",
      classe: "5A"
    },
    professeur: {
      _id: "prof1",
      name: "Sofiane Jardak",
      email: "sofiane@gmail.com"
    },
    sujet: "Justification d'absence",
    message: "J'ai été absent hier car j'avais un rendez-vous chez le dentiste. Pouvez-vous justifier mon absence ?",
    statut: "Acceptée",
    type: "absence",
    dateAbsence: "2024-12-13",
    createdAt: "2024-12-14T08:00:00Z",
    reponse: "Votre absence est justifiée. N'oubliez pas de rattraper le cours manqué.",
    cours: "Mathématiques"
  }
];

export default function DemandesProfesseur() {
  const { darkMode } = useContext(ThemeContext);
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showReponse, setShowReponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("en_attente");
  const [searchTerm, setSearchTerm] = useState("");
  const [reponse, setReponse] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentProfId = userInfo?.email === "sofiane@gmail.com" ? "prof1" : "prof2";

  // Filtrer les demandes selon le professeur connecté
  const demandesDuProf = demandesEtudiantsTest.filter(demande => 
    demande.professeur._id === currentProfId
  );

  // Filtrer et rechercher les demandes
  const filteredDemandes = demandesDuProf.filter(demande => {
    const matchesFilter = filter === "toutes" || demande.statut === 
      (filter === "en_attente" ? "En attente" : 
       filter === "acceptees" ? "Acceptée" : 
       filter === "refusees" ? "Refusée" : "");
    
    const matchesSearch = demande.etudiant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.cours.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleRepondre = (demande) => {
    setSelectedDemande(demande);
    setReponse(demande.reponse || "");
    setShowReponse(true);
  };

  const handleSubmitReponse = async () => {
    if (!reponse.trim()) {
      alert("Veuillez écrire une réponse.");
      return;
    }

    setLoading(true);
    try {
      // Simulation de l'envoi de la réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDemandes(prev => prev.map(d => 
        d._id === selectedDemande._id 
          ? { ...d, reponse: reponse, statut: "Acceptée" }
          : d
      ));
      
      setShowReponse(false);
      setSelectedDemande(null);
      setReponse("");
      alert("✅ Réponse envoyée avec succès !");
    } catch (error) {
      alert("❌ Erreur lors de l'envoi de la réponse.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefuser = async (demande) => {
    if (!window.confirm("Êtes-vous sûr de vouloir refuser cette demande ?")) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDemandes(prev => prev.map(d => 
        d._id === demande._id 
          ? { ...d, statut: "Refusée", reponse: "Votre demande a été refusée." }
          : d
      ));
      
      alert("❌ Demande refusée.");
    } catch (error) {
      alert("❌ Erreur lors du refus.");
    } finally {
      setLoading(false);
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "En attente": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Acceptée": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Refusée": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "En attente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Acceptée": return "bg-green-100 text-green-700 border-green-200";
      case "Refusée": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "absence": return <Calendar className="w-4 h-4" />;
      case "rattrapage": return <BookOpen className="w-4 h-4" />;
      case "question": return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDemandesCount = (statut) => {
    return demandesDuProf.filter(d => d.statut === statut).length;
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.h1
            className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            📋 Gestion des Demandes
          </motion.h1>
          <motion.p
            className={`text-xl font-medium ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Gérez les demandes de vos étudiants de manière efficace et professionnelle ! ✨
          </motion.p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "En attente", count: getDemandesCount("En attente"), color: "from-yellow-400 to-orange-500", icon: Clock },
            { label: "Acceptées", count: getDemandesCount("Acceptée"), color: "from-green-400 to-emerald-500", icon: CheckCircle },
            { label: "Refusées", count: getDemandesCount("Refusée"), color: "from-red-400 to-pink-500", icon: XCircle },
            { label: "Total", count: demandesDuProf.length, color: "from-blue-400 to-indigo-500", icon: FileText }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <stat.icon className="w-8 h-8 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "en_attente", label: "⏳ En attente", icon: Clock },
              { key: "acceptees", label: "✅ Acceptées", icon: CheckCircle },
              { key: "refusees", label: "❌ Refusées", icon: XCircle },
              { key: "toutes", label: "🌟 Toutes", icon: FileText }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : darkMode 
                      ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <filterOption.icon className="w-4 h-4" />
                {filterOption.label}
              </motion.button>
            ))}
          </div>

          {/* Recherche */}
          <div className="flex-1 max-w-md">
            <div className={`relative ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par étudiant, sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-700 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Liste des demandes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {filteredDemandes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📋
              </motion.div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucune demande trouvée
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filter === "toutes" ? "Aucune demande pour le moment" : "Aucune demande dans cette catégorie"}
              </p>
            </motion.div>
          ) : (
            filteredDemandes.map((demande, index) => (
              <motion.div
                key={demande._id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-blue-500/30' : 'bg-white/90 border-blue-200'}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        {getTypeIcon(demande.type)}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {demande.sujet}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                            <User className="w-4 h-4 inline mr-1" />
                            {demande.etudiant.name} ({demande.etudiant.classe})
                          </span>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {demande.cours}
                          </span>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${getStatutColor(demande.statut)}`}>
                        {getStatutIcon(demande.statut)}
                        {demande.statut}
                      </span>
                      
                      {demande.statut === "En attente" && (
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleRepondre(demande)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200"
                            title="Répondre"
                          >
                            <Reply className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleRefuser(demande)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {demande.message}
                    </p>
                  </div>

                  {demande.reponse && (
                    <div className={`p-4 rounded-xl border-l-4 border-green-500 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="w-4 h-4 text-green-600" />
                        <span className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          Votre réponse :
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                        {demande.reponse}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal de réponse */}
        <AnimatePresence>
          {showReponse && selectedDemande && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowReponse(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-2xl w-full shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                    Répondre à la demande
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedDemande.etudiant.name} - {selectedDemande.sujet}
                  </p>
                </div>

                <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Message de l'étudiant :</strong><br />
                    {selectedDemande.message}
                  </p>
                </div>

                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Votre réponse
                  </label>
                  <textarea
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <motion.button
                    onClick={() => setShowReponse(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={handleSubmitReponse}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer la réponse
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 