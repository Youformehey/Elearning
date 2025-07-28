// src/components/AddCourseForm.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const AddCourseForm = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    horaire: "",
    date: "",
    classe: "",
    semestre: "",
    etudiants: [],
  });

  const [students, setStudents] = useState([]);
  const [success, setSuccess] = useState(false);

  // Charger la liste des étudiants (optionnel)
  useEffect(() => {
    axios.get("http://localhost:5000/api/students").then((res) => {
      setStudents(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/courses", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // si tu utilises JWT
        },
      });
      setSuccess(true);
      setFormData({
        horaire: "",
        date: "",
        classe: "",
        semestre: "",
        etudiants: [],
      });
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <div className={`p-6 max-w-md mx-auto ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>➕ Ajouter un cours</h2>
      {success && <p className="text-green-600 mb-2">Cours ajouté avec succès !</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="time"
          name="horaire"
          value={formData.horaire}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Heure de début"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="classe"
          value={formData.classe}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Classe ex: L2 Informatique"
          required
        />
        <input
          type="text"
          name="semestre"
          value={formData.semestre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Semestre ex: S2"
          required
        />
        {/* Sélection des étudiants */}
        <select
          multiple
          name="etudiants"
          value={formData.etudiants}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              etudiants: Array.from(e.target.selectedOptions, (opt) => opt.value),
            }))
          }
          className="w-full border p-2 rounded"
        >
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter le cours
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
