import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/rappelsEtudiant";

export default function RappelsStudent() {
  const [rappels, setRappels] = useState([]);
  const [classe, setClasse] = useState("");
  const [error, setError] = useState("");

  // Récupérer la classe stockée dans localStorage (ou autre source)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.classe) setClasse(userInfo.classe);
  }, []);

  // Charger les rappels filtrés par classe
  const fetchRappels = async () => {
    if (!classe) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const res = await fetch(`${API_URL}?classe=${encodeURIComponent(classe)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur chargement rappels");
      setRappels(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Impossible de charger les rappels.");
    }
  };

  useEffect(() => {
    fetchRappels();
  }, [classe]);

  // Bascule "fait" / "non fait"
  const toggleFait = async (id, currentState) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fait: !currentState }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur mise à jour");
      }

      await fetchRappels();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📝 Mes Rappels (Classe : {classe})</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {rappels.length === 0 ? (
        <p className="italic text-gray-600">Aucun rappel enregistré pour votre classe.</p>
      ) : (
        <ul className="space-y-4">
          {rappels.map((rappel) => (
            <li
              key={rappel._id}
              className="border rounded p-4 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <p>
                  <strong className="capitalize">{rappel.type}</strong> : {rappel.texte}
                </p>
                <p>
                  Date : {new Date(rappel.date).toLocaleDateString()} — Classe : {rappel.classe}
                </p>
                <p>
                  Professeur : {rappel.professeur?.name || "Inconnu"} — {rappel.professeur?.email || "Inconnu"}
                </p>
                <p>Étudiants ayant fait : {rappel.etudiantsQuiOntFait?.length || 0}</p>
              </div>

              <button
                onClick={() => toggleFait(rappel._id, rappel.fait)}
                className={`mt-3 sm:mt-0 px-4 py-2 rounded font-semibold ${
                  rappel.fait ? "bg-green-500 text-white" : "bg-yellow-400"
                }`}
              >
                {rappel.fait ? "✅ Fait" : "⏳ Marquer comme fait"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
