import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  FileImage,
  FileVideo2,
  FileArchive,
  FileCheck,
  DownloadCloud,
  BookOpenCheck,
  ArrowLeft,
  FileType,
  Film,
  Image as ImgIcon,
  Archive,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentsCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, docsRes] = await Promise.all([
          fetch(`${API_URL}/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/documents/course/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!courseRes.ok) throw new Error("Erreur chargement cours");
        if (!docsRes.ok) throw new Error("Erreur chargement documents");

        const courseData = await courseRes.json();
        const docsData = await docsRes.json();

        setCourse(courseData);
        setDocuments(docsData);
      } catch (err) {
        console.error("Erreur :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token, API_URL]);

  const getIconForFile = (fileName) => {
    if (!fileName) return <FileCheck className="text-gray-400 w-7 h-7" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className="text-sky-600 w-7 h-7" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return <FileImage className="text-pink-500 w-7 h-7" />;
    if (["mp4", "webm", "avi"].includes(ext)) return <FileVideo2 className="text-purple-500 w-7 h-7" />;
    if (["zip", "rar"].includes(ext)) return <FileArchive className="text-yellow-500 w-7 h-7" />;
    return <FileCheck className="text-gray-400 w-7 h-7" />;
  };

  const isYoutubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\s]+)/);
    return ytMatch ? ytMatch[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement des documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white px-4 sm:px-6 lg:px-24 py-10">
      {/* Bouton retour */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-2 font-medium text-sm"
        >
          <ArrowLeft size={20} /> Retour au cours
        </button>
      </div>

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mb-10"
      >
        <BookOpenCheck className="text-indigo-600 mb-1" size={34} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
          Cours
        </h1>
      </motion.div>

      {/* Résumé des documents */}
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white border border-slate-200 rounded-xl shadow-md px-4 py-5 text-sm font-medium text-slate-700 max-w-xl w-full">
          <div className="flex items-center gap-2">
            <FileType className="text-sky-600" />{" "}
            {documents.filter(doc => ["pdf", "doc", "docx", "txt"].includes(doc.fileName?.split(".").pop().toLowerCase())).length} PDF
          </div>
          <div className="flex items-center gap-2">
            <ImgIcon className="text-pink-500" />{" "}
            {documents.filter(doc => ["jpg", "jpeg", "png", "gif"].includes(doc.fileName?.split(".").pop().toLowerCase())).length} Images
          </div>
          <div className="flex items-center gap-2">
            <Film className="text-purple-500" />{" "}
            {documents.filter(doc => ["mp4", "webm", "avi"].includes(doc.fileName?.split(".").pop().toLowerCase())).length} Vidéos
          </div>
          <div className="flex items-center gap-2">
            <Archive className="text-yellow-500" />{" "}
            {documents.filter(doc => ["zip", "rar"].includes(doc.fileName?.split(".").pop().toLowerCase())).length} Archives
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="text-red-600" />{" "}
            {documents.filter(doc => isYoutubeUrl(doc.fileUrl)).length} YouTube
          </div>
        </div>
      </div>

      {/* Infos cours */}
      {course && (
        <div className="text-xl text-slate-700 font-semibold mb-8 bg-indigo-50 border-l-4 border-indigo-600 px-5 py-3 rounded-md shadow-sm max-w-3xl mx-auto">
          📘 {course.classe} —{" "}
          <strong>
            {typeof course.matiere === "object"
              ? course.matiere.nom
              : course.matiere || "Matière inconnue"}
          </strong>
        </div>
      )}

      {/* Liste documents */}
      {documents.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-20 max-w-3xl mx-auto">
          Aucun document n’a encore été publié pour ce cours.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-2 sm:px-6">
          {documents.map((doc) => {
            const youtubeId = getYoutubeId(doc.fileUrl);
            const isYoutube = youtubeId !== null;

            return (
              <div
                key={doc._id}
                className="bg-white border border-indigo-300 p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    {isYoutube ? (
                      <Youtube className="text-red-600 w-7 h-7" />
                    ) : (
                      getIconForFile(doc.fileName)
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p
                      className="font-semibold text-indigo-900 text-sm truncate"
                      title={doc.fileName}
                    >
                      {isYoutube ? "Vidéo YouTube" : doc.fileName}
                    </p>
                    {doc.message && (
                      <p className="text-xs text-gray-500 italic mt-1 truncate">
                        {doc.message}
                      </p>
                    )}
                  </div>
                </div>

                {isYoutube ? (
                  <div className="mt-4 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-48 md:h-56"
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mt-3">
                    <a
                      href={`${API_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <DownloadCloud size={16} /> Voir le fichier
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
