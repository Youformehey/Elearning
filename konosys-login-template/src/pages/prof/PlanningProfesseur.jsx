import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CalendarDays,
  Download,
  School,
  Clock3,
  MapPin,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5001";

export default function PlanningProfesseur() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/seances/professeur`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeances(data);
    } catch (err) {
      console.error("Erreur chargement planning :", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Planning des Séances", 14, 14);
    autoTable(doc, {
      head: [["Date", "Heure", "Classe", "Matière", "Salle", "Groupe", "Fait"]],
      body: seances.map((s) => [
        new Date(s.date).toLocaleDateString("fr-FR"),
        `${s.heureDebut} - ${s.heureFin || "Inconnue"}`,
        s.classe,
        s.matiere,
        s.salle,
        s.groupe,
        s.fait ? "Oui" : "Non",
      ]),
    });
    doc.save("planning_professeur.pdf");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette séance ?")) return;
    try {
      await axios.delete(`${API_URL}/api/seances/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeances((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
      console.error("Erreur suppression séance:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
          <CalendarDays className="w-7 h-7 text-indigo-600" />
          Planning de vos séances
        </h2>
        <button
          onClick={generatePDF}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Télécharger PDF
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Chargement du planning...</p>
      ) : seances.length === 0 ? (
        <p className="text-gray-500">Aucune séance trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {seances.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`relative p-5 rounded-2xl shadow border hover:shadow-lg transition ${
                s.fait ? "bg-green-50 border-green-300" : "bg-white border-gray-300"
              }`}
            >
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-bl-2xl rounded-tr-2xl font-medium">
                {new Date(s.date).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </div>

              <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-3">
                <School className="w-5 h-5" />
                {s.matiere}
                {s.fait ? (
                  <CheckCircle className="text-green-600 w-5 h-5" title="Séance faite" />
                ) : (
                  <XCircle className="text-red-600 w-5 h-5" title="Séance non faite" />
                )}
              </h3>

              <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Classe : <span className="font-bold">{s.classe || "—"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Salle : <span className="font-bold">{s.salle || "—"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Groupe : <span className="font-bold">{s.groupe || "—"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4" />
                  {s.heureDebut} →{" "}
                  {s.heureFin ? (
                    <span className="font-bold">{s.heureFin}</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inconnue</span>
                  )}
                </p>
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => handleDelete(s._id)}
                className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-md transition"
                title="Supprimer la séance"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
