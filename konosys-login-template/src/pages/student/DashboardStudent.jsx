import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpenCheck,
  UserCheck,
  Clock4,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardStudent() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const studentEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!studentEmail) {
      setError("Email manquant.");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/etudiant/dashboard", {
          params: { email: studentEmail },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Erreur chargement dashboard :", err);
        setError("Impossible de charger le tableau de bord.");
      }
    };

    fetchStats();
  }, [studentEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">
          🎒 Bienvenue élève
        </h1>
        <p className="text-blue-600 mb-8 text-lg">Voici ton espace personnel</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <BookOpenCheck className="text-blue-600 mb-2" size={32} />
            <p className="text-sm text-gray-500">Nombre de cours</p>
            <h2 className="text-2xl font-bold text-blue-800">
              {stats?.totalCours ?? "-"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <UserCheck className="text-green-600 mb-2" size={32} />
            <p className="text-sm text-gray-500">Mes camarades</p>
            <h2 className="text-2xl font-bold text-green-700">
              {stats?.totalEtudiants ?? "-"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
            <Clock4 className="text-indigo-600 mb-2" size={32} />
            <p className="text-sm text-gray-500">Prochain cours</p>
            {stats?.prochainCours ? (
              <p className="text-lg font-semibold text-indigo-700">
                {new Date(stats.prochainCours.date).toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Aucun cours à venir</p>
            )}
          </div>
        </div>

        <div className="mt-10 bg-white p-6 rounded-xl border shadow-md text-left">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            📅 Prochaines sessions
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {stats?.prochainesSessions?.length ? (
              stats.prochainesSessions.map((s, idx) => (
                <li key={idx}>
                  📘 {s.matiere} — {s.date} à {s.heureDebut} ({s.groupe})
                </li>
              ))
            ) : (
              <li className="italic text-gray-500">Aucune session prévue</li>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
