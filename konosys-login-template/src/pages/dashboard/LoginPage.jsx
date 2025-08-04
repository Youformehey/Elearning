// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, UsersRound, BookUser, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Zap, Star, Trophy, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../index.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('enfant');
  const [childType, setChildType] = useState('typique');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [classes, setClasses] = useState([]);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState(null);

  const navigate = useNavigate();

  const roles = [
    { 
      value: 'enfant', 
      label: 'Enfant', 
      icon: <GraduationCap size={20} />,
      color: 'from-blue-500 to-blue-600',
      description: 'Accédez à vos cours et jeux éducatifs',
      gradient: 'from-blue-400/20 to-blue-600/20',
      subTypes: [
        { value: 'typique', label: 'Typique', description: 'Développement standard' },
        { value: 'atypique', label: 'Atypique', description: 'Autisme, TDAH, Dyslexie, etc.' }
      ]
    },
    { 
      value: 'prof', 
      label: 'Professeur', 
      icon: <BookUser size={20} />,
      color: 'from-green-500 to-green-600',
      description: 'Gérez vos cours et enfants',
      gradient: 'from-green-400/20 to-green-600/20'
    },
    { 
      value: 'admin', 
      label: 'Administrateur', 
      icon: <ShieldCheck size={20} />,
      color: 'from-purple-500 to-purple-600',
      description: 'Administration complète du système',
      gradient: 'from-purple-400/20 to-purple-600/20'
    },
    { 
      value: 'parent', 
      label: 'Parent', 
      icon: <UsersRound size={20} />,
      color: 'from-orange-500 to-orange-600',
      description: 'Suivez la progression de votre enfant',
      gradient: 'from-orange-400/20 to-orange-600/20'
    },
  ];

  const selectedRole = roles.find(r => r.value === role);

  // Récupérer les classes disponibles
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/admin/classes');
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Validation en temps réel
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(email === '' || emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setIsValidPassword(password === '' || password.length >= 6);
  }, [password]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    console.log("🔐 Tentative de login avec rôle :", role);
    if (!email.trim() || !password.trim() || !role) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Validation spécifique pour les enfants
    if (role === 'enfant' && !childType) {
      setError('Veuillez sélectionner le type d\'enfant.');
      return;
    }

    if (!isValidEmail) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!isValidPassword) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      // Choix de l'endpoint selon le rôle
      const endpointMap = {
        enfant: '/api/students/login',
        prof: '/api/teachers/login',
        admin: '/api/admin/login',
        parent: '/api/parents/login',
      };
      console.log("🔐 Payload:", email, password, "->", endpointMap[role]);
      if (!endpointMap[role]) {
        setError("Rôle invalide sélectionné. Veuillez choisir un rôle valide.");
        return;
      }
      const res = await fetch(endpointMap[role], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur de connexion');

      // On force le rôle côté front
      data.role = role;

      // On récupère l'ID de la matière si le prof en a une
      const matiereId = data.matiere?._id || data.matiere || '';

      // Stockage complet
      const userInfo = {
        ...data,
        matiere: matiereId,
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', data.token);

      // Ajouter les informations du type d'enfant dans localStorage
      if (role === 'enfant') {
        localStorage.setItem('childType', childType);
        localStorage.setItem('userRole', 'enfant');
      }

      // Redirections
      switch (role) {
        case 'enfant':
          // Redirection selon le type d'enfant
          if (childType === 'atypique') {
            navigate('/studentAtypiques');
          } else {
            navigate('/student');
          }
          break;
        case 'parent':
          navigate('/parent');
          break;
        case 'prof':
          navigate('/prof');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/student');
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de gestion de l'inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError(null);

    // Validation des champs
    if (!signUpData.firstName.trim() || !signUpData.lastName.trim() || !signUpData.email.trim() || !signUpData.phone.trim()) {
      setSignUpError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      setSignUpError('Veuillez entrer une adresse email valide.');
      return;
    }

    setSignUpLoading(true);
    try {
      // Envoyer la demande d'inscription à l'admin
      const userData = {
        firstName: signUpData.firstName.trim(),
        lastName: signUpData.lastName.trim(),
        email: signUpData.email.trim(),
        phone: signUpData.phone.trim(),
        status: 'pending' // En attente d'approbation admin
      };

      const response = await fetch('/api/admin/pending-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi de la demande');
      }

      // Demande envoyée avec succès
      alert('Votre demande d\'inscription a été envoyée à l\'administrateur. Vous recevrez un email de confirmation une fois approuvé.');
      setShowSignUpModal(false);
      setSignUpData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      setSignUpError(error.message);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden safe-area">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Enhanced floating icons with better animations */}
      <motion.div
        className="absolute top-32 right-32 text-blue-400/30"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-32 text-purple-400/30"
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Star size={30} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-1/4 text-cyan-400/20"
        animate={{ 
          rotate: 180,
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Zap size={25} />
      </motion.div>

      {/* Bouton de retour vers HomeBeforeLogin */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20"
      >
        <motion.button
          onClick={() => navigate('/')}
          className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white/30 transition-all duration-300 font-medium border border-white/30 hover:border-white/50 flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="rotate-180" size={16} />
          <span className="hidden sm:inline">Retour à l'accueil</span>
          <span className="sm:hidden">Retour</span>
        </motion.button>
      </motion.div>

      {/* Enhanced main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-8"
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img 
            src="/image pfe.png" 
            alt="Logo" 
            className="w-24 sm:w-32 mx-auto mb-4 drop-shadow-2xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <motion.h1 
          className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-2 tracking-wide bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          LEARNUP
        </motion.h1>
        <motion.p 
          className="text-blue-300 uppercase text-sm tracking-widest mb-2 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Learn. Grow. Succeed.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-2 text-yellow-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy size={16} />
          </motion.div>
          <span className="text-sm font-medium">Plateforme d'apprentissage innovante</span>
        </motion.div>
      </motion.div>

      {/* Enhanced role selection */}
      <motion.div 
        className="mb-6 sm:mb-8 w-full max-w-lg px-4 sm:px-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-white mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-center">Choisissez votre rôle</label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {roles.map((r, index) => (
            <motion.button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                role === r.value
                  ? `bg-gradient-to-r ${r.color} border-transparent text-white shadow-lg scale-105`
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {role === r.value && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${r.gradient}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="flex flex-col items-center gap-1 sm:gap-2 relative z-10">
                <motion.div
                  animate={role === r.value ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  {r.icon}
                </motion.div>
                <span className="font-semibold text-xs sm:text-sm">{r.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
        {selectedRole && (
          <motion.p 
            className="text-center mt-2 sm:mt-3 text-blue-300 text-xs sm:text-sm px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {selectedRole.description}
          </motion.p>
        )}

        {/* Sous-types pour les enfants */}
        {role === 'enfant' && selectedRole?.subTypes && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-white mb-3 text-base font-semibold text-center">Type d'enfant</label>
            <div className="grid grid-cols-2 gap-3">
              {selectedRole.subTypes.map((subType, index) => (
                <motion.button
                  key={subType.value}
                  onClick={() => setChildType(subType.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                    childType === subType.value
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-transparent text-white shadow-lg scale-105'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {childType === subType.value && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <span className="text-lg">
                      {subType.value === 'typique' ? '🌟' : '💙'}
                    </span>
                    <span className="font-semibold text-xs">{subType.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.p 
              className="text-center mt-2 text-blue-300 text-xs px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              {selectedRole.subTypes.find(st => st.value === childType)?.description}
            </motion.p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced login form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white/10 backdrop-blur-xl shadow-2xl p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-lg space-y-4 sm:space-y-6 border border-white/20 relative overflow-hidden mx-4 sm:mx-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Animated background for form */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <label className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
            <Mail size={18} className="sm:w-5 sm:h-5" />
            Identifiant
          </label>
          <motion.div
            className={`relative mt-2 ${
              focusedField === 'email' ? 'ring-2 ring-blue-500' : ''
            }`}
            whileFocus={{ scale: 1.02 }}
          >
            <input
              type="email"
              placeholder="janesmith@example.com"
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg transition-all duration-300 ${
                focusedField === 'email' ? 'border-blue-500' : 'border-white/20'
              } ${!isValidEmail && email !== '' ? 'border-red-500' : ''}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              disabled={loading}
              autoComplete="username"
            />
            {email !== '' && (
              <motion.div
                className="absolute right-4 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isValidEmail ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="relative z-10">
          <label className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
            <Lock size={18} className="sm:w-5 sm:h-5" />
            Mot de passe
          </label>
          <motion.div
            className={`relative mt-2 ${
              focusedField === 'password' ? 'ring-2 ring-blue-500' : ''
            }`}
            whileFocus={{ scale: 1.02 }}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg transition-all duration-300 ${
                focusedField === 'password' ? 'border-blue-500' : 'border-white/20'
              } ${!isValidPassword && password !== '' ? 'border-red-500' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              disabled={loading}
              autoComplete={role === 'prof' ? 'current-password' : 'off'}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {password !== '' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isValidPassword ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </motion.div>
              )}
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="text-right relative z-10">
          <motion.a 
            href="/forgot-password" 
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            whileHover={{ x: 5 }}
          >
            Mot de passe oublié ?
            <ArrowRight size={14} />
          </motion.a>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {!loading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Connexion en cours...
            </>
          ) : (
            <>
              Se connecter
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </>
          )}
        </motion.button>

        <div className="text-center relative z-10">
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Nouveau sur LearnUp ?{' '}
            <motion.a 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 transition-colors font-semibold inline-flex items-center gap-1"
              whileHover={{ x: 3 }}
            >
              Créer un compte
              <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </motion.a>
          </p>
          
          {/* Bouton S'inscrire */}
          <motion.button
            type="button"
            onClick={() => setShowSignUpModal(true)}
            className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <UsersRound size={20} />
            </motion.div>
            S'inscrire
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </motion.button>
        </div>
      </motion.form>

      {/* Enhanced footer */}
      <motion.div 
        className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>© 2024 LearnUp. Tous droits réservés.</p>
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
          {['Confidentialité', 'Conditions', 'Support'].map((link, index) => (
            <motion.a 
              key={link}
              href={`/${link.toLowerCase()}`} 
              className="hover:text-blue-400 transition-colors text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              {link}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Modal d'inscription */}
      <AnimatePresence>
        {showSignUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
                <motion.button
                  onClick={() => setShowSignUpModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <AnimatePresence>
                  {signUpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm"
                    >
                      {signUpError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jean"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
                  <input
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Information importante</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Votre demande d'inscription sera envoyée à l'administrateur. 
                    Une fois approuvée, vous recevrez un email avec vos identifiants de connexion 
                    et pourrez choisir votre rôle (Étudiant, Professeur, Parent) et votre classe.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowSignUpModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={signUpLoading}
                    className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-900 hover:to-blue-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!signUpLoading ? { scale: 1.02 } : {}}
                    whileTap={!signUpLoading ? { scale: 0.98 } : {}}
                  >
                    {signUpLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                      />
                    ) : (
                      'Envoyer la demande'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
