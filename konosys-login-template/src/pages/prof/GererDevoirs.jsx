import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

export default function GererDevoirs() {
  const [cours, setCours] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [titles, setTitles] = useState({});
  const [uploadingFor, setUploadingFor] = useState(null);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState({});
  const [showSubmissionsFor, setShowSubmissionsFor] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Charger les cours du prof
  useEffect(() => {
    fetch(`${API_URL}/api/courses/teacher`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCours(data))
      .catch((err) => console.error("Erreur chargement cours:", err));
  }, [token]);

  // Charger les rendus d'un devoir
  const loadSubmissions = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/homework/${courseId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur chargement rendus");
      const data = await res.json();
      setHomeworkSubmissions((prev) => ({ ...prev, [courseId]: data }));
      setShowSubmissionsFor(courseId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileChange = (e, courseId) => {
    setSelectedFiles((prev) => ({ ...prev, [courseId]: e.target.files[0] }));
    setUploadingFor(courseId);
  };

  const handleTitleChange = (e, courseId) => {
    setTitles((prev) => ({ ...prev, [courseId]: e.target.value }));
  };

  const handleUpload = async (courseId) => {
    const selectedFile = selectedFiles[courseId];
    const title = titles[courseId]?.trim();

    if (!selectedFile) {
      alert("Aucun fichier choisi");
      return;
    }
    if (!title) {
      alert("Veuillez saisir un titre pour le devoir");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("titre", title);

    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/homework`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du devoir");
      alert("Devoir envoyé avec succès");

      setSelectedFiles((prev) => ({ ...prev, [courseId]: null }));
      setTitles((prev) => ({ ...prev, [courseId]: "" }));
      setUploadingFor(null);
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const handleVoirRendus = (courseId) => {
    loadSubmissions(courseId);
  };

  return (
    <div className={`p-8 max-w-4xl mx-auto font-sans ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      <button
        onClick={() => navigate("/prof/cours")}
        className="mb-6 inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-semibold"
      >
        <ArrowLeft size={20} />
        Retour à mes cours
      </button>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FileText className="text-green-600" size={32} />
        Gérer les devoirs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cours.map((cours) => (
          <div key={cours._id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {cours.classe} - {cours.semestre}
            </h2>
            <p className="text-gray-500">
              {new Date(cours.date).toLocaleDateString("fr-FR")} à {cours.horaire}
            </p>

            <input
              type="text"
              placeholder="Titre du devoir"
              value={titles[cours._id] || ""}
              onChange={(e) => handleTitleChange(e, cours._id)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="file"
              onChange={(e) => handleFileChange(e, cours._id)}
              className="mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleUpload(cours._id)}
                disabled={
                  uploadingFor !== cours._id ||
                  !selectedFiles[cours._id] ||
                  !titles[cours._id]?.trim()
                }
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
              >
                <Upload size={18} className="inline mr-1" />
                Uploader le devoir
              </button>
              <button
                onClick={() => handleVoirRendus(cours._id)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Voir les rendus
              </button>
            </div>

            {showSubmissionsFor === cours._id && homeworkSubmissions[cours._id] && (
              <div className="mt-4 border-t pt-4 max-h-60 overflow-y-auto">
                <h3 className="font-semibold mb-2">Rendus des élèves :</h3>
                {homeworkSubmissions[cours._id].length === 0 && (
                  <p className="text-gray-500">Aucun rendu pour ce devoir.</p>
                )}
                <ul>
                  {homeworkSubmissions[cours._id].map((submission) => (
                    <li key={submission._id} className="mb-1">
                      <strong>{submission.student.name}</strong> ({submission.student.email}) -{" "}
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 underline"
                      >
                        Télécharger le rendu
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
