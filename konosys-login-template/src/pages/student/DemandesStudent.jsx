import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  Calendar,
  User,
  BookOpen,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// Données de test pour les demandes
const demandesTest = [
  {
    _id: "1",
    sujet: "Justification d'absence",
    message: "Bonjour, j'ai été absent le 15/12/2024 car j'étais malade. J'ai un certificat médical. Pouvez-vous justifier mon absence ?",
    statut: "En attente",
    type: "absence",
    dateAbsence: "2024-12-15",
    createdAt: "2024-12-16T10:30:00Z",
    reponse: null
  },
  {
    _id: "2",
    sujet: "Demande de rattrapage",
    message: "J'ai raté le contrôle de mathématiques à cause d'un rendez-vous médical. Est-ce possible de le rattraper ?",
    statut: "Acceptée",
    type: "rattrapage",
    dateAbsence: "2024-12-10",
    createdAt: "2024-12-11T14:20:00Z",
    reponse: "Votre demande est acceptée. Le rattrapage aura lieu le 20/12/2024 à 14h."
  },
  {
    _id: "3",
    sujet: "Question sur le cours",
    message: "Je n'ai pas bien compris la leçon sur les équations. Pouvez-vous m'expliquer ?",
    statut: "Refusée",
    type: "question",
    dateAbsence: null,
    createdAt: "2024-12-14T09:15:00Z",
    reponse: "Veuillez consulter vos camarades ou venir me voir pendant les heures de permanence."
  }
];

export default function DemandesStudent() {
  const { darkMode } = useContext(ThemeContext);
  const [demandes, setDemandes] = useState(demandesTest);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("toutes");
  const [form, setForm] = useState({
    sujet: "",
    message: "",
    type: "absence",
    dateAbsence: ""
  });

  // Filtrer les demandes
  const filteredDemandes = demandes.filter(demande => {
    if (filter === "toutes") return true;
    if (filter === "en_attente") return demande.statut === "En attente";
    if (filter === "acceptees") return demande.statut === "Acceptée";
    if (filter === "refusees") return demande.statut === "Refusée";
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sujet || !form.message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      // Simulation de l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nouvelleDemande = {
        _id: Date.now().toString(),
        ...form,
        statut: "En attente",
        createdAt: new Date().toISOString(),
        reponse: null
      };
      
      setDemandes(prev => [nouvelleDemande, ...prev]);
      setForm({ sujet: "", message: "", type: "absence", dateAbsence: "" });
      setShowForm(false);
      alert("✅ Demande envoyée avec succès !");
    } catch (error) {
      alert("❌ Erreur lors de l'envoi de la demande.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      setDemandes(prev => prev.filter(d => d._id !== id));
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

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center mb-12"
        >
          <motion.h1
            className={`text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : ''}`}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            📝 Mes Demandes
          </motion.h1>
          <motion.p
            className={`text-xl font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Envoie tes demandes aux professeurs et suis leurs réponses ! ✨
          </motion.p>
        </motion.div>

        {/* Bouton Nouvelle Demande */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
            Nouvelle Demande
          </motion.button>
        </motion.div>

        {/* Formulaire Nouvelle Demande */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              className={`mb-8 rounded-2xl shadow-2xl border-2 ${darkMode ? 'bg-gray-800/90 border-purple-500/30' : 'bg-white/90 border-pink-200'}`}
            >
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📝 Nouvelle Demande
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                        Type de demande
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({...form, type: e.target.value})}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      >
                        <option value="absence">📅 Justification d'absence</option>
                        <option value="rattrapage">📚 Demande de rattrapage</option>
                        <option value="question">❓ Question sur le cours</option>
                        <option value="autre">📝 Autre demande</option>
                      </select>
                    </div>
                    
                    {form.type === "absence" && (
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                          Date d'absence
                        </label>
                        <input
                          type="date"
                          value={form.dateAbsence}
                          onChange={(e) => setForm({...form, dateAbsence: e.target.value})}
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={form.sujet}
                      onChange={(e) => setForm({...form, sujet: e.target.value})}
                      placeholder="Ex: Justification d'absence pour maladie"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
                      Message détaillé
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      placeholder="Expliquez votre situation en détail..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>

                  <div className="flex gap-4 justify-end">
                    <motion.button
                      type="button"
                      onClick={() => setShowForm(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="submit"
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
                          Envoyer la demande
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {[
            { key: "toutes", label: "🌟 Toutes", icon: FileText },
            { key: "en_attente", label: "⏳ En attente", icon: Clock },
            { key: "acceptees", label: "✅ Acceptées", icon: CheckCircle },
            { key: "refusees", label: "❌ Refusées", icon: XCircle }
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                filter === filterOption.key
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : darkMode 
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <filterOption.icon className="w-5 h-5" />
              {filterOption.label}
            </motion.button>
          ))}
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
                📝
              </motion.div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Aucune demande trouvée
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {filter === "toutes" ? "Crée ta première demande !" : "Aucune demande dans cette catégorie"}
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
                className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${darkMode ? 'bg-gray-800/90 border-purple-500/30' : 'bg-white/90 border-pink-200'}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        {getTypeIcon(demande.type)}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {demande.sujet}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Envoyée le {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${getStatutColor(demande.statut)}`}>
                        {getStatutIcon(demande.statut)}
                        {demande.statut}
                      </span>
                      <motion.button
                        onClick={() => handleDelete(demande._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
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
                        <User className="w-4 h-4 text-green-600" />
                        <span className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          Réponse du professeur :
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
      </div>
    </div>
  );
}
