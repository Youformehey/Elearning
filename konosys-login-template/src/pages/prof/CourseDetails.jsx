import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CalendarDays, Clock, MapPin, Users, ArrowLeft } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    axios
      .get(`${API}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Erreur chargement cours :", err));
  }, [id]);

  if (!course) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <Link
          to="/prof/cours"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {course.classe} — {course.matiere?.nom || "Matière non précisée"}
          </h1>
          <div className="flex items-center text-gray-500 text-sm gap-4 mt-2">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {new Date(course.date).toLocaleDateString("fr-FR")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.horaire}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Professeur :</strong> {course.teacher?.name || "Inconnu"} (
            {course.teacher?.email})
          </p>
          <p>
            <strong>Salle :</strong> {course.salle}
          </p>
          <p>
            <strong>Groupe :</strong> {course.groupe}
          </p>
          <p>
            <strong>Durée :</strong> {course.duree} minutes
          </p>
        </div>

        <div>
          <h2 className="text-md font-semibold text-gray-800 mb-2">
            Étudiants inscrits :
          </h2>
          <ul className="list-disc list-inside text-gray-600">
            {course.etudiants.length > 0 ? (
              course.etudiants.map((etudiant, index) => (
                <li key={index}>{etudiant.name}</li>
              ))
            ) : (
              <li>Aucun inscrit</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
