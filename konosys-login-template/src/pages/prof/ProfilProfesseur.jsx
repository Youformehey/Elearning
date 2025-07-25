import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilProfesseur() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("userEmail") || "sofo@gmail.com";

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/teachers/profile?email=${email}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post("http://localhost:5001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.fileUrl;
      setProfile((prev) => ({ ...prev, photo: imageUrl }));
    } catch (err) {
      console.error("Erreur upload image :", err);
      alert("Erreur lors de l'upload de l'image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("http://localhost:5001/api/teachers", profile);
      alert("✅ Profil mis à jour !");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };

  if (!profile) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen text-gray-500 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Chargement du profil...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-10 px-4 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8 border border-gray-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Image + Upload */}
        <motion.div
          className="relative group cursor-pointer w-48 h-48 rounded-full overflow-hidden border-8 border-blue-600 shadow-xl mx-auto md:mx-0"
          whileHover={{ scale: 1.1, boxShadow: "0 15px 30px rgba(59, 130, 246, 0.6)" }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <img
            src={`http://localhost:5001${profile.photo || "/uploads/default-avatar.png"}`}
            alt="Photo de profil"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "http://localhost:5001/uploads/default-avatar.png";
            }}
          />
          <label
            htmlFor="upload-photo"
            className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
            title="Changer la photo"
          >
            <Pencil size={20} />
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </motion.div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 select-none text-center md:text-left">Mon Profil</h2>

          {["email", "matiere", "tel", "adresse"].map((field) => (
            <div key={field} className="flex flex-col">
              <label
                htmlFor={field}
                className="mb-2 font-semibold text-gray-700 capitalize select-none"
              >
                {field === "tel" ? "Téléphone" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={profile[field] || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out"
                required={field !== "adresse"}
              />
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 shadow-lg transition-transform"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
