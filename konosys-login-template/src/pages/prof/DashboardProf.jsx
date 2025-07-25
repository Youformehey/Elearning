import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpenCheck,
  UserCheck,
  Clock4,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardProf = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const profEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!profEmail) {
      console.warn("⚠️ Aucun email trouvé dans localStorage.");
      setError("Email manquant. Veuillez vous reconnecter.");
      return;
    }

    const fetchStats = async () => {
      try {
        console.log("📩 Envoi de la requête avec email :", profEmail);

        const res = await axios.get("/api/prof/dashboard", {
          params: { email: profEmail },
        });
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Erreur chargement dashboard :", err);
        setError("Impossible de charger les statistiques.");
      }
    };

    fetchStats();
  }, [profEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center"
      >
        {/* Titre */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-extrabold text-blue-800 tracking-tight mb-2">
            🎓 Bienvenue Professeur
          </h1>
          <p className="text-lg text-blue-600 mb-6">
            Voici votre tableau de bord personnalisé
          </p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 py-3 px-4 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <BookOpenCheck className="text-blue-600" size={40} />
                <div>
                  <p className="text-sm text-gray-500">Cours total</p>
                  <h2 className="text-3xl font-bold text-blue-800">
                    {stats?.totalCours ?? "-"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                <UserCheck className="text-green-600" size={40} />
                <div>
                  <p className="text-sm text-gray-500">Étudiants inscrits</p>
                  <h2 className="text-3xl font-bold text-green-700">
                    {stats?.totalEtudiants ?? "-"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border-l-4 border-indigo-500">
              <div className="flex items-center gap-4">
                <Clock4 className="text-indigo-600" size={40} />
                <div>
                  <p className="text-sm text-gray-500">Prochain cours</p>
                  {stats?.prochainCours ? (
                    <h2 className="text-lg font-semibold text-indigo-700">
                      {new Date(stats.prochainCours.date).toLocaleString()}
                    </h2>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Aucun cours à venir
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section infos complémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-4 border-l-4 border-purple-500">
            <BarChart3 className="text-purple-600" size={36} />
            <div className="text-left">
              <p className="text-sm text-gray-500">Performance moyenne</p>
              <h3 className="text-xl font-bold text-purple-700">
                {stats?.avgPerformance ?? 0}% de participation
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 flex items-start gap-4 border-l-4 border-yellow-500">
            <CalendarDays className="text-yellow-500" size={36} />
            <div className="text-left">
              <p className="text-sm text-gray-500">Prochaines sessions</p>
              <ul className="text-gray-700 text-sm">
                {stats?.prochainesSessions?.length ? (
                  stats.prochainesSessions.map((s, idx) => (
                    <li key={idx}>
                      📅 {new Date(s.date).toLocaleDateString()} à {s.heureDebut} —{" "}
                      {s.groupe || "-"}
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-400">Aucune session prévue</li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardProf;
