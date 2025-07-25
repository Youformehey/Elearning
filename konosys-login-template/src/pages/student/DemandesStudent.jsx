import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, MessageSquare } from "lucide-react";

export default function DemandesStudent() {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

    axios
      .get("/api/etudiant/mes-demandes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDemandes(res.data))
      .catch((err) =>
        console.error("Erreur chargement demandes étudiant :", err)
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-10 flex items-center gap-3">
          <FileText size={28} />
          Mes demandes
        </h1>

        {demandes.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            Aucune demande envoyée pour le moment.
          </p>
        ) : (
          <div className="space-y-6">
            {demandes.map((d) => (
              <div
                key={d._id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-700">
                      {d.sujet}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Envoyée le{" "}
                      {new Date(d.createdAt).toLocaleDateString("fr-FR")}
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
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MessageSquare size={18} className="text-blue-400 mt-1" />
                  <p>{d.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
