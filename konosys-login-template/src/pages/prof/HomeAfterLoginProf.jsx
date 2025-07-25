import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeAfterLoginProfMinimal() {
  // Récupération des infos utilisateur
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const userName = userInfo.name || "Professeur";
  const userEmail = userInfo.email || "email@exemple.com";

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] flex flex-col items-center justify-center text-center p-6">
      {/* Animation logo */}
      <motion.img
        src="/image_pfe.png" // Place ton logo dans public et adapte ce chemin si besoin
        alt="Logo LearnUp"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.04, scale: [0.5, 0.6, 0.5], rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="w-48 mb-10 pointer-events-none select-none"
      />

      {/* Overlay accueil avec fade */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50"
          >
            <motion.img
           src="/image pfe.png"
              alt="Logo LearnUp"
              className="w-24 h-24 mb-6 animate-pulse"
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Bienvenue, <span className="text-blue-700">{userName}</span>
            </h2>
            <p className="text-lg text-gray-600 italic">{userEmail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
