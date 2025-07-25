import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";


export default function SettingsProfesseur() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Utilisation du ThemeContext global
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Erreur récupération utilisateur :", err);
      }
    };

    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/users/update",
        { ...user, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Informations mises à jour !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className={`p-8 min-h-screen transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold mb-6">Paramètres du compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium mb-1">Nom</label>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)} // ✅ via contexte
          />
          <label>Mode sombre</label>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
