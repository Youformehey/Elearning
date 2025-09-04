import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  FileImage,
  FileVideo2,
  FileArchive,
  BookOpenCheck,
  ArrowLeft,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentsCoursStudent() {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token, API_URL]);

  const getIconForFile = (fileName) => {
    if (!fileName) return <FileText className="text-gray-400 w-7 h-7" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext))
      return <FileText className="text-sky-600 w-7 h-7" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <FileImage className="text-pink-500 w-7 h-7" />;
    if (["mp4", "webm", "avi"].includes(ext))
      return <FileVideo2 className="text-purple-500 w-7 h-7" />;
    if (["zip", "rar"].includes(ext))
      return <FileArchive className="text-yellow-500 w-7 h-7" />;
    return <FileText className="text-gray-400 w-7 h-7" />;
  };

  const isYoutubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\s]+)/);
    return ytMatch ? ytMatch[1] : null;
  };

  const testDocumentAccess = async (doc) => {
    if (!doc.fileUrl) {
      alert('❌ Aucune URL de document');
      return;
    }

    // Vérifier si c'est une URL YouTube
    const isYoutube = isYoutubeUrl(doc.fileUrl);
    
    // Construire l'URL correctement selon le type
    const testUrl = isYoutube ? doc.fileUrl : `${API_URL}${doc.fileUrl}`;
    console.log('🔍 Test d\'accès au document:', testUrl);

    try {
      // Pour YouTube, on ne peut pas faire de HEAD request, on affiche simplement l'URL
      if (isYoutube) {
        alert(`✅ Vidéo YouTube\n\nNom: ${doc.fileName}\nURL: ${testUrl}`);
        return;
      }
      
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        alert(`✅ Document accessible!\n\nNom: ${doc.fileName}\nURL: ${testUrl}\nTaille: ${response.headers.get('content-length') || 'Inconnue'} bytes`);
      } else {
        alert(`❌ Document inaccessible (${response.status})\n\nNom: ${doc.fileName}\nURL: ${testUrl}\n\nErreur: ${response.statusText}`);
      }
    } catch (error) {
      alert(`❌ Erreur d'accès au document\n\nNom: ${doc.fileName}\nURL: ${testUrl}\n\nErreur: ${error.message}`);
    }
  };
  
  const handleDelete = async (docId) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== docId));
        alert("✅ Document supprimé avec succès !");
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement des documents...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white px-4 sm:px-6 lg:px-24 py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-2 font-medium text-sm"
        >
          <ArrowLeft size={20} /> Retour au cours
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mb-10"
      >
        <BookOpenCheck className="text-indigo-600 mb-1" size={34} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
          Documents du cours
        </h1>
      </motion.div>

      {course && (
        <div className="text-xl text-slate-700 font-semibold mb-8 bg-indigo-50 border-l-4 border-indigo-600 px-5 py-3 rounded-md shadow-sm max-w-3xl mx-auto text-center">
          📘 {course.classe} —{" "}
          <strong>
            {typeof course.matiere === "object"
              ? course.matiere.nom
              : course.matiere || "Matière inconnue"}
          </strong>
        </div>
      )}

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
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mt-3 gap-2">
                    <button
                      onClick={() => testDocumentAccess(doc)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                      title="Tester l'accès"
                    >
                      🔍 Test
                    </button>
                    <a
                      href={`${API_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                    >
                      Voir le fichier
                    </a>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      title="Supprimer le document"
                    >
                      🗑️ Supprimer
                    </button>
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
