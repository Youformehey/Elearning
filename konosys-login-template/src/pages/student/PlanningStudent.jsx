import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  School,
  User,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5001";

export default function PlanningStudent() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    if (!token) return;
    fetchPlanning();
  }, [token]);

  const fetchPlanning = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/seances/etudiant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeances(data);
    } catch (error) {
      console.error("Erreur chargement planning :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-50 to-white">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 flex items-center gap-2">
        <CalendarDays className="w-7 h-7" />
        Mon Planning
      </h2>

      {loading ? (
        <p className="text-gray-600 animate-pulse">Chargement du planning...</p>
      ) : seances.length === 0 ? (
        <p className="text-gray-600">Aucune séance trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seances.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`border rounded-xl p-5 shadow-md hover:shadow-lg transition
                ${s.fait ? "bg-green-50 border-green-400" : "bg-white border-gray-300"}
              `}
            >
              <div className="flex justify-between items-center mb-3 text-gray-700 text-sm font-semibold">
                <div>
                  {new Date(s.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div>
                  {s.heureDebut} - {s.heureFin}
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <School className="w-5 h-5" />
                {s.course?.matiere?.nom?.trim() || "Matière inconnue"}
              </h3>

              <div className="mb-4 text-gray-700 space-y-1">
                <p className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Professeur : <span className="font-semibold">{s.teacher?.name || "Inconnu"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email : <span className="font-semibold">{s.teacher?.email || "Inconnu"}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold">
                {s.fait ? (
                  <CheckCircle className="w-6 h-6 text-green-600" title="Séance faite" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" title="Séance non faite" />
                )}
                <span>{s.fait ? "Séance faite" : "Séance non faite"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
