import React, { useEffect, useState } from "react";
import HomeNavbar from "../../Components/HomeNavbar";
import {
  Calendar,
  BookOpenCheck,
  AlertTriangle,
  Rocket,
  Megaphone,
  Smile,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeAfterLogin() {
  const navigate = useNavigate();

  // Récupération du nom depuis localStorage (userInfo JSON)
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userName = userInfo?.name || "Professeur";

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">
      <HomeNavbar userName={userName} />

      {/* Logo depuis public (pas d'import ici) */}
      <motion.img
        src="/image_pfe.png"
        alt="Logo"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.02, scale: [0.5, 0.6, 0.5], rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed w-[450px] bottom-[-100px] right-[-100px] pointer-events-none z-0"
      />

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50"
          >
            <img
              src="/image_pfe.png"
              alt="Logo"
              className="w-24 h-24 mb-6 animate-pulse"
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenue, <span className="text-blue-700">{userName}</span>
            </h2>
            <p className="text-sm text-gray-500">Connexion en cours...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-blue-800 text-white py-3 px-6 text-center text-sm font-medium flex justify-center items-center gap-2 animate-fadeIn">
        <Rocket size={16} className="text-white animate-bounce" />
        <span>
          Préparez-vous à réussir — Découvrez vos outils, vos cours et vos missions du jour !
        </span>
      </div>

      <main className="relative z-10 flex flex-col justify-center items-center text-center min-h-[85vh] px-4">
        <section className="mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 animate-fadeIn">
            Let's work smart.
          </h1>
          <p className="text-md text-gray-600 font-medium">
            Apprentissage. Discipline. Excellence.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl animate-fadeInUp">
          <Card
            title="Planning"
            icon={<Calendar size={26} className="text-blue-700" />}
            description="Aucun événement prévu."
            buttonLabel="Ouvrir"
            onClick={() => navigate("/etudiant/planning")}
          />

          <Card
            title="Absences"
            icon={<AlertTriangle size={26} className="text-blue-700" />}
            description={
              <>
                <p>
                  Anglais 5 — <span className="text-red-600 font-semibold">Non excusé</span>
                </p>
                <p>
                  Prépa Pro — <span className="text-red-600 font-semibold">Non excusé</span>
                </p>
              </>
            }
            buttonLabel="Gérer"
            onClick={() => navigate("/etudiant/absence")}
          />

          <Card
            title="Cours"
            icon={<BookOpenCheck size={26} className="text-blue-700" />}
            description={
              <>
                <p>Big Data — Framework</p>
                <p>Big Data — Virtualisation</p>
              </>
            }
            buttonLabel="Explorer"
            onClick={() => navigate("/etudiant/cours")}
          />
        </section>

        <section className="mt-16 w-full max-w-4xl text-left animate-fadeInUp px-4">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Megaphone className="text-blue-600" /> Annonces & Informations
          </h2>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="bg-blue-50 px-4 py-3 rounded-xl shadow-sm hover:bg-blue-100 transition">
              ✅ Les devoirs de la semaine sont disponibles pour Animation 3D.
            </li>
            <li className="bg-blue-50 px-4 py-3 rounded-xl shadow-sm hover:bg-blue-100 transition">
              📆 N'oubliez pas de justifier vos absences avant vendredi.
            </li>
            <li className="bg-blue-50 px-4 py-3 rounded-xl shadow-sm hover:bg-blue-100 transition">
              🆕 Nouveau module “Cloud & Virtualisation” à découvrir dans vos cours.
            </li>
          </ul>
        </section>

        <section className="mt-10 text-blue-800 text-sm flex items-center gap-2 animate-fadeIn">
          <Smile size={18} className="text-green-500" />
          <span>Bonne journée {userName}, n'oublie pas de progresser chaque jour 💡</span>
        </section>

        <footer className="mt-20 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LearnUp. Tous droits réservés.
        </footer>
      </main>
    </div>
  );
}

function Card({ title, icon, description, buttonLabel, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-3xl shadow-xl p-6 transition-all border-t-4 border-blue-600"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="text-left text-sm text-gray-600 mb-5">{description}</div>
      <button
        onClick={onClick}
        className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-900 transition font-medium"
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
