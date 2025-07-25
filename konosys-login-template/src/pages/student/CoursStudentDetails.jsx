import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User2,
  FolderKanban,
  BookOpenText,
  BarChart3,
} from "lucide-react";

const API_URL = "http://localhost:5001/api";

export default function CoursStudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCourse();
    fetchRappels();
  }, [id, token, navigate]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement du cours");
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRappels = async () => {
    try {
      const res = await fetch(`${API_URL}/rappels/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur chargement rappels");
      const data = await res.json();
      setRappels(data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date inconnue";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  if (loading)
    return (
      <p className="text-center mt-16 animate-pulse text-indigo-700 font-semibold text-base">
        Chargement...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-16 text-red-600 font-semibold text-base">{error}</p>
    );
  if (!course)
    return (
      <p className="text-center mt-16 text-gray-600 font-medium text-base">
        Cours introuvable
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8 mb-16 font-sans">
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/student/cours")}
        className="mb-6 inline-flex items-center gap-2 px-5 py-3 bg-indigo-100 text-indigo-800 font-semibold rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow shadow-sm text-base"
        aria-label="Retour à la liste des cours"
      >
        ← Retour aux cours
      </button>

      {/* Titre */}
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-900 tracking-tight">
        {course.matiere?.nom || "Matière inconnue"} — <span className="text-indigo-600">{course.classe}</span>
      </h1>

      {/* Infos cours */}
      <div className="mb-10 space-y-4 text-gray-700 text-base leading-relaxed">
        <p className="flex items-center gap-3">
          <User2 className="text-indigo-600" size={24} />
          Professeur : <span className="font-semibold">{course.teacher?.name || "Non renseigné"}</span>
        </p>
        <p className="flex items-center gap-3">
          <CalendarDays className="text-indigo-600" size={24} />
          Date : <span className="font-semibold">{formatDate(course.date)}</span>
        </p>
        <p className="flex items-center gap-3">
          <Clock className="text-indigo-600" size={24} />
          Horaire : <span className="font-semibold">{course.horaire || "Inconnu"}</span>
        </p>
        <p>
          Salle : <span className="font-semibold">{course.salle || "Inconnue"}</span>
        </p>
      </div>

      {/* Boutons d'accès */}
      <div className="flex flex-wrap gap-4 mb-12">
        <AccessButton
          onClick={() => navigate(`/student/cours/forum/${course._id}`)}
          icon={BarChart3}
          label="Forum"
        />
        <AccessButton
          onClick={() => navigate(`/student/cours/quiz/${course._id}`)}
          icon={BookOpenText}
          label="Quiz"
        />
        <AccessButton
          onClick={() => navigate(`/student/documents-cours/${course._id}`)}
          icon={FolderKanban}
          label="Documents"
        />
      </div>

      {/* Devoirs */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-900 border-b border-indigo-400 pb-2">
          Devoirs à rendre
        </h2>
        {course.devoirs?.length > 0 ? (
          <ul className="list-disc list-inside space-y-3 text-indigo-700 text-base">
            {course.devoirs.map((d, i) => (
              <li key={i} className="hover:underline cursor-pointer">
                <a
                  href={`http://localhost:5001${d.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium"
                >
                  {d.fileName}
                </a>{" "}
                - envoyé le {formatDate(d.dateEnvoi)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-500 text-base">Aucun devoir disponible.</p>
        )}
      </section>

      {/* Rappels */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-indigo-900 border-b border-indigo-400 pb-2">
          Rappels du professeur
        </h2>
        {rappels.length > 0 ? (
          <ul className="list-disc list-inside space-y-3 text-indigo-700 text-base">
            {rappels.map((rappel) => (
              <li key={rappel._id} className="leading-relaxed">
                {rappel.message || rappel.texte} —{" "}
                <em>{formatDate(rappel.dateLimite || rappel.date)}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-500 text-base">Aucun rappel pour ce cours.</p>
        )}
      </section>
    </div>
  );
}

function AccessButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-md text-base"
      aria-label={label}
      type="button"
    >
      <Icon size={20} /> {label}
    </button>
  );
}
