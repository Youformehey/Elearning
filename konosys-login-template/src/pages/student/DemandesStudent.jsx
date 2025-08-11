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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Animations ultra attractives */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full"
          animate={{ 
            x: [0, 30, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-10 h-10 bg-pink-100 rounded-full"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 15, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div> */}

      {/* Floating decorative elements - Animations ultra attractives */}
      <motion.div
        className="absolute top-16 right-16 text-blue-400"
        animate={{ 
          rotate: 360,
          scale: [1, 1.3, 1],
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <FileText size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-16 text-green-400"
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1],
          y: [0, 10, 0],
          x: [0, -5, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Send size={28} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 text-purple-400"
        animate={{ 
          rotate: 360,
          scale: [1, 1.4, 1],
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <MessageSquare size={24} />
      </motion.div>

      <div className="relative z-10 py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header avec animations ultra attractives */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.2, rotate: 15 }}
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    "0 25px 50px -12px rgba(147, 51, 234, 0.25)",
                    "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                  ],
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  type: "tween", 
                  duration: 4,
                  boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.span 
                  className="text-6xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  📝
                </motion.span>
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: [1, 1.02, 1],
                    y: [0, -3, 0],
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  📝 Mes Demandes Magiques ✨
                </motion.h1>
                <motion.p 
                  className="text-xl sm:text-2xl font-medium text-gray-700"
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.01, 1],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  🌟 Envoie tes demandes aux professeurs et suis leurs réponses !
                </motion.p>
              </div>
            </motion.div>

            {/* Bouton Nouvelle Demande - Animations ultra attractives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mb-8"
            >
              <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(236, 72, 153, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(236, 72, 153, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="flex items-center gap-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Plus size={24} />
                </motion.div>
                Nouvelle Demande
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Formulaire Nouvelle Demande - Animations ultra attractives */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="mb-8 rounded-3xl shadow-2xl border-2 bg-white/90 border-blue-200"
              >
                <div className="p-8">
                  <motion.h3 
                    className="text-2xl font-bold mb-6 text-center text-gray-800"
                    animate={{ 
                      scale: [1, 1.02, 1],
                      y: [0, -2, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    📝 Nouvelle Demande
                  </motion.h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Type de demande
                        </label>
                        <select
                          value={form.type}
                          onChange={(e) => setForm({...form, type: e.target.value})}
                          className="w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 bg-white border-gray-300 text-gray-700 text-base font-medium"
                        >
                          <option value="absence">📅 Justification d'absence</option>
                          <option value="rattrapage">📚 Demande de rattrapage</option>
                          <option value="question">❓ Question sur le cours</option>
                          <option value="autre">📝 Autre demande</option>
                        </select>
                      </div>
                      
                      {form.type === "absence" && (
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Date d'absence
                          </label>
                          <input
                            type="date"
                            value={form.dateAbsence}
                            onChange={(e) => setForm({...form, dateAbsence: e.target.value})}
                            className="w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 bg-white border-gray-300 text-gray-700 text-base font-medium"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Sujet
                      </label>
                      <input
                        type="text"
                        value={form.sujet}
                        onChange={(e) => setForm({...form, sujet: e.target.value})}
                        placeholder="Ex: Justification d'absence pour maladie"
                        className="w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 bg-white border-gray-300 text-gray-700 placeholder-gray-500 text-base font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Message détaillé
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                        placeholder="Expliquez votre situation en détail..."
                        rows={4}
                        className="w-full px-6 py-3 rounded-2xl border-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-all duration-300 resize-none bg-white border-gray-300 text-gray-700 placeholder-gray-500 text-base font-medium"
                        required
                      />
                    </div>

                    <div className="flex gap-4 justify-end">
                      <motion.button
                        type="button"
                        onClick={() => setShowForm(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-400 transition-all duration-300"
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -3,
                          rotate: [0, 2, -2, 0],
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={!loading ? {
                          boxShadow: [
                            "0 10px 25px -5px rgba(34, 197, 94, 0.3)",
                            "0 20px 40px -10px rgba(22, 163, 74, 0.4)",
                            "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                          ],
                          scale: [1, 1.02, 1],
                        } : {}}
                        transition={{ 
                          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                          rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 size={20} />
                            </motion.div>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            >
                              <Send size={20} />
                            </motion.div>
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

          {/* Filtres - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
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
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: [0, 2, -2, 0],
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 10px 25px -5px rgba(236, 72, 153, 0.3)",
                    "0 20px 40px -10px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px -5px rgba(236, 72, 153, 0.3)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl text-base ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <filterOption.icon size={20} />
                </motion.div>
                {filterOption.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Liste des demandes - Animations ultra attractives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-6"
          >
            {filteredDemandes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="text-6xl mb-6"
                >
                  📝
                </motion.div>
                <p className="text-xl font-semibold text-gray-600">
                  Aucune demande trouvée
                </p>
                <p className="text-gray-500">
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
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    rotateY: [0, 2, 0],
                  }}
                  className="rounded-3xl shadow-2xl border-2 overflow-hidden bg-white/90 border-blue-200"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-4 bg-purple-100 rounded-2xl"
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 8, 0, -8, 0],
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300,
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {getTypeIcon(demande.type)}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {demande.sujet}
                          </h3>
                          <p className="text-base text-gray-500">
                            Envoyée le {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={`text-base px-4 py-2 rounded-2xl font-bold border-2 ${getStatutColor(demande.statut)}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          animate={{ 
                            scale: [1, 1.02, 1],
                            y: [0, -1, 0],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {getStatutIcon(demande.statut)}
                          {demande.statut}
                        </motion.span>
                        <motion.button
                          onClick={() => handleDelete(demande._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 text-red-500 hover:bg-red-100 rounded-2xl transition-all duration-200"
                          title="Supprimer"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl mb-6 bg-gray-50">
                      <p className="text-base text-gray-700">
                        {demande.message}
                      </p>
                    </div>

                    {demande.reponse && (
                      <div className="p-6 rounded-2xl border-l-4 border-green-500 bg-green-50">
                        <div className="flex items-center gap-3 mb-3">
                          <User size={20} className="text-green-600" />
                          <span className="text-base font-bold text-green-700">
                            Réponse du professeur :
                          </span>
                        </div>
                        <p className="text-base text-green-800">
                          {demande.reponse}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
