import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    matiere: "",
    classe: "",
    semestre: "",
    horaire: "",
    date: "",
    salle: "",
    groupe: "",
    duree: "120",
  });

  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const teacherId = userInfo?._id;

  const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // Charger les matières
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const res = await axios.get(`${API}/api/matieres`);
        setMatieres(res.data);
      } catch (error) {
        console.error("Erreur chargement matières:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatieres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, teacher: teacherId };

    try {
      await axios.post(`${API}/api/courses`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Cours ajouté !");
      navigate("/prof/cours");
    } catch (error) {
      console.error("Erreur ajout cours:", error);
      alert("Erreur lors de l’ajout du cours.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md"
      >
        <div className="flex items-center mb-4">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer mr-2" />
          <h2 className="text-xl font-semibold">Ajouter un Cours</h2>
        </div>

        {/* Sélection matière */}
        <select
          name="matiere"
          value={form.matiere}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        >
          <option value="">-- Sélectionne une matière --</option>
          {matieres.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nom.trim()}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="classe"
          placeholder="Classe"
          value={form.classe}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="text"
          name="semestre"
          placeholder="Semestre"
          value={form.semestre}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          name="horaire"
          placeholder="Horaire (ex: 14h)"
          value={form.horaire}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          name="salle"
          placeholder="Salle"
          value={form.salle}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          name="groupe"
          placeholder="Groupe"
          value={form.groupe}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="number"
          name="duree"
          placeholder="Durée en minutes"
          value={form.duree}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Ajouter le Cours
        </button>
      </form>
    </div>
  );
}
