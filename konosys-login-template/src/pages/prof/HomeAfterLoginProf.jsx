import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Star,
  Zap,
  Trophy,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Clock,
  Calendar,
  Target,
  Award,
  TrendingUp
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardProf from "./DashboardProf";

export default function HomeAfterLoginProf() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const { darkMode } = useContext(ThemeContext);
  
  // Récupération des infos utilisateur
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const userName = userInfo.name || "Professeur";
  const userEmail = userInfo.email || "email@exemple.com";

  useEffect(() => {
    // Animation séquentielle du message de bienvenue
    const steps = [
      () => setWelcomeStep(1), // Apparition du nom
      () => setWelcomeStep(2), // Apparition du message
      () => setWelcomeStep(3), // Apparition des icônes
      () => setWelcomeStep(4), // Transition vers le dashboard
    ];

    const timers = steps.map((step, index) => 
      setTimeout(step, 800 * (index + 1))
    );

    // Transition finale vers le dashboard
    const finalTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(finalTimer);
    };
  }, []);

  const welcomeMessages = [
    "Bienvenue dans votre espace",
    "Prêt à inspirer vos étudiants ?",
    "Votre tableau de bord vous attend"
  ];

  const welcomeIcons = [
    { icon: <BookOpen size={24} />, color: "from-blue-500 to-blue-600" },
    { icon: <Users size={24} />, color: "from-green-500 to-green-600" },
    { icon: <BarChart3 size={24} />, color: "from-purple-500 to-purple-600" },
    { icon: <Target size={24} />, color: "from-orange-500 to-orange-600" }
  ];

  if (!showWelcome) {
    return <DashboardProf />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/3 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-32 right-32 text-blue-400/20"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
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
        className="absolute bottom-32 left-32 text-purple-400/20"
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
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

      {/* Main welcome content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-6">
        {/* Logo animé */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          <motion.img
            src="/image pfe.png"
            alt="Logo LearnUp"
            className="w-32 h-32 drop-shadow-2xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
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

        {/* Welcome title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className={`text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent ${darkMode ? '' : 'drop-shadow-lg'}`}>
            🎓 Bienvenue
          </h1>
          
          <AnimatePresence>
            {welcomeStep >= 1 && (
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
                className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-blue-800'}`}
              >
                {userName}
              </motion.h2>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {welcomeStep >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}
              >
                {welcomeMessages[Math.min(welcomeStep - 2, welcomeMessages.length - 1)]}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Animated icons */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {welcomeIcons.map((item, index) => (
            <AnimatePresence key={index}>
              {welcomeStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-xl`}
                >
                  {item.icon}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(welcomeStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Final transition message */}
        <AnimatePresence>
          {welcomeStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 text-blue-600 font-semibold"
            >
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={20} />
              </motion.div>
              <span>Accès à votre tableau de bord...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`absolute bottom-8 left-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <p>{userEmail}</p>
        </motion.div>

        {/* Achievement badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 300 }}
          className="absolute top-8 right-8"
        >
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Trophy size={20} />
            <span className="font-semibold">Professeur Premium</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
