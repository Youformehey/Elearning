import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { motion } from "framer-motion";

export default function AbsencesProfesseur() {
  const [coursList, setCoursList] = useState([]);
  const [selectedCours, setSelectedCours] = useState(null);
  const [absences, setAbsences] = useState({});
  const [attendance, setAttendance] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get("/api/courses/teacher", authHeaders)
      .then((res) => setCoursList(res.data || []))
      .catch((err) => console.error("Erreur cours:", err));
  }, []);

  const handleSelectCours = async (id) => {
    try {
      const { data } = await axios.get(`/api/courses/${id}`, authHeaders);
      setSelectedCours(data);
      setAttendance({});
    } catch (err) {
      console.error("Erreur cours:", err);
    }
  };

  useEffect(() => {
    if (!selectedCours) return;
    axios
      .get(`/api/absences/cours/${selectedCours._id}`, authHeaders)
      .then(({ data }) => {
        const mapped = {};
        data.forEach((abs) => {
          const id = abs.student?._id || abs.etudiant;
          if (!mapped[id]) mapped[id] = [];
          mapped[id].push(abs.date?.split("T")[0]);
        });
        setAbsences(mapped);
      })
      .catch((err) => {
        console.error("Erreur absences:", err);
        setAbsences({});
      });
  }, [selectedCours]);

  const toggleLocalAbsence = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? (absences[id] || []).includes(today)),
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "/api/absences",
        {
          courseId: selectedCours._id,
          attendance,
        },
        authHeaders
      );
      alert("✅ Absences sauvegardées !");
      setAttendance({});
      handleSelectCours(selectedCours._id);
    } catch {
      alert("❌ Erreur sauvegarde");
    }
  };

  return (
    <div className="px-6 py-10 bg-gradient-to-br from-gray-100 via-white to-blue-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center flex items-center justify-center gap-3">
        <HiOutlineClipboardList className="text-5xl" /> Gestion des Absences Étudiantes
      </h1>

      <div className="mb-8 max-w-md mx-auto">
        <label className="block text-gray-700 font-semibold mb-2 text-lg">
          Cours disponibles :
        </label>
        <select
          onChange={(e) => handleSelectCours(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          defaultValue=""
        >
          <option value="" disabled>
            -- Sélectionner un cours --
          </option>
          {coursList.map((cours) => (
            <option key={cours._id} value={cours._id}>
              {cours.classe} - {cours.horaire} - {cours.semestre}
            </option>
          ))}
        </select>
      </div>

      {selectedCours?.etudiants?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {selectedCours.etudiants.map((etudiant, index) => {
            const isAbsent =
              attendance[etudiant._id] ?? (absences[etudiant._id] || []).includes(today);
            const totalAbs = absences[etudiant._id]?.length || 0;

            return (
              <motion.div
                key={etudiant._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-blue-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-10 h-10 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14.25c-2.485 0-4.5-2.01-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.015 4.5-4.5 4.5zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{etudiant.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {totalAbs} absence{totalAbs > 1 ? "s" : ""}
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => toggleLocalAbsence(etudiant._id)}
                  className={`w-full py-2 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-md transition-all duration-300 ${
                    isAbsent
                      ? "bg-red-600 hover:bg-red-700 shadow-red-400"
                      : "bg-green-600 hover:bg-green-700 shadow-green-400"
                  }`}
                >
                  {isAbsent ? (
                    <>
                      <FaTimesCircle className="text-xl" /> Absent
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-xl" /> Présent
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      ) : selectedCours ? (
        <p className="text-center text-gray-600 text-lg mt-16">Aucun étudiant inscrit à ce cours.</p>
      ) : null}

      {selectedCours && (
        <div className="text-center mt-12">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <FaCheckCircle className="text-2xl" /> Sauvegarder les absences
          </motion.button>
        </div>
      )}
    </div>
  );
}
