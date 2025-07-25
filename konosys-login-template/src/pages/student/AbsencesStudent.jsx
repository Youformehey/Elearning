import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AbsencesStudent() {
  const [absences, setAbsences] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    axios
      .get("/api/students/absences/matieres", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAbsences(res.data);
      })
      .catch((err) => {
        console.error("Erreur récupération absences :", err);
      });
  }, [token]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3">
          <FaExclamationTriangle className="text-red-600 animate-pulse" size={40} />
          Mes Absences par Matière
        </h1>
        <p className="text-blue-700 mt-2 text-lg font-medium max-w-xl mx-auto">
          Suivez vos heures d'absence par matière. Une limite de 12h est fixée pour chaque matière.
        </p>
      </header>

      {absences.length === 0 ? (
        <p className="text-center text-gray-500 text-xl italic mt-20">Aucune absence enregistrée.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {absences.map((matiere, i) => (
            <motion.div
              key={matiere.matiere}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
              className={`relative p-6 rounded-2xl shadow-lg cursor-default border-l-8 hover:shadow-xl transition-shadow
                ${
                  matiere.limiteDepassee
                    ? "border-red-500 bg-red-50"
                    : "border-green-500 bg-green-50"
                }`}
            >
              {/* Badge limite dépassée */}
              {matiere.limiteDepassee && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                  Limite dépassée
                </span>
              )}

              <h2 className="text-2xl font-semibold text-blue-900 mb-3">{matiere.matiere}</h2>
              <div className="space-y-2 text-gray-800 text-lg font-medium">
                <p>
                  <span className="font-bold">Total d'absences :</span> {matiere.totalAbsences}
                </p>
                <p>
                  <span className="font-bold">Heures manquées :</span> {matiere.totalHeures}h
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 font-semibold text-lg">
                {matiere.limiteDepassee ? (
                  <>
                    <FaExclamationTriangle className="text-red-600" size={24} />
                    <span className="text-red-700">⚠️ Attention, limite dépassée !</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-green-600" size={24} />
                    <span className="text-green-700">Situation normale</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
