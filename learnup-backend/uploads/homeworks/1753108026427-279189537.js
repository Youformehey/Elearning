import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Clock, User2, BarChart3, MailPlus, BookOpen, FileBarChart2,
  GraduationCap, FolderKanban, Users2, Trash2
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function MesCours() {
  const navigate = useNavigate();
  const [coursData, setCoursData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [absenceStatsMap, setAbsenceStatsMap] = useState({});

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const userRole = userInfo?.role;
  const userEmail = userInfo?.email;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (userRole === "teacher") {
      fetchProfCourses();
    } else {
      fetchAllCourses();
    }
  }, []);

  const getColorByMatiere = (matiere) => {
    const map = {
      français: "bg-blue-100 text-blue-600",
      maths: "bg-red-100 text-red-600",
      mathématiques: "bg-red-100 text-red-600",
      svt: "bg-green-100 text-green-600",
      histoire: "bg-yellow-100 text-yellow-600",
      physique: "bg-purple-100 text-purple-600",
      anglais: "bg-pink-100 text-pink-600",
      default: "bg-gray-100 text-gray-600",
    };
    return map[matiere?.toLowerCase()] || map.default;
  };

  const fetchProfCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/courses/prof`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const onlyMine = (data || []).filter(course => course?.teacher?.email === userEmail);
      setCoursData(onlyMine);
    } catch (err) {
      console.error("❌ Erreur chargement cours prof :", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/courses?search=&page=1&limit=20`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCoursData(data.courses || []);
    } catch (err) {
      console.error("❌ Erreur chargement cours tous :", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherEnroll = async (courseId) => {
    const email = prompt("Email de l'étudiant à inscrire ?");
    if (!email) return;
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ studentEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Étudiant inscrit ✅");
      fetchProfCourses();
    } catch (err) {
      alert("❌ Erreur inscription : " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Cours supprimé ✅");
      fetchProfCourses();
    } catch (err) {
      alert("❌ Erreur suppression : " + err.message);
    }
  };

  const fetchAbsenceStats = async (cours) => {
    try {
      const res = await fetch(`${API_URL}/api/absences/stats/${cours._id}`, { headers: authHeaders });
      if (!res.ok) throw new Error("Erreur récupération des stats");
      const data = await res.json();
      setAbsenceStatsMap((prev) => ({ ...prev, [cours._id]: data.absences || [] }));
    } catch (err) {
      console.error("❌ Stats erreur :", err.message);
    }
  };

  const handleShowStats = (cours) => {
    if (selectedCourseId === cours._id) {
      setSelectedCourseId(null);
    } else {
      setSelectedCourseId(cours._id);
      fetchAbsenceStats(cours);
    }
  };

  const renderCoursCard = (cours) => {
    const isSelected = selectedCourseId === cours._id;
    const formattedDate = new Date(cours.date).toLocaleDateString();
    const colorStyle = getColorByMatiere(cours.matiere);

    return (
      <div key={cours._id} className="bg-white rounded-2xl shadow-sm border hover:shadow-xl transition p-6 relative">
        <button
          onClick={() => handleDeleteCourse(cours._id)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
          title="Supprimer ce cours"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-lg text-gray-800">{cours.classe}</p>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Semestre {cours.semestre}</span>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${colorStyle}`}>
          {cours.matiere}
        </div>

        <p className="text-sm text-gray-600 mb-1">
          <CalendarDays className="inline w-4 h-4 text-blue-500 mr-1" />
          {formattedDate} — <Clock className="inline w-4 h-4 text-blue-500 mx-1" /> {cours.horaire}
        </p>

        <p className="text-sm text-gray-600 mb-3">
          <GraduationCap className="inline w-4 h-4 text-blue-500 mr-1" />
          Prof : <strong>{cours.teacher?.name}</strong>
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <LinkBtn to={`/quiz/${cours._id}`} text="Quiz" icon={FileBarChart2} color="text-blue-600" />
          <LinkBtn to={`/forum/${cours._id}`} text="Forum" icon={BarChart3} color="text-purple-600" />
          <Btn onClick={() => handleTeacherEnroll(cours._id)} text="Ajouter élève" icon={MailPlus} color="text-green-600" />
          <LinkBtn to={`/prof/documents-cours/${cours._id}`} text="Documents" icon={FolderKanban} color="text-yellow-600" />
        </div>

        {isSelected && (
          <div className="mt-3 bg-slate-50 p-3 rounded-md border text-sm">
            <h4 className="text-blue-700 font-semibold mb-2">Absences :</h4>
            {absenceStatsMap[cours._id]?.length > 0 ? (
              <ul className="space-y-1">
                {absenceStatsMap[cours._id].map((s, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className={s.totalHours >= 8 ? "text-red-600 font-bold" : "text-gray-700"}>
                      {s.totalHours}h {s.totalHours >= 8 && "🚨"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucune absence</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <p className="font-medium text-sm text-gray-700 mb-1">
            <Users2 className="inline w-4 h-4 mr-1 text-blue-500" />
            Étudiants :
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {cours.etudiants?.length > 0 ? (
              cours.etudiants.map((e, idx) => <li key={idx}>{e.name}</li>)
            ) : (
              <li>Aucun étudiant inscrit</li>
            )}
          </ul>
        </div>

        <button
          onClick={() => handleShowStats(cours)}
          className="mt-3 text-blue-600 hover:underline text-sm"
        >
          {isSelected ? "Masquer les stats" : "Voir stats d'absences"}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-800 flex gap-2 items-center">
            <BookOpen /> Mes Cours
          </h1>
          {userRole === "teacher" && (
            <button
              onClick={() => navigate("/ajouter-cours")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Ajouter
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-lg py-10">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursData.map(renderCoursCard)}
          </div>
        )}
      </div>
    </div>
  );
}

const Btn = ({ onClick, icon: Icon, text, color }) => (
  <button onClick={onClick} className={`${color} hover:underline flex items-center gap-1`}>
    <Icon size={16} /> {text}
  </button>
);

const LinkBtn = ({ to, icon: Icon, text, color }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className={`${color} hover:underline flex items-center gap-1`}>
      <Icon size={16} /> {text}
    </button>
  );
};
