import React, { useState, useEffect } from "react";
import {
  FileText,
  FileImage,
  FileVideo2,
  FileArchive,
  FileCheck,
  Trash2,
  DownloadCloud,
  UploadCloud,
  FolderPlus,
  Youtube,
} from "lucide-react";

export default function DocumentsProfesseur() {
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const teacherEmail = userInfo?.email;

  // Charger les cours du prof
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses?search=&page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const profCourses = (data.courses || []).filter(
          (course) => course?.teacher?.email === teacherEmail
        );
        setCourses(profCourses);
        // Si cours précédemment sélectionné existe, le sélectionner par défaut
        const lastCourse = localStorage.getItem("lastCourse");
        if (lastCourse && profCourses.some(c => c._id === lastCourse)) {
          setSelectedCourse(lastCourse);
        }
      } catch (err) {
        console.error("Erreur chargement cours:", err);
        setError("Impossible de charger les cours.");
      }
    };
    fetchCourses();
  }, [API_URL, token, teacherEmail]);

  // Charger les documents quand selectedCourse change
  useEffect(() => {
    if (!selectedCourse) return setDocuments([]);
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/documents/course/${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur chargement documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Erreur chargement documents:", err);
        setDocuments([]);
      }
    };
    fetchDocuments();
  }, [selectedCourse, API_URL, token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Choisis un cours.");
    if (!file && !videoUrl.trim()) return alert("Choisis un fichier ou entre une URL vidéo.");

    setUploading(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("course", selectedCourse);
        formData.append("message", message);

        const res = await fetch(`${API_URL}/api/documents`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur upload fichier");
        }
      } else {
        // Ajouter l'URL vidéo via POST /api/documents/url
        const res = await fetch(`${API_URL}/api/documents/url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: selectedCourse,
            fileUrl: videoUrl.trim(),
            fileName: "Vidéo YouTube",
            message,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erreur ajout URL vidéo");
        }
      }

      // Rafraîchir documents
      const docsRes = await fetch(`${API_URL}/api/documents/course/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const docsData = await docsRes.json();
      setDocuments(docsData);

      // Reset form
      setFile(null);
      setVideoUrl("");
      setMessage("");
      e.target.reset();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch {
      alert("Erreur suppression document");
    }
  };

  const getCourseName = (id) => {
    const course = courses.find((c) => c._id === id);
    if (!course) return "Inconnu";
    const matiereNom = course.matiere?.nom || "Inconnu";
    return `${course.classe} — ${matiereNom}`;
  };

  const getIconForFile = (fileName) => {
    if (!fileName) return <FileCheck className="text-gray-400" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className="text-blue-600" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return <FileImage className="text-pink-600" />;
    if (["mp4", "webm", "avi"].includes(ext)) return <FileVideo2 className="text-purple-600" />;
    if (["zip", "rar"].includes(ext)) return <FileArchive className="text-yellow-600" />;
    return <FileCheck className="text-gray-400" />;
  };

  return (
    <div className="p-10 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FolderPlus className="text-indigo-700" size={36} />
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-wide">Documents de Cours</h1>
      </div>

      {error && <p className="text-red-600 mb-8 text-center font-semibold">{error}</p>}

      {/* FORMULAIRE D'UPLOAD */}
      <form
        onSubmit={handleUpload}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-8"
      >
        <div>
          <label className="block font-semibold mb-3 text-indigo-700 text-lg">Cours :</label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              localStorage.setItem("lastCourse", e.target.value);
            }}
            className="w-full rounded-lg border border-indigo-300 p-4 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          >
            <option value="">-- Sélectionner un cours --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.classe} — {c.matiere?.nom || "Inconnu"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-3 text-indigo-700 text-lg">Fichier :</label>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setVideoUrl("");
            }}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.webm,.avi,.zip,.rar"
            className="w-full rounded-lg border border-indigo-300 p-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-3 text-indigo-700 text-lg">Ou URL vidéo YouTube :</label>
          <input
            type="url"
            placeholder="Coller une URL vidéo YouTube"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setFile(null);
            }}
            className="w-full rounded-lg border border-indigo-300 p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-3 text-indigo-700 text-lg">Message (optionnel) :</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex : Support du chapitre 3"
            className="w-full rounded-lg border border-indigo-300 p-4 resize-none h-28 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`inline-flex items-center gap-3 ${
            uploading ? "bg-indigo-400" : "bg-indigo-700 hover:bg-indigo-900"
          } text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transition-transform active:scale-95`}
        >
          <UploadCloud size={24} /> {uploading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>

      {/* LISTE DES DOCUMENTS */}
      {selectedCourse && (
        <>
          <h2 className="text-3xl font-semibold text-indigo-800 mt-16 mb-8 flex items-center gap-3">
            <FolderPlus size={28} className="text-indigo-700" />
            Documents pour :{" "}
            <span className="text-indigo-700 font-bold cursor-default select-none">
              {getCourseName(selectedCourse)}
            </span>
          </h2>

          {documents.length === 0 ? (
            <p className="text-center text-indigo-400 italic text-lg">Aucun document trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc) => {
                const isYoutube =
                  doc.fileUrl &&
                  (doc.fileUrl.includes("youtube.com") || doc.fileUrl.includes("youtu.be"));

                return (
                  <div
                    key={doc._id}
                    className="bg-white border border-indigo-300 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition cursor-default flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-5 mb-4">
                      <div className="text-5xl">
                        {isYoutube ? <Youtube className="text-red-600" /> : getIconForFile(doc.fileName)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-indigo-900 truncate" title={doc.fileName}>
                          {isYoutube ? "Vidéo YouTube" : doc.fileName}
                        </p>
                        <p className="text-md text-indigo-600 truncate">{doc.message || "-"}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-base text-indigo-700">
                      {isYoutube ? (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 hover:text-indigo-900 font-semibold transition"
                        >
                          <FileVideo2 size={20} /> Voir la vidéo
                        </a>
                      ) : (
                        <a
                          href={`${API_URL}${doc.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 hover:text-indigo-900 font-semibold transition"
                        >
                          <DownloadCloud size={20} /> Voir
                        </a>
                      )}

                      <button
                        onClick={() => handleDelete(doc._id)}
                        title="Supprimer"
                        className="text-red-700 hover:text-red-900 transition"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
