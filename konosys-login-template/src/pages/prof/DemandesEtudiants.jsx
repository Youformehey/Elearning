import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Info, CheckCircle, XCircle, MessageSquare } from "lucide-react";

export default function DemandesEtudiants() {
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const profId = "1234567890abcdef"; // 🔁 Remplace par le vrai ID du prof (via auth ou localStorage)

  // Charger les demandes depuis le backend
  useEffect(() => {
    axios.get(`http://localhost:5000/api/prof/${profId}`)
      .then(res => setDemandes(res.data))
      .catch(err => console.error("Erreur chargement demandes :", err));
  }, []);

  const handleStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:5000/api/prof/${id}`, { statut });
      setDemandes(prev => prev.map(d => d._id === id ? { ...d, statut } : d));
      setSelectedDemande(null);
    } catch (err) {
      console.error("Erreur maj statut :", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 flex items-center gap-3">
          <FileText size={32} />
          Demandes des étudiants
        </h1>

        <div className="space-y-6">
          {demandes.map((d) => (
            <div
              key={d._id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-blue-700">{d.sujet}</h2>
                  <p className="text-sm text-gray-600">
                    De <strong>{d.etudiant}</strong> — {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    d.statut === "En attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : d.statut === "Acceptée"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {d.statut}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{d.message}</p>
              <div className="flex justify-end gap-3 text-sm">
                <button
                  onClick={() => setSelectedDemande(d)}
                  className="flex items-center gap-1 px-4 py-2 text-blue-700 hover:underline"
                >
                  <Info size={16} />
                  Voir détail
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedDemande && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              <button
                onClick={() => setSelectedDemande(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-red-500"
              >
                <XCircle size={22} />
              </button>
              <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Détail de la demande
              </h3>
              <p><strong>Étudiant :</strong> {selectedDemande.etudiant}</p>
              <p><strong>Date :</strong> {new Date(selectedDemande.createdAt).toLocaleDateString()}</p>
              <p className="mt-3"><strong>Message :</strong></p>
              <p className="text-gray-700">{selectedDemande.message}</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => handleStatut(selectedDemande._id, "Acceptée")}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                >
                  <CheckCircle size={16} /> Accepter
                </button>
                <button
                  onClick={() => handleStatut(selectedDemande._id, "Refusée")}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                >
                  <XCircle size={16} /> Refuser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
