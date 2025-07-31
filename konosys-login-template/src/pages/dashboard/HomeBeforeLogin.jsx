import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, FaUsers, FaChartLine, FaLaptop, FaShieldAlt, FaTrophy, 
  FaCloud, FaGlobe, FaCertificate, FaLock, FaAccessibleIcon, FaChevronDown,
  FaRocket, FaStar, FaPlay, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaBrain, FaHeart, FaSmile, FaAward, FaMedal, FaCrown, FaGem, FaEye,
  FaBookOpen, FaSchool, FaUniversity, FaBuilding, FaIndustry, FaHospital, 
  FaStore, FaBriefcase, FaUserTie, FaChild, FaBaby, FaComments, FaUserFriends, 
  FaHandshake, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok,
  FaCookieBite, FaUserGraduate, FaChalkboardTeacher, FaMobileAlt, FaTabletAlt, 
  FaDesktop, FaHeadset, FaCog, FaBell, FaSearch, FaBookmark, FaShare, 
  FaDownload, FaUpload, FaSync, FaBolt, FaMagic, FaPalette, FaCode, 
  FaDatabase, FaServer, FaNetworkWired, FaWifi, FaSatellite, FaSatelliteDish, 
  FaBroadcastTower, FaPuzzlePiece, FaGamepad, FaMusic, FaDumbbell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HomeBeforeLogin = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(0);
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
    
    // Animation automatique des éléments
    const animationInterval = setInterval(() => {
      setCurrentAnimation(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(animationInterval);
    };
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

  const handleFormationClick = () => {
    navigate('/parent/formations');
  };

  const acceptCookies = () => {
    setShowCookieBanner(false);
    // Ici vous pouvez ajouter la logique pour sauvegarder les préférencesla part
  };

  const dropdownItems = {
    products: [
      { 
        name: 'Formation Kids', 
        icon: <FaChild />, 
        description: 'Apprentissage ludique pour enfants - Cliquer pour accéder', 
        color: 'from-pink-500 to-purple-500',
        features: [
          '🎓 Formations adaptées au niveau primaire (CP-CE2)',
          '🎮 Apprentissage ludique et amusant',
          '🌟 Vidéos interactives et amusantes',
          '🎯 Exercices pratiques et ludiques',
          '🧩 Quiz d\'évaluation rigolos',
          '💬 Support en ligne avec tes amis',
          '🏆 Badges et récompenses à gagner',
          '📚 Contenu éducatif de qualité'
        ]
      }
    ],
    platform: [],
    solutions: [
      { name: 'Éducation', icon: <FaSchool />, description: 'Écoles et universités', color: 'from-blue-500 to-indigo-500' },
      { name: 'Entreprise', icon: <FaBuilding />, description: 'Formation corporate', color: 'from-gray-500 to-blue-500' },
      { name: 'Gouvernement', icon: <FaShieldAlt />, description: 'Secteur public', color: 'from-green-500 to-emerald-500' },
      { name: 'Santé', icon: <FaHospital />, description: 'Secteur médical', color: 'from-red-500 to-pink-500' },
      { name: 'Commerce', icon: <FaStore />, description: 'Formation retail', color: 'from-orange-500 to-red-500' }
    ]
  };

  const organizations = [
    { name: 'École Maternelle', logo: '🏫', color: 'from-blue-500 to-blue-600' },
    { name: 'École Primaire', logo: '📚', color: 'from-blue-600 to-blue-700' },
    { name: 'Collège', logo: '🎓', color: 'from-blue-700 to-blue-800' },
    { name: 'Lycée', logo: '📖', color: 'from-blue-500 to-blue-600' },
    { name: 'Centre de Loisirs', logo: '🎨', color: 'from-blue-600 to-blue-700' },
    { name: 'Bibliothèque', logo: '📚', color: 'from-blue-700 to-blue-800' },
    { name: 'Musée', logo: '🏛️', color: 'from-blue-500 to-blue-600' },
    { name: 'Parc d\'Attractions', logo: '🎢', color: 'from-blue-600 to-blue-700' },
    { name: 'Zoo', logo: '🦁', color: 'from-blue-700 to-blue-800' }
  ];

  const features = [
    {
      icon: <FaPuzzlePiece className="text-5xl" />,
      title: "Jeux Éducatifs",
      description: "Apprendre en s'amusant avec des puzzles et des jeux interactifs",
      color: "from-blue-500 to-blue-600",
      delay: 0.1,
      emoji: "🧩"
    },
    {
      icon: <FaGamepad className="text-5xl" />,
      title: "Activités Ludiques",
      description: "Des exercices amusants pour progresser en s'amusant",
      color: "from-blue-600 to-blue-700",
      delay: 0.2,
      emoji: "🎮"
    },
    {
      icon: <FaPalette className="text-5xl" />,
      title: "Créativité",
      description: "Développer son imagination avec l'art et la musique",
      color: "from-blue-700 to-blue-800",
      delay: 0.3,
      emoji: "🎨"
    },
    {
      icon: <FaTrophy className="text-5xl" />,
      title: "Récompenses",
      description: "Gagner des badges et des étoiles pour ses efforts",
      color: "from-blue-500 to-blue-600",
      delay: 0.4,
      emoji: "🏆"
    }
  ];

  // Avis d'enfants et parents
  const parentTestimonials = [
    {
      name: "Thomas, 8 ans",
      role: "Élève de CE2",
      avatar: "👦",
      rating: 5,
      comment: "J'adore les jeux de mathématiques ! C'est comme jouer à un jeu vidéo mais j'apprends en même temps !",
      color: "from-pink-500 to-purple-500"
    },
    {
      name: "Sophie, 10 ans",
      role: "Élève de CM1",
      avatar: "👧",
      rating: 5,
      comment: "Les badges et les étoiles me motivent beaucoup ! J'ai déjà gagné 15 badges !",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Lucas, 9 ans",
      role: "Élève de CE2",
      avatar: "👦",
      rating: 5,
      comment: "Les couleurs sont trop belles ! J'aime bien les personnages qui m'encouragent !",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Aïcha, 7 ans",
      role: "Élève de CP",
      avatar: "👧",
      rating: 5,
      comment: "Maman dit que j'ai fait beaucoup de progrès ! J'aime bien les histoires et les chansons !",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Chiffres amusants pour les enfants
  const funFacts = [
    { number: "1000+", text: "Jeux éducatifs", icon: "🎮", color: "from-blue-500 to-red-500" },
    { number: "500+", text: "Enfants heureux", icon: "😊", color: "from-red-500 to-yellow-500" },
    { number: "50+", text: "Badges à gagner", icon: "🏆", color: "from-yellow-500 to-green-500" },
    { number: "24/7", text: "Disponible tout le temps", icon: "⭐", color: "from-green-500 to-blue-500" }
  ];

  const learningActivities = [
    { title: "Mathématiques", icon: "🔢", description: "Compter et calculer en s'amusant", color: "from-blue-500 to-red-500" },
    { title: "Sciences", icon: "🔬", description: "Découvrir les animaux et les plantes", color: "from-red-500 to-yellow-500" },
    { title: "Lecture", icon: "📚", description: "Lire des histoires amusantes", color: "from-yellow-500 to-green-500" },
    { title: "Arts", icon: "🎨", description: "Dessiner et peindre", color: "from-green-500 to-blue-500" },
    { title: "Musique", icon: "🎵", description: "Chanter et jouer de la musique", color: "from-blue-500 to-red-500" },
    { title: "Sport", icon: "⚽", description: "Bouger et faire du sport", color: "from-red-500 to-yellow-500" }
  ];

  // Fonctionnalités amusantes pour les enfants
  const techFeatures = [
    { icon: <FaPuzzlePiece />, title: "Puzzles interactifs", description: "Jeux de logique amusants", color: "from-blue-500 to-blue-600" },
    { icon: <FaGamepad />, title: "Jeux éducatifs", description: "Apprendre en s'amusant", color: "from-blue-600 to-blue-700" },
    { icon: <FaPalette />, title: "Activités créatives", description: "Dessiner et créer", color: "from-blue-700 to-blue-800" },
    { icon: <FaTrophy />, title: "Système de récompenses", description: "Badges et étoiles à gagner", color: "from-blue-500 to-blue-600" }
  ];

  const userTypes = [
    { icon: <FaChild />, title: "Enfants", description: "Jeux et activités amusantes", color: "from-blue-500 to-blue-600", count: "500+" },
    { icon: <FaHeart />, title: "Enfants Spéciaux", description: "Autisme, TDAH, Dyslexie - Apprentissage adapté", color: "from-purple-500 to-pink-500", count: "100+" },
    { icon: <FaChalkboardTeacher />, title: "Professeurs", description: "Outils pédagogiques", color: "from-blue-600 to-blue-700", count: "50+" },
    { icon: <FaUserTie />, title: "Parents", description: "Suivi des progrès", color: "from-blue-700 to-blue-800", count: "250+" },
    { icon: <FaSchool />, title: "Écoles", description: "Gestion simplifiée", color: "from-blue-500 to-blue-600", count: "25+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-x-hidden relative">
      {/* Background simplifié */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Formes simples */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Formes ondulées simplifiées */}
          <svg viewBox="0 0 1200 800" className="w-full h-full absolute">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            
            {/* Une seule forme ondulée */}
            <path
              d="M0,500 Q400,400 800,500 T1200,500 L1200,800 L0,800 Z"
              fill="url(#wave1)"
              opacity="0.3"
            />
          </svg>
        </motion.div>
        
        {/* Quelques bulles simples */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-300 opacity-40"
            style={{
              width: `${15 + Math.random() * 10}px`,
              height: `${15 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Quelques étoiles simples */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-2xl text-blue-200"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
      {/* Navigation avec animations optimisées */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-lg border-b border-blue-200/50 fixed top-0 left-0 right-0 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo LearnUp avec décorations */}
            <motion.div 
              className="flex items-center relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Décorations flottantes */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-50"
              />
              <motion.div
                animate={{ 
                  y: [-2, 2, -2],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-40"
              />
              
              <div className="relative">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                  whileHover={{ rotate: 3, scale: 1.03 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Logo LearnUp stylisé */}
                  <div className="relative z-10">
                    <img 
                      src="/image pfe.png" 
                      alt="LearnUp Logo" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  
                  {/* Effet de brillance optimisé */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                {/* Particules animées réduites */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                    style={{
                      left: `${-3 + i * 4}px`,
                      top: `${-3 + i * 3}px`
                    }}
                  />
                ))}
              </div>
              
              <div className="ml-4">
                <motion.span 
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  LearnUp Kids
                </motion.span>
                <motion.div 
                  className="text-[10px] sm:text-xs text-gray-400 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  APPRENDRE. JOUER. GRANDIR.
                </motion.div>
              </div>
            </motion.div>
            
            {/* Navigation Desktop - Se connecter */}
            <div className="hidden lg:flex items-center">
              <motion.button
                onClick={() => window.location.href = '/login'}
                className="relative flex items-center space-x-3 text-white font-bold py-3 px-8 rounded-xl text-base overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl border border-blue-300/30"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Fond avec gradient simplifié */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
                />
                
                {/* Effet de brillance au survol */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                
                {/* Icône avec effet de lueur */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <FaUserGraduate className="w-5 h-5 drop-shadow-lg" />
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full blur-sm"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Texte avec effet de lueur */}
                <motion.span 
                  className="relative z-10 font-bold tracking-wide drop-shadow-sm"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  Se connecter
                </motion.span>
                
                {/* Particules subtiles */}
                <motion.div
                  className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white/80 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Bordure avec effet de lueur */}
                <motion.div
                  className="absolute inset-0 rounded-xl border border-white/40"
                  animate={{ 
                    borderColor: ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.4)"]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>
            </div>

            {/* Bouton menu mobile */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#EBF8FF" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 relative overflow-hidden"
            >
              {/* Effet de brillance */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
              
              {/* Icône hamburger animée */}
              <motion.div
                animate={{ 
                  rotate: isMenuOpen ? 90 : 0,
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="relative z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.div>
              
              {/* Particules flottantes */}
              <motion.div
                className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Menu mobile optimisé */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden bg-white border-t border-blue-200"
            >
              <div className="px-4 py-6 space-y-4">
                <motion.button
                  onClick={() => window.location.href = '/login'}
                  className="relative flex items-center justify-center w-full px-5 py-3 text-center text-white font-bold rounded-xl transition-all duration-200 overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg border border-blue-300/30"
                  whileHover={{ 
                    scale: 1.03,
                    y: -1,
                    boxShadow: "0 15px 20px -5px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* Fond avec gradient simplifié */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                  
                  {/* Effet de brillance au survol */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  
                  {/* Icône avec effet de lueur */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center mr-2"
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 3
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <FaUserGraduate className="w-4 h-4 drop-shadow-sm" />
                      <motion.div
                        className="absolute inset-0 bg-white/15 rounded-full blur-sm"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Texte avec effet de lueur */}
                  <motion.span 
                    className="relative z-10 font-bold tracking-wide drop-shadow-sm"
                    whileHover={{ x: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Se connecter
                  </motion.span>
                  
                  {/* Particules subtiles */}
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-white/70 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Bordure avec effet de lueur */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border border-white/30"
                    animate={{ 
                      borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.3)"]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <img 
                    src="/image pfe.png" 
                    alt="LearnUp Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion à LearnUp Kids</h2>
                <p className="text-gray-600">Accédez à votre espace de jeux et d'apprentissage</p>
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
                  className="w-full bg-gradient-to-r from-blue-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
                    S'inscrire
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section simplifiée */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* Formes décoratives simples */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Quelques formes simples */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2 }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <linearGradient id="organic1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <path
                d="M50,200 Q100,150 150,200 T250,200 Q300,250 350,200 L350,400 L50,400 Z"
                fill="url(#organic1)"
                opacity="0.3"
              />
            </svg>
          </motion.div>
          
          {/* Quelques émojis simples */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`emoji-${i}`}
              className="absolute text-blue-200 text-3xl opacity-60"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + i * 10}%`
              }}
            >
              {i % 2 === 0 ? '⭐' : '✨'}
            </motion.div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu de gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="text-white">
                  Apprendre en
                </span>
                <br />
                <span className="text-white font-bold">
                  s'amusant !
                </span>
                <br />
                <div className="flex space-x-4 text-5xl mt-4">
                  <span>🎮</span>
                  <span>🎨</span>
                  <span>🧩</span>
                  <span>🌟</span>
                </div>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/90 mb-10 leading-relaxed drop-shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Bienvenue sur LearnUp Kids ! 🎉 Une plateforme amusante et colorée pour apprendre 
                les mathématiques, les sciences, les langues et bien plus encore avec des jeux et des animations ! ✨
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-3xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl inline-flex items-center group relative overflow-hidden min-h-[60px] min-w-[200px] focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="Commencer à apprendre gratuitement"
                  >
                    <span className="relative z-10">📚 Commencer à apprendre !</span>
                    <FaArrowRight className="ml-3" />
                  </button>
                </motion.div>
                
                {/* Animation sympa à la place du bouton */}
                <motion.div 
                  className="flex items-center justify-center"
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-3xl shadow-lg inline-flex items-center group">
                    <motion.div
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="mr-3 text-2xl"
                    >
                      🎨
                    </motion.div>
                    <span className="font-bold text-lg">Super amusant !</span>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="ml-3 text-xl"
                    >
                      😊
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Stats amusantes pour les enfants */}
              <motion.div 
                className="flex space-x-8 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {[
                  { number: "500+", label: "Enfants qui jouent", emoji: "👦👧" },
                  { number: "100%", label: "Amusement garanti", emoji: "😊" },
                  { number: "24/7", label: "Toujours ouvert", emoji: "🌟" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                      <span className="mr-2 text-2xl">{stat.emoji}</span>
                      <span>{stat.number}</span>
                    </div>
                    <p className="text-white font-medium">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image et cartes à droite simplifiées */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Image principale simplifiée */}
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-96 h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  
                  <div className="text-white text-center relative z-10">
                    <div className="text-8xl mb-6">
                      🎮
                    </div>
                    <p className="text-2xl font-bold mb-2">
                      LearnUp Kids
                    </p>
                    <p className="text-lg opacity-90">
                      Plateforme de jeux éducatifs
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Carte flottante en haut à droite simplifiée */}
              <motion.div 
                className="absolute top-0 right-0 bg-white p-6 rounded-2xl shadow-lg z-20 border border-blue-200"
                initial={{ opacity: 0, scale: 0, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-3 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">Jeu terminé !</span>
                    <div className="text-xs text-blue-600 font-medium">
                      Excellent travail !
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-700 mb-3">
                    Score: <span className="font-bold text-blue-600 text-lg">100%</span>
                  </p>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-full"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm mr-1" />
                      ))}
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">
                      +50 pts
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Carte flottante en bas à gauche simplifiée */}
              <motion.div 
                className="absolute bottom-0 left-0 bg-white p-6 rounded-2xl shadow-lg z-20 border border-blue-200"
                initial={{ opacity: 0, scale: 0, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900">Progression du jeu</h4>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">72%</span>
                    <span className="text-2xl">🏆</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full w-3/4"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-gray-700">
                        <span className="mr-1 text-green-500">✅</span>
                        <span>Terminé</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-700">
                        <span className="mr-1 text-blue-500">👀</span>
                        <span>Vu</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                      +25 pts
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quelques formes décoratives simples */}
              <motion.div 
                className="absolute top-20 right-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-30 -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-20 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-30 -z-10"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Organisations avec animations améliorées */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-24 h-24 bg-blue-200/30 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 right-20 w-20 h-20 bg-blue-300/20 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1], rotate: [360, 180, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/25 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 360, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-12 h-12 bg-blue-200/40 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2], y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              Des milliers d'écoles et de familles font confiance à <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LearnUp Kids</span> 🏫
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
              Rejoignez notre communauté d'éducateurs passionnés et de familles engagées
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4 sm:gap-6 md:gap-8 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {organizations.map((org, index) => (
              <motion.div
                key={org.name}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, scale: 0, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 150 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -8, rotate: 5 }}
              >
                <motion.div
                  className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                  }}
                  animate={{ 
                    boxShadow: [
                      "0 5px 15px -3px rgba(59, 130, 246, 0.2)",
                      "0 15px 30px -5px rgba(59, 130, 246, 0.25)",
                      "0 5px 15px -3px rgba(59, 130, 246, 0.2)"
                    ]
                  }}
                  transition={{ 
                    duration: 0.6,
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  {/* Fond blanc avec bordure bleue */}
                  <div className="absolute inset-1 sm:inset-2 bg-white rounded-lg sm:rounded-xl border border-blue-200" />
                  <div className="absolute inset-2 sm:inset-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md sm:rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg sm:text-2xl">{org.logo}</span>
                  </div>
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Particules flottantes */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity }
                    }}
                  >
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white/50 rounded-full" />
                    <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-white/30 rounded-full" />
                    <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/40 rounded-full" />
                  </motion.div>
                  <span className="relative z-10"></span>
                </motion.div>
                <motion.p 
                  className="text-[8px] sm:text-[10px] font-semibold text-gray-600 group-hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    color: ["#4B5563", "#3B82F6", "#4B5563"]
                  }}
                  transition={{ 
                    color: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                  }}
                >
                  {org.name}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Features avec animations améliorées */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Pourquoi <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LearnUp Kids</span> ? 🎮
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
              Une plateforme amusante et colorée qui transforme l'apprentissage en jeu ! 
              Apprendre n'a jamais été aussi amusant !
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  {/* Effet de brillance */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <motion.div 
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl sm:rounded-3xl flex items-center justify-center text-white mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 relative z-10`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <div className="text-center mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">{feature.emoji}</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nouvelle section Technologies */}
      <section className="py-20 bg-gradient-to-br from-blue-100 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Des jeux <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">super amusants</span> ⚡
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme moderne et sécurisée pour garantir des jeux amusants et éducatifs
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
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Pour tous les <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">amis</span> 👥
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme adaptée à chaque utilisateur avec des fonctionnalités amusantes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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

      {/* Nouvelle section Enfants Spéciaux */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Apprentissage Adapté</span> 💙
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils spécialement conçus pour les enfants avec des besoins particuliers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "Autisme",
                description: "Interface simplifiée, routines visuelles, communication non-verbale",
                features: ["Pictogrammes", "Séquences visuelles", "Calendrier structuré"]
              },
              {
                icon: "⚡",
                title: "TDAH",
                description: "Activités courtes, récompenses immédiates, concentration guidée",
                features: ["Minis-jeux", "Badges instantanés", "Timer visuel"]
              },
              {
                icon: "📚",
                title: "Dyslexie",
                description: "Police adaptée, audio intégré, exercices phonétiques",
                features: ["Police OpenDyslexic", "Synthèse vocale", "Jeux phonétiques"]
              }
            ].map((special, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group cursor-pointer"
              >
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {special.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                    {special.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {special.description}
                  </p>
                  
                  <div className="space-y-2">
                    {special.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center text-sm text-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </motion.div>
                    ))}
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
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-12 border border-blue-100 relative overflow-hidden">
              {/* Formes décoratives améliorées */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-20 translate-x-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full translate-y-16 -translate-x-16"
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
                      "LearnUp Kids a révolutionné notre approche de l'éducation. Les jeux amusants 
                      et l'interface colorée ont transformé l'expérience d'apprentissage de nos enfants. 
                      <strong className="text-gray-900"> En une semaine, nous avions la plateforme opérationnelle 
                      et développé plus de 50 jeux éducatifs.</strong>"
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        👩‍🏫
                      </motion.div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Marie Dubois</p>
                        <p className="text-gray-600">Directrice d'école primaire @ École des Petits Génies</p>
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ce que disent les <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">enfants</span> 😊
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que pensent les enfants de LearnUp Kids !
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
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent"
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
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Des chiffres <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">amusants</span> 🎯
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              LearnUp Kids en quelques chiffres rigolos !
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
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2"
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Des activités <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">super amusantes</span> 🎮
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez toutes les matières disponibles pour apprendre en s'amusant !
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

      {/* Section Améliorations Étudiants */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Nouvelles Fonctionnalités</span> 🚀
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les améliorations pour une meilleure expérience d'apprentissage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Objectifs Personnalisés",
                description: "Définissez vos propres objectifs d'apprentissage et suivez vos progrès",
                features: ["Objectifs quotidiens", "Suivi des progrès", "Récompenses personnalisées"]
              },
              {
                icon: "🤖",
                title: "Assistant IA Avancé",
                description: "Un assistant intelligent qui s'adapte à votre niveau et style d'apprentissage",
                features: ["Explications personnalisées", "Suggestions adaptées", "Aide contextuelle"]
              },
              {
                icon: "📊",
                title: "Analytics Détaillés",
                description: "Visualisez vos performances avec des graphiques et statistiques avancées",
                features: ["Graphiques interactifs", "Statistiques détaillées", "Rapports hebdomadaires"]
              },
              {
                icon: "🎮",
                title: "Mode Compétition",
                description: "Affrontez vos amis dans des défis éducatifs amusants",
                features: ["Classements", "Défis quotidiens", "Badges de compétition"]
              },
              {
                icon: "📱",
                title: "Application Mobile",
                description: "Accédez à vos cours depuis votre smartphone ou tablette",
                features: ["Synchronisation cloud", "Mode hors ligne", "Notifications push"]
              },
              {
                icon: "🎨",
                title: "Personnalisation Avancée",
                description: "Personnalisez votre interface selon vos préférences",
                features: ["Thèmes personnalisés", "Avatars personnalisés", "Interface adaptative"]
              }
            ].map((feature, index) => (
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
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center text-sm text-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feat}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA Finale */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-bold text-gray-900 mb-8">
              Prêt à <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">apprendre</span> ? 🚀
            </h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Rejoignez des centaines d'enfants qui s'amusent déjà avec LearnUp Kids !
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-6 rounded-3xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl inline-flex items-center group relative overflow-hidden min-h-[80px] min-w-[250px] focus:outline-none focus:ring-4 focus:ring-blue-300"
                    aria-label="Commencer à apprendre gratuitement"
                  >
                    <span className="relative z-10">📚 Commencer à apprendre !</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-4 relative z-10"
                    >
                      <FaArrowRight className="text-2xl" />
                    </motion.div>
                  </button>
                </motion.div>
                
                {/* Animation sympa à la place du bouton démo */}
                <motion.div 
                  className="flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-6 rounded-3xl shadow-xl inline-flex items-center group">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.15, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="mr-4 text-3xl"
                    >
                      🌟
                    </motion.div>
                    <span className="font-bold text-xl">Apprendre en s'amusant</span>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.4, 1],
                        rotate: [0, 15, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="ml-4 text-2xl"
                    >
                      🎮
                    </motion.div>
                  </div>
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Amélioré */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center mr-4">
                  <img 
                    src="/image pfe.png" 
                    alt="LearnUp Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    LearnUp Kids
                  </h3>
                  <p className="text-sm text-gray-400">L'avenir de l'apprentissage amusant</p>
                </div>
              </motion.div>
              <p className="text-gray-300 mb-6 max-w-md">
                LearnUp Kids révolutionne l'apprentissage en combinant jeux amusants et pédagogie innovante 
                pour offrir une expérience d'apprentissage exceptionnelle aux enfants du monde entier.
              </p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
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
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 z-50 shadow-2xl"
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
                  className="px-6 py-3 border-2 border-blue-500 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Personnaliser
                </motion.button>
                <motion.button 
                  onClick={acceptCookies}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
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