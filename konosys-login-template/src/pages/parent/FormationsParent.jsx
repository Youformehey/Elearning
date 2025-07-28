import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  GraduationCap,
  CreditCard,
  Clock,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Star,
  User,
  DollarSign,
  BookOpen,
  Users,
  Gift,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Award,
  BookMarked,
  PlayCircle,
  Brain,
  Code,
  Palette,
  Music,
  Calculator,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

// Mapping des icônes
const iconMapping = {
  Brain,
  Code,
  BookOpen,
  Palette,
  Music,
  Calculator,
  Globe,
  BookMarked: BookOpen
};

const FormationsParent = () => {
  const [formations, setFormations] = useState([]);
  const [formationsAchetees, setFormationsAchetees] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('disponibles'); // 'disponibles' ou 'achetees'
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { name: "Parent" };

  // Fetch les vraies données
  const fetchData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      
      // Récupérer les formations disponibles
      const formationsResponse = await axios.get("/api/parents/formations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormations(formationsResponse.data);
      
      // Récupérer les formations achetées
      const formationsAcheteesResponse = await axios.get("/api/parents/formations/achetees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormationsAchetees(formationsAcheteesResponse.data);
      
      // Récupérer les enfants du parent
      const parentResponse = await axios.get("/api/parents/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildren(parentResponse.data.children || []);
      
    } catch (err) {
      console.error("Erreur récupération données:", err);
      setError("Impossible de charger les données. Vérifiez votre connexion.");
      setFormations([]);
      setFormationsAchetees([]);
      setChildren([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePayment = async (formation) => {
    setSelectedFormation(formation);
    setSelectedChildren([]);
    setCardDetails({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      cardholderName: ''
    });
    setCardErrors({});
    setShowPaymentModal(true);
    setShowConfirmation(false);
  };

  const validateCardDetails = () => {
    const errors = {};
    
    if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 13) {
      errors.cardNumber = 'Numéro de carte invalide';
    }
    
    if (!cardDetails.expiryMonth || parseInt(cardDetails.expiryMonth) < 1 || parseInt(cardDetails.expiryMonth) > 12) {
      errors.expiryMonth = 'Mois invalide';
    }
    
    if (!cardDetails.expiryYear || parseInt(cardDetails.expiryYear) < new Date().getFullYear()) {
      errors.expiryYear = 'Année invalide';
    }
    
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.cvc = 'CVC invalide';
    }
    
    if (!cardDetails.cardholderName || cardDetails.cardholderName.length < 2) {
      errors.cardholderName = 'Nom du titulaire requis';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processPayment = async () => {
    if (selectedChildren.length === 0) {
      alert("Veuillez sélectionner au moins un enfant pour cette formation.");
      return;
    }

    if (!validateCardDetails()) {
      return;
    }

    try {
      setPaymentLoading(true);
      const token = localStorage.getItem("token");
      
      // Créer la session de paiement avec les détails de carte
      const response = await axios.post("/api/parents/formations/create-payment", {
        formationId: selectedFormation._id,
        childrenIds: selectedChildren,
        amount: selectedFormation.prix * selectedChildren.length,
        cardDetails: cardDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Gérer la réponse
      if (response.data.success) {
        setConfirmationData(response.data);
        setShowConfirmation(true);
        // Rafraîchir les données après un délai
        setTimeout(() => {
          fetchData();
        }, 3000);
      }
      
    } catch (err) {
      console.error("Erreur paiement:", err);
      const errorMessage = err.response?.data?.message || "Erreur lors du paiement. Veuillez réessayer.";
      alert(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const toggleChildSelection = (childId) => {
    setSelectedChildren(prev => 
      prev.includes(childId) 
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

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
            Chargement des formations...
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
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              <span>Formations pour vos enfants</span>
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base md:text-lg">
              Achetez des formations et donnez accès à vos {children.length} enfant(s) ✨
            </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
        </motion.button>
      </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Formations disponibles</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{formations.length}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl">
              <BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Formations achetées</p>
              <p className="text-3xl font-bold text-emerald-600">{formationsAchetees.length}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enfants</p>
              <p className="text-3xl font-bold text-purple-600">{children.length}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('disponibles')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'disponibles'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookMarked size={20} />
            Formations disponibles ({formations.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('achetees')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'achetees'
              ? 'bg-white text-emerald-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Mes achats ({formationsAchetees.length})
          </div>
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'disponibles' ? (
        /* Formations disponibles */
        formations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Toutes les formations achetées !</h3>
            <p className="text-gray-600">Vous avez acheté toutes les formations disponibles. Vos enfants peuvent y accéder dans leur espace étudiant.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formations.map((formation, index) => {
              const IconComponent = iconMapping[formation.icon] || GraduationCap;
              return (
            <motion.div
              key={formation._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* En-tête formation avec gradient */}
                  <div className={`bg-gradient-to-r ${formation.couleur || 'from-blue-500 to-indigo-600'} p-6 text-white relative overflow-hidden`}>
                    <motion.div
                      className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                        <Zap size={12} className="inline mr-1" />
                        Disponible
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{formation.titre}</h3>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formation.duree}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {formation.niveau}
                </div>
                </div>
              </div>

                  {/* Contenu de la formation */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {formation.description}
                    </p>

              {/* Détails formation */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target size={16} />
                        <span>Niveau: {formation.niveau}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen size={16} />
                        <span>Matière: {formation.matiere}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={16} />
                        <span>Accès: Illimité</span>
                </div>
              </div>

              {/* Prix et statut */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                    {formation.prix || 0} €
                  </span>
                        <span className="text-sm text-gray-500">/enfant</span>
                </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold">
                        <Zap size={12} className="inline mr-1" />
                        Disponible
                </div>
              </div>

              {/* Bouton paiement */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment(formation)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <CreditCard size={16} />
                      Acheter pour mes enfants
                </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        /* Formations achetées */
        formationsAchetees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <BookMarked size={48} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune formation achetée</h3>
            <p className="text-gray-600">Vous n'avez pas encore acheté de formations. Consultez l'onglet "Formations disponibles" pour commencer.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formationsAchetees.map((formation, index) => {
              const IconComponent = iconMapping[formation.icon] || GraduationCap;
              return (
                <motion.div
                  key={formation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-emerald-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* En-tête formation avec gradient */}
                  <div className={`bg-gradient-to-r ${formation.couleur || 'from-emerald-500 to-green-600'} p-6 text-white relative overflow-hidden`}>
                    <motion.div
                      className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8" />
                      <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                        <CheckCircle size={12} className="inline mr-1" />
                        Achetée
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{formation.titre}</h3>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formation.duree}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {formation.niveau}
                      </div>
                    </div>
                  </div>

                  {/* Contenu de la formation */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {formation.description}
                    </p>

                    {/* Date d'achat */}
                    {formation.dateAchat && (
                      <div className="mb-4 p-3 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                          <Calendar className="w-4 h-4" />
                          <span>Achetée le {new Date(formation.dateAchat).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {formation.codeConfirmation && (
                          <div className="flex items-center gap-2 text-sm text-emerald-700 mt-1">
                            <Shield className="w-4 h-4" />
                            <span>Code: {formation.codeConfirmation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Enfants qui ont accès */}
                    {formation.enfants && formation.enfants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Accès pour :</p>
                        <div className="space-y-1">
                          {formation.enfants.map((enfant, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} />
                              <span>{enfant.name} ({enfant.classe})</span>
                            </div>
                          ))}
                        </div>
                </div>
              )}

                    {/* Prix payé */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign size={20} className="text-emerald-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {formation.montant || formation.prix || 0} €
                        </span>
                        <span className="text-sm text-gray-500">payé</span>
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-xs font-semibold">
                        <CheckCircle size={12} className="inline mr-1" />
                        Achetée
                      </div>
                    </div>

                    {/* Bouton d'information */}
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                      <CheckCircle size={16} />
                      Formation accessible aux enfants
                    </div>
                  </div>
            </motion.div>
              );
            })}
        </div>
        )
      )}

      {/* Modal de paiement */}
      <AnimatePresence>
        {showPaymentModal && selectedFormation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showConfirmation ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <CreditCard size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                Paiement - {selectedFormation.titre}
              </h3>
                      <p className="text-gray-600">Sélectionnez vos enfants et entrez vos informations de paiement</p>
                    </div>
                  </div>
                  
                  {/* Détails de la formation */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookMarked size={16} />
                      Détails de la formation
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Prix par enfant:</span>
                        <span className="font-semibold text-gray-900 ml-2">{selectedFormation.prix || 0} €</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Durée:</span>
                        <span className="font-semibold text-gray-900 ml-2">{selectedFormation.duree || 'Non spécifiée'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Niveau:</span>
                        <span className="font-semibold text-gray-900 ml-2">{selectedFormation.niveau || 'Tous niveaux'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Matière:</span>
                        <span className="font-semibold text-gray-900 ml-2">{selectedFormation.matiere || 'Général'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sélection des enfants */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users size={16} />
                      Sélectionnez vos enfants ({children.length} disponible{children.length > 1 ? 's' : ''})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {children.map((child) => (
                        <motion.div
                          key={child._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleChildSelection(child._id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedChildren.includes(child._id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedChildren.includes(child._id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {selectedChildren.includes(child._id) ? (
                                <CheckCircle size={16} />
                              ) : (
                                <User size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{child.name}</p>
                              <p className="text-sm text-gray-600">{child.classe}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
              </div>

                  {/* Formulaire de paiement Stripe */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard size={16} />
                      Informations de paiement
                    </h4>
                    <div className="space-y-4">
                      {/* Numéro de carte */}
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                        <div className="relative">
                  <input
                    type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              cardNumber: formatCardNumber(e.target.value)
                            }))}
                    placeholder="1234 5678 9012 3456"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                              cardErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength={19}
                            style={{ color: '#1f2937' }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CreditCard size={20} className="text-gray-400" />
                          </div>
                        </div>
                        {cardErrors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">{cardErrors.cardNumber}</p>
                        )}
                      </div>

                      {/* Nom du titulaire */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du titulaire
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardholderName}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            cardholderName: e.target.value
                          }))}
                          placeholder="Jean Dupont"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                            cardErrors.cardholderName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          style={{ color: '#1f2937' }}
                        />
                        {cardErrors.cardholderName && (
                          <p className="text-red-500 text-sm mt-1">{cardErrors.cardholderName}</p>
                        )}
                </div>

                      {/* Date d'expiration et CVC */}
                      <div className="grid grid-cols-3 gap-4">
                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mois
                    </label>
                    <input
                      type="text"
                            value={cardDetails.expiryMonth}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2)
                            }))}
                            placeholder="12"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                              cardErrors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength={2}
                            style={{ color: '#1f2937' }}
                          />
                          {cardErrors.expiryMonth && (
                            <p className="text-red-500 text-sm mt-1">{cardErrors.expiryMonth}</p>
                          )}
                  </div>
                  <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Année
                    </label>
                    <input
                      type="text"
                            value={cardDetails.expiryYear}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            placeholder="2025"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                              cardErrors.expiryYear ? 'border-red-500' : 'border-gray-300'
                            }`}
                            maxLength={4}
                            style={{ color: '#1f2937' }}
                          />
                          {cardErrors.expiryYear && (
                            <p className="text-red-500 text-sm mt-1">{cardErrors.expiryYear}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                          </label>
                          <div className="relative">
                            <input
                              type={showCardDetails ? "text" : "password"}
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails(prev => ({
                                ...prev,
                                cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                              }))}
                      placeholder="123"
                              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                                cardErrors.cvc ? 'border-red-500' : 'border-gray-300'
                              }`}
                              maxLength={4}
                              style={{ color: '#1f2937' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCardDetails(!showCardDetails)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showCardDetails ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                            </button>
                          </div>
                          {cardErrors.cvc && (
                            <p className="text-red-500 text-sm mt-1">{cardErrors.cvc}</p>
                          )}
                        </div>
                  </div>
                </div>
              </div>

                  {/* Résumé du paiement */}
                  {selectedChildren.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign size={16} />
                        Résumé du paiement
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prix par enfant:</span>
                          <span className="font-semibold">{selectedFormation.prix || 0} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre d'enfants:</span>
                          <span className="font-semibold">{selectedChildren.length}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-bold text-gray-900">Total:</span>
                          <span className="font-bold text-2xl text-green-600">
                            {(selectedFormation.prix || 0) * selectedChildren.length} €
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Boutons d'action */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                      onClick={processPayment}
                      disabled={selectedChildren.length === 0 || paymentLoading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {paymentLoading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} />
                          Payer avec Stripe
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Confirmation de paiement */
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} className="text-green-600" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Paiement réussi ! 🎉
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Formation:</span>
                        <span className="font-semibold">{confirmationData.formation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enfants:</span>
                        <span className="font-semibold">{confirmationData.enfants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant:</span>
                        <span className="font-semibold">{confirmationData.montant} €</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Code de confirmation:</span>
                          <span className="font-mono font-bold text-lg text-blue-600 bg-blue-50 px-3 py-1 rounded">
                            {confirmationData.confirmationCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Vos enfants peuvent maintenant accéder à cette formation dans leur espace étudiant !
                  </p>
                  
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setShowConfirmation(false);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    Parfait !
                </button>
              </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormationsParent; 