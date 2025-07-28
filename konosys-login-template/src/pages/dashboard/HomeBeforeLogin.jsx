import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, FaUsers, FaChartLine, FaLaptop, FaShieldAlt, FaTrophy, 
  FaCloud, FaGlobe, FaCertificate, FaLock, FaAccessibleIcon, FaChevronDown,
  FaRocket, FaStar, FaPlay, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaBrain, FaHeart, FaSmile, FaAward, FaMedal, FaCrown, FaGem, FaEye,
  FaBookOpen, FaGraduationCap as FaGrad, FaSchool, FaUniversity, FaBuilding,
  FaIndustry, FaHospital, FaStore, FaBriefcase, FaUserTie, FaChild, FaBaby,
  FaComments, FaUserFriends, FaHandshake, FaGraduationCap as FaGradCap,
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe as FaWorld,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok,
  FaCookieBite, FaUserGraduate, FaChalkboardTeacher, FaUserTie as FaParent,
  FaMobileAlt, FaTabletAlt, FaDesktop, FaHeadset, FaCog, FaBell,
  FaSearch, FaBookmark, FaShare, FaDownload, FaUpload, FaSync,
  FaBolt, FaMagic, FaPalette, FaCode, FaDatabase, FaServer,
  FaNetworkWired, FaWifi, FaSatellite, FaSatelliteDish, FaBroadcastTower
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HomeBeforeLogin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    domain: '',
    phone: '',
    countryCode: '+33',
    acceptTerms: false
  });

  useEffect(() => {
    setIsVisible(true);
    // Afficher la bannière de cookies après 3 secondes
    const timer = setTimeout(() => {
      setShowCookieBanner(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = '/login';
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const acceptCookies = () => {
    setShowCookieBanner(false);
    // Ici vous pouvez ajouter la logique pour sauvegarder les préférences
  };

  const dropdownItems = {
    products: [
      { name: 'LearnUp LMS', icon: <FaGraduationCap />, description: 'Plateforme complète', color: 'from-blue-500 to-purple-500' },
      { name: 'LearnUp Mobile', icon: <FaLaptop />, description: 'Application mobile', color: 'from-green-500 to-teal-500' },
      { name: 'LearnUp Analytics', icon: <FaChartLine />, description: 'Analyses avancées', color: 'from-orange-500 to-red-500' },
      { name: 'LearnUp Kids', icon: <FaChild />, description: 'Version pour enfants', color: 'from-pink-500 to-purple-500' }
    ],
    platform: [
      { name: 'Fonctionnalités', icon: <FaStar />, description: 'Découvrez nos outils', color: 'from-yellow-500 to-orange-500' },
      { name: 'Intégrations', icon: <FaCloud />, description: 'Connectez vos outils', color: 'from-blue-500 to-cyan-500' },
      { name: 'API', icon: <FaRocket />, description: 'Développez avec nous', color: 'from-purple-500 to-pink-500' },
      { name: 'Gamification', icon: <FaTrophy />, description: 'Apprentissage ludique', color: 'from-amber-500 to-yellow-500' }
    ],
    solutions: [
      { name: 'Éducation', icon: <FaSchool />, description: 'Écoles et universités', color: 'from-blue-500 to-indigo-500' },
      { name: 'Entreprise', icon: <FaBuilding />, description: 'Formation corporate', color: 'from-gray-500 to-blue-500' },
      { name: 'Gouvernement', icon: <FaShieldAlt />, description: 'Secteur public', color: 'from-green-500 to-emerald-500' },
      { name: 'Santé', icon: <FaHospital />, description: 'Secteur médical', color: 'from-red-500 to-pink-500' },
      { name: 'Commerce', icon: <FaStore />, description: 'Formation retail', color: 'from-orange-500 to-red-500' }
    ]
  };

  const organizations = [
    { name: 'Meta', logo: '🔵', color: 'from-blue-500 to-blue-600' },
    { name: 'Pepsico', logo: '🌍', color: 'from-red-500 to-blue-500' },
    { name: 'OpenAI', logo: '🤖', color: 'from-gray-800 to-gray-900' },
    { name: 'PwC', logo: '📊', color: 'from-yellow-500 to-orange-500' },
    { name: 'Roland', logo: '🎹', color: 'from-orange-500 to-red-500' },
    { name: 'ISUZU', logo: '🚗', color: 'from-red-600 to-red-700' },
    { name: 'Oracle', logo: '☁️', color: 'from-red-500 to-orange-500' },
    { name: 'Google', logo: '🔍', color: 'from-blue-500 to-green-500' },
    { name: 'Amazon', logo: '📦', color: 'from-orange-500 to-yellow-500' }
  ];

  const features = [
    {
      icon: <FaBrain className="text-5xl" />,
      title: "Intelligence Artificielle",
      description: "IA avancée pour personnaliser l'apprentissage",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
      emoji: "🧠"
    },
    {
      icon: <FaRocket className="text-5xl" />,
      title: "Performance Exceptionnelle",
      description: "Vitesse et fiabilité de niveau entreprise",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2,
      emoji: "🚀"
    },
    {
      icon: <FaGem className="text-5xl" />,
      title: "Design Premium",
      description: "Interface élégante et intuitive",
      color: "from-emerald-500 to-teal-500",
      delay: 0.3,
      emoji: "💎"
    },
    {
      icon: <FaCrown className="text-5xl" />,
      title: "Excellence Académique",
      description: "Outils pour la réussite éducative",
      color: "from-amber-500 to-orange-500",
      delay: 0.4,
      emoji: "👑"
    }
  ];

  // Avis de parents
  const parentTestimonials = [
    {
      name: "Marie Dubois",
      role: "Maman de Thomas, 8 ans",
      avatar: "👩‍👦",
      rating: 5,
      comment: "LearnUp a transformé l'apprentissage de mon fils ! Il adore les animations et les récompenses. Ses notes ont considérablement augmenté.",
      color: "from-pink-500 to-purple-500"
    },
    {
      name: "Pierre Martin",
      role: "Papa de Sophie, 12 ans",
      avatar: "👨‍👧",
      rating: 5,
      comment: "En tant que parent, j'apprécie le suivi détaillé des progrès. Sophie est plus motivée que jamais pour apprendre !",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Sarah Johnson",
      role: "Maman de Lucas, 10 ans",
      avatar: "👩‍👦",
      rating: 5,
      comment: "L'interface est parfaite pour les enfants. Lucas peut naviguer seul et adore les personnages colorés !",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Ahmed Benali",
      role: "Papa de Aïcha, 9 ans",
      avatar: "👨‍👧",
      rating: 5,
      comment: "LearnUp a rendu l'apprentissage amusant pour ma fille. Elle progresse rapidement et demande même à faire des exercices !",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Nouvelles sections pour rendre la page plus grande
  const funFacts = [
    { number: "1M+", text: "Exercices complétés", icon: "📚", color: "from-blue-500 to-purple-500" },
    { number: "500K+", text: "Enfants satisfaits", icon: "😊", color: "from-green-500 to-teal-500" },
    { number: "50K+", text: "Parents confiants", icon: "👨‍👩‍👧‍👦", color: "from-pink-500 to-red-500" },
    { number: "24/7", text: "Support disponible", icon: "🛟", color: "from-yellow-500 to-orange-500" }
  ];

  const learningActivities = [
    { title: "Mathématiques", icon: "🔢", description: "Apprentissage ludique des chiffres", color: "from-blue-500 to-indigo-500" },
    { title: "Sciences", icon: "🔬", description: "Découverte du monde qui nous entoure", color: "from-green-500 to-emerald-500" },
    { title: "Langues", icon: "🌍", description: "Ouverture sur le monde", color: "from-purple-500 to-pink-500" },
    { title: "Arts", icon: "🎨", description: "Expression créative", color: "from-orange-500 to-red-500" },
    { title: "Histoire", icon: "🏛️", description: "Voyage dans le temps", color: "from-yellow-500 to-amber-500" },
    { title: "Géographie", icon: "🗺️", description: "Exploration du monde", color: "from-teal-500 to-cyan-500" }
  ];

  // Nouvelles sections ajoutées
  const techFeatures = [
    { icon: <FaDatabase />, title: "Base de données avancée", description: "Stockage sécurisé et optimisé", color: "from-indigo-500 to-purple-500" },
    { icon: <FaServer />, title: "Infrastructure cloud", description: "Haute disponibilité garantie", color: "from-blue-500 to-cyan-500" },
    { icon: <FaNetworkWired />, title: "Réseau optimisé", description: "Connexion ultra-rapide", color: "from-green-500 to-emerald-500" },
    { icon: <FaShieldAlt />, title: "Sécurité renforcée", description: "Protection des données", color: "from-red-500 to-pink-500" }
  ];

  const userTypes = [
    { icon: <FaUserGraduate />, title: "Étudiants", description: "Apprentissage personnalisé", color: "from-blue-500 to-indigo-500", count: "50K+" },
    { icon: <FaChalkboardTeacher />, title: "Professeurs", description: "Outils pédagogiques", color: "from-green-500 to-emerald-500", count: "5K+" },
    { icon: <FaParent />, title: "Parents", description: "Suivi des progrès", color: "from-purple-500 to-pink-500", count: "25K+" },
    { icon: <FaUserTie />, title: "Administrateurs", description: "Gestion simplifiée", color: "from-orange-500 to-red-500", count: "1K+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Navigation avec animations */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl border-b border-white/20 fixed top-0 left-0 right-0 z-50 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo LearnUp avec vraie image */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                {/* Logo principal avec vraie image LearnUp */}
                <div className="flex items-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Logo LearnUp stylisé */}
                    <div className="relative z-10">
                      <img 
                        src="/image pfe.png" 
                        alt="LearnUp Logo" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    
                    {/* Effet de brillance */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  
                  {/* Particules animées autour du logo */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg"
                      animate={{
                        x: [0, 25, 0],
                        y: [0, -25, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      style={{
                        left: `${-10 + i * 8}px`,
                        top: `${-10 + i * 6}px`
                      }}
                    />
                  ))}
                </div>
                
                {/* Point lumineux rotatif amélioré */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
                />
              </div>
              
              <div className="ml-4">
                <motion.span 
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  LearnUp
                </motion.span>
                <motion.div 
                  className="text-sm text-gray-500 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  LEARN. GROW. SUCCEED.
                </motion.div>
              </div>
            </motion.div>
            
            {/* Navigation Desktop avec Dropdowns */}
            <div className="hidden lg:flex items-center space-x-8">
              {Object.entries(dropdownItems).map(([key, items]) => (
                <div key={key} className="relative">
                  <motion.button
                    onClick={() => toggleDropdown(key)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="capitalize">{key}</span>
                    <motion.div
                      animate={{ rotate: activeDropdown === key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown className="text-xs" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {activeDropdown === key && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        {items.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group"
                          >
                            <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                              {item.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <motion.a 
                href="#pricing" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Tarifs
              </motion.a>
              <motion.a 
                href="#about" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                À propos
              </motion.a>
            </div>

            {/* Boutons d'action améliorés */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button 
                  onClick={() => setShowSignInModal(true)}
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium border-2 border-gray-300 px-6 py-3 rounded-2xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg"
                >
                  Se connecter
                </button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-xl hover:shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">S'inscrire</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Menu mobile */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Menu mobile animé */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm"
              >
                <div className="flex flex-col space-y-4">
                  {Object.keys(dropdownItems).map(key => (
                    <a key={key} href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  ))}
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">Tarifs</a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">À propos</a>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Link 
                      to="/login" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center block"
                    >
                      Se connecter
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Modal de connexion */}
      <AnimatePresence>
        {showSignInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignInModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowSignInModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <img 
                    src="/image pfe.png" 
                    alt="LearnUp Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion à LearnUp</h2>
                <p className="text-gray-600">Accédez à votre espace d'apprentissage</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ou nom d'utilisateur
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEye /> : <FaEye />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                    Mot de passe oublié ?
                  </a>
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Se connecter
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    S'inscrire
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section avec animations améliorées */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu de gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  L'avenir de
                </span>
                <br />
                <span className="text-gray-900">l'apprentissage</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  commence ici
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Découvrez une plateforme révolutionnaire qui combine intelligence artificielle, 
                design premium et performance exceptionnelle pour transformer l'éducation.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <button 
                    onClick={() => setShowSignInModal(true)}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-3xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl inline-flex items-center group relative overflow-hidden"
                  >
                    <span className="relative z-10">Commencer gratuitement</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-3 relative z-10"
                    >
                      <FaArrowRight />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="border-3 border-blue-600 text-blue-600 px-10 py-5 rounded-3xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-lg inline-flex items-center group hover:shadow-xl">
                    <FaPlay className="mr-3 text-lg" />
                    Voir la démo
                  </button>
                </motion.div>
              </motion.div>

              {/* Stats animées améliorées */}
              <motion.div 
                className="flex space-x-8 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {[
                  { number: "50K+", label: "Étudiants actifs", color: "text-blue-600", emoji: "👨‍🎓" },
                  { number: "98%", label: "Satisfaction", color: "text-purple-600", emoji: "⭐" },
                  { number: "24/7", label: "Support", color: "text-emerald-600", emoji: "🛟" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <motion.div 
                      className={`text-3xl font-bold ${stat.color} mb-2 flex items-center justify-center`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.2, type: "spring", stiffness: 200 }}
                    >
                      <span className="mr-2 text-2xl">{stat.emoji}</span>
                      {stat.number}
                    </motion.div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image et cartes à droite améliorées */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Image principale avec animation améliorée */}
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-96 h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="text-white text-center relative z-10">
                    <motion.div 
                      className="text-8xl mb-6"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🎓
                    </motion.div>
                    <p className="text-2xl font-bold mb-2">LearnUp</p>
                    <p className="text-lg opacity-90">Plateforme d'apprentissage</p>
                  </div>
                  
                  {/* Particules flottantes améliorées */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
                      animate={{
                        x: [0, 150, 0],
                        y: [0, -80, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      style={{
                        left: `${15 + i * 10}%`,
                        top: `${25 + i * 8}%`
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Carte flottante en haut à droite améliorée */}
              <motion.div 
                className="absolute top-0 right-0 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-100"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, rotate: 5, y: -5 }}
              >
                <div className="flex items-center mb-3">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaCheckCircle className="text-white text-sm" />
                  </motion.div>
                  <span className="text-sm font-semibold text-gray-900">Test terminé</span>
                </div>
                <p className="text-sm text-gray-600">Score: <span className="font-bold text-green-600">100%</span></p>
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    >
                      <FaStar className="text-yellow-400 text-xs mr-1" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Carte flottante en bas à gauche améliorée */}
              <motion.div 
                className="absolute bottom-0 left-0 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-100"
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, rotate: -5, y: -5 }}
              >
                <h4 className="text-sm font-semibold mb-3 text-gray-900">Progression du cours</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">72%</span>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaTrophy className="text-amber-500" />
                  </motion.div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 2, delay: 1.5 }}
                  />
                </div>
                <div className="flex space-x-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <FaCheckCircle className="text-green-500 mr-1" />
                    <span>Terminé</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <FaEye className="text-blue-500 mr-1" />
                    <span>Vu</span>
                  </div>
                </div>
              </motion.div>

              {/* Formes décoratives améliorées */}
              <motion.div 
                className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 -z-10"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-20 left-0 w-60 h-60 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-20 -z-10"
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Organisations avec animations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les organisations du monde entier font confiance à l'apprentissage en ligne sur <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LearnUp</span>
            </h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {organizations.map((org, index) => (
              <motion.div
                key={org.name}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${org.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {org.logo}
                </motion.div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {org.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Features avec animations améliorées */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LearnUp</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme qui combine innovation technologique et excellence pédagogique 
              pour offrir une expérience d'apprentissage incomparable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <div className="text-center mb-4">
                    <span className="text-4xl">{feature.emoji}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nouvelle section Technologies */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Technologies <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">avancées</span> ⚡
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une infrastructure moderne et robuste pour garantir performance et fiabilité
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nouvelle section Types d'utilisateurs */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Pour tous les <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">utilisateurs</span> 👥
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme adaptée à chaque type d'utilisateur avec des fonctionnalités personnalisées
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${user.color} rounded-3xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {user.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                    {user.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {user.description}
                  </p>
                  <div className="text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {user.count}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignage avec animations améliorées */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-2xl p-12 border border-gray-100 relative overflow-hidden">
              {/* Formes décoratives améliorées */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-20 translate-x-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full translate-y-16 -translate-x-16"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10">
                <div className="flex items-start">
                  <motion.div 
                    className="w-2 bg-gradient-to-b from-orange-500 to-red-500 mr-8 rounded-full"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                  <div className="flex-1">
                    <motion.p 
                      className="text-2xl text-gray-700 italic mb-8 leading-relaxed"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      "LearnUp a révolutionné notre approche de l'éducation. L'intelligence artificielle 
                      et l'interface intuitive ont transformé l'expérience d'apprentissage de nos étudiants. 
                      <strong className="text-gray-900"> En une semaine, nous avions la plateforme opérationnelle 
                      et développé plus de 50 cours interactifs.</strong>"
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        CB
                      </motion.div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Corin Birchall</p>
                        <p className="text-gray-600">VP Of Global Retail Operations @ Roland</p>
                        <motion.div 
                          className="flex mt-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          viewport={{ once: true }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: 180 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 200 }}
                              viewport={{ once: true }}
                            >
                              <FaStar className="text-yellow-400 text-lg" />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Avis de Parents avec animations */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ce que disent les <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">parents</span> 🥰
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez pourquoi les parents font confiance à LearnUp pour l'éducation de leurs enfants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {parentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="text-4xl mr-4"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: 180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                          viewport={{ once: true }}
                        >
                          <FaStar className="text-yellow-400 text-lg" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Chiffres Amusants */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Des chiffres qui <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">parlent</span> 📊
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LearnUp en quelques chiffres impressionnants
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center group"
              >
                <div className={`w-24 h-24 bg-gradient-to-r ${fact.color} rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                  <span>{fact.icon}</span>
                </div>
                <motion.div 
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  {fact.number}
                </motion.div>
                <p className="text-gray-700 font-medium">{fact.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Activités d'Apprentissage */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Des activités <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">ludiques</span> 🎮
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les matières disponibles pour un apprentissage complet et amusant
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {learningActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center h-full">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${activity.color} rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span>{activity.icon}</span>
                  </motion.div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA Finale */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-bold text-gray-900 mb-8">
              Prêt à <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">commencer</span> ? 🚀
            </h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Rejoignez des milliers de familles qui ont déjà choisi LearnUp pour l'éducation de leurs enfants
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <button 
                  onClick={() => setShowSignInModal(true)}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-12 py-6 rounded-3xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl inline-flex items-center group relative overflow-hidden"
                >
                  <span className="relative z-10">Commencer gratuitement</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-4 relative z-10"
                  >
                    <FaArrowRight className="text-2xl" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.95 }}
              >
                <button className="border-4 border-purple-600 text-purple-600 px-12 py-6 rounded-3xl hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold text-xl inline-flex items-center group hover:shadow-xl">
                  <FaPlay className="mr-4 text-2xl" />
                  Voir la démo
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Amélioré */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center mb-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <img 
                    src="/image pfe.png" 
                    alt="LearnUp Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    LearnUp
                  </h3>
                  <p className="text-sm text-gray-400">L'avenir de l'apprentissage</p>
                </div>
              </motion.div>
              <p className="text-gray-300 mb-6 max-w-md">
                LearnUp révolutionne l'éducation en combinant technologie avancée et pédagogie innovante 
                pour offrir une expérience d'apprentissage exceptionnelle aux enfants du monde entier.
              </p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-400">Liens rapides</h4>
              <ul className="space-y-3">
                {['Accueil', 'À propos', 'Fonctionnalités', 'Tarifs', 'Contact'].map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-400">Contact</h4>
              <div className="space-y-3">
                {[
                  { icon: FaMapMarkerAlt, text: '123 Rue de l\'Éducation, Paris' },
                  { icon: FaPhone, text: '+33 1 23 45 67 89' },
                  { icon: FaEnvelope, text: 'contact@learnup.com' },
                  { icon: FaGlobe, text: 'www.learnup.com' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <item.icon className="mr-3 text-blue-400" />
                    <span className="text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            className="border-t border-gray-700 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">
              © 2024 LearnUp. Tous droits réservés. | 
              <a href="#" className="text-blue-400 hover:text-blue-300 ml-2">Politique de confidentialité</a> | 
              <a href="#" className="text-blue-400 hover:text-blue-300 ml-2">Conditions d'utilisation</a>
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Bannière Cookies avec animations améliorées */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 z-50 shadow-2xl"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaCookieBite className="mr-2 text-blue-400" />
                  </motion.div>
                  Nous respectons votre vie privée
                </h4>
                <p className="text-sm text-gray-300 max-w-2xl">
                  Nous utilisons des cookies pour améliorer votre expérience, personnaliser le contenu 
                  et analyser notre trafic. En cliquant sur "Accepter tout", vous consentez à notre utilisation des cookies.
                </p>
              </div>
              <div className="flex space-x-4">
                <motion.button 
                  className="px-6 py-3 border-2 border-blue-600 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Personnaliser
                </motion.button>
                <motion.button 
                  onClick={acceptCookies}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accepter tout
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeBeforeLogin; 