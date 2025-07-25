import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5001";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 100 },
  }),
};

const toggleVariants = {
  open: { rotate: 180, transition: { duration: 0.3 } },
  closed: { rotate: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function CoursStudent() {
  const navigate = useNavigate();

  const [chapitres, setChapitres] = useState([]);
  const [coursSansChapitre, setCoursSansChapitre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChapitreIds, setOpenChapitreIds] = useState({});
  const [openMatiereIds, setOpenMatiereIds] = useState({});

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const classeEtudiant = userInfo?.classe || null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const resChapitres = await fetch(`${API_URL}/api/students/chapitres-cours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resChapitres.ok) throw new Error("Erreur " + resChapitres.status);
      const dataChapitres = await resChapitres.json();

      const chapitresFiltres = classeEtudiant
        ? dataChapitres.filter(chapitre =>
            chapitre.cours.some(cours => cours.classe === classeEtudiant)
          )
        : dataChapitres;
      setChapitres(chapitresFiltres);

      const resCours = await fetch(`${API_URL}/api/students/cours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resCours.ok) throw new Error("Erreur " + resCours.status);
      const dataCours = await resCours.json();

      const coursEnChapitreIds = new Set(
        chapitresFiltres.flatMap(chap => chap.cours.map(c => c._id))
      );
      const sansChapitre = dataCours.filter(
        c => !coursEnChapitreIds.has(c._id) && (!classeEtudiant || c.classe === classeEtudiant)
      );
      setCoursSansChapitre(sansChapitre);
    } catch (err) {
      setError("Erreur de chargement des données.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapitre = (id) =>
    setOpenChapitreIds(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleMatiere = (matiere) =>
    setOpenMatiereIds(prev => ({ ...prev, [matiere]: !prev[matiere] }));

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("fr-FR") : "Date inconnue";

  const getMatiereNom = (cours) => {
    if (!cours.matiere) return "Matière non renseignée";
    if (!cours.matiere.nom?.trim()) return "Matière inconnue";
    return cours.matiere.nom;
  };

  const coursGroupesParMatiere = coursSansChapitre.reduce((acc, cours) => {
    const matiere = getMatiereNom(cours);
    if (!acc[matiere]) acc[matiere] = [];
    acc[matiere].push(cours);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen bg-white p-8 max-w-7xl mx-auto font-sans text-gray-900"
      style={{ paddingTop: "72px" }} // espace pour navbar fixe
    >
      <header className="flex items-center gap-4 mb-12 sticky top-0 bg-white z-10 py-6 rounded-xl shadow-md border-b border-gray-300">
        <BookOpenCheck size={44} className="text-indigo-700" />
        <h1 className="text-5xl font-extrabold tracking-tight">Mes Cours</h1>
      </header>

      {loading && (
        <p className="text-center text-indigo-700 animate-pulse text-lg font-semibold">Chargement...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* Cours sans chapitre par matière */}
          {Object.entries(coursGroupesParMatiere).map(([matiere, coursList], index) => (
            <motion.section
              key={matiere}
              className="mb-14 rounded-2xl border border-gray-300 bg-white shadow-lg"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              custom={index}
            >
              <button
                onClick={() => toggleMatiere(matiere)}
                className="flex justify-between items-center w-full rounded-t-2xl bg-gray-100 px-8 py-5 font-semibold text-gray-900 hover:bg-gray-200 transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
                aria-expanded={openMatiereIds[matiere] ? "true" : "false"}
              >
                <span className="uppercase tracking-wide text-lg">{matiere}</span>
                <motion.div
                  variants={toggleVariants}
                  animate={openMatiereIds[matiere] ? "open" : "closed"}
                >
                  <ChevronDown size={26} className="text-gray-700" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openMatiereIds[matiere] && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={contentVariants}
                    style={{ overflow: "hidden" }}
                    className="px-8 py-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {coursList.map((cours) => (
                        <CoursCard
                          key={cours._id}
                          cours={cours}
                          navigate={navigate}
                          formatDate={formatDate}
                          getMatiereNom={getMatiereNom}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          ))}

          {/* Chapitres */}
          {chapitres.length === 0 ? (
            <p className="text-center italic text-gray-400 text-lg">Aucun chapitre trouvé.</p>
          ) : (
            chapitres.map((chapitre, index) => (
              <motion.section
                key={chapitre._id}
                className="mb-14 rounded-2xl border border-purple-300 bg-white shadow-lg"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                custom={index}
              >
                <button
                  onClick={() => toggleChapitre(chapitre._id)}
                  className="flex justify-between items-center w-full rounded-t-2xl bg-purple-100 px-8 py-5 font-semibold text-purple-900 hover:bg-purple-200 transition focus:outline-none focus:ring-4 focus:ring-purple-400"
                  aria-expanded={openChapitreIds[chapitre._id] ? "true" : "false"}
                >
                  <span className="text-lg">{chapitre.titre}</span>
                  <motion.div
                    variants={toggleVariants}
                    animate={openChapitreIds[chapitre._id] ? "open" : "closed"}
                  >
                    <ChevronDown size={26} className="text-purple-700" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openChapitreIds[chapitre._id] && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={contentVariants}
                      style={{ overflow: "hidden" }}
                      className="px-8 py-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapitre.cours
                          .filter(c => c.classe === classeEtudiant)
                          .map(cours => (
                            <CoursCard
                              key={cours._id}
                              cours={cours}
                              navigate={navigate}
                              formatDate={formatDate}
                              getMatiereNom={getMatiereNom}
                            />
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            ))
          )}
        </>
      )}
    </div>
  );
}

function CoursCard({ cours, navigate, formatDate, getMatiereNom }) {
  return (
    <article
      tabIndex={0}
      onClick={() => navigate(`/student/cours/${cours._id}`)}
      className="cursor-pointer bg-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition transform hover:scale-[1.05] p-6 flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-indigo-400"
      aria-label={`Cours de ${getMatiereNom(cours)} en classe ${cours.classe || "N/A"}`}
    >
      <div>
        <h3 className="text-gray-900 font-bold text-xl mb-2 truncate">
          {getMatiereNom(cours)}
        </h3>
        <p className="text-gray-700 font-semibold mb-1">{cours.classe}</p>
        <p className="text-gray-600 mb-2">
          Prof : <span className="font-semibold">{cours.teacher?.name || "Inconnu"}</span>
        </p>
        <p className="text-gray-500 truncate">{cours.teacher?.email || "Email inconnu"}</p>
      </div>

      <div className="flex gap-5 text-indigo-600 text-sm mt-6">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          <span>{formatDate(cours.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{cours.horaire || "Inconnu"}</span>
        </div>
      </div>
    </article>
  );
}
