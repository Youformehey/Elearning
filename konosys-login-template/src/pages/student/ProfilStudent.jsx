import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ProfilStudent() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

    axios
      .get("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Erreur chargement profil étudiant :", err));
  }, []);

  if (!profile)
    return (
      <div className="text-center py-10 animate-pulse text-gray-600">
        Chargement du profil...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-3xl border">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-10 text-center">
          🎓 Mon Profil
        </h2>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            src={`http://localhost:5000${profile.photo || "/uploads/default-avatar.png"}`}
            alt="Avatar élève"
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-600 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "http://localhost:5000/uploads/default-avatar.png";
            }}
          />

          <div className="flex-1 space-y-4 w-full">
            <Field label="Nom complet" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Classe" value={profile.classe} />
            <Field label="Téléphone" value={profile.tel} />
            <Field label="Adresse" value={profile.adresse} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        {label}
      </label>
      <div className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-800 shadow-sm">
        {value || <span className="italic text-gray-400">Non renseigné</span>}
      </div>
    </div>
  );
}
