import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RappelsFaitsProfesseur() {
  const { id } = useParams(); // id du rappel
  const [etudiants, setEtudiants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEtudiants() {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const res = await fetch(`/api/rappels/${id}/etudiants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Erreur lors de la récupération des étudiants.");
        }

        const data = await res.json();
        setEtudiants(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEtudiants();
  }, [id]);

  if (loading) return <p>Chargement des étudiants...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Étudiants ayant fait le rappel</h2>

      {error && <p style={{ color: "red" }}>Erreur récupération des étudiants : {error}</p>}

      {!error && etudiants.length === 0 && (
        <p className="text-gray-500">Aucun étudiant n'a encore marqué ce rappel comme fait.</p>
      )}

      <ul className="space-y-2">
        {etudiants.map((etudiant) => (
          <li
            key={etudiant._id}
            className="border p-3 rounded bg-white shadow-sm hover:bg-gray-50 transition"
          >
            <strong>{etudiant.name}</strong> —{" "}
            <span className="text-sm text-gray-700">{etudiant.email}</span> —{" "}
            <span className="text-sm italic">{etudiant.classe}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
