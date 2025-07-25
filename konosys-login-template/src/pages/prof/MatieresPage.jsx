import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [nom, setNom] = useState("");

  const fetchMatieres = async () => {
    const res = await axios.get("/api/matieres");
    setMatieres(res.data);
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  const addMatiere = async () => {
    if (!nom.trim()) return;
    await axios.post("/api/matieres", { nom });
    setNom("");
    fetchMatieres();
  };

  const deleteMatiere = async (id) => {
    await axios.delete(`/api/matieres/${id}`);
    fetchMatieres();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Gestion des Matières</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nom de la matière"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addMatiere} className="bg-blue-500 text-white px-4 rounded">
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {matieres.map((m) => (
          <li key={m._id} className="flex justify-between items-center border p-2 rounded">
            <span>{m.nom}</span>
            <button onClick={() => deleteMatiere(m._id)} className="text-red-500">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
