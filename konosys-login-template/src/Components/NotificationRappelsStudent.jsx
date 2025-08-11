import React, { useState, useEffect } from "react";
import { Bell, CalendarCheck, ClipboardList, GraduationCap, Clock, Target, BookOpen, AlertCircle, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5001/api/rappelsEtudiant";

export default function NotificationRappelsStudent() {
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classe, setClasse] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.classe) setClasse(userInfo.classe);
  }, []);

  useEffect(() => {
    const fetchRappels = async () => {
      if (!classe) return;
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;
        const res = await fetch(`${API_URL}?classe=${encodeURIComponent(classe)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur chargement rappels");
        setRappels(data);
        setError("");
      } catch (err) {
        setError("❌ Impossible de charger les rappels.");
      } finally {
        setLoading(false);
      }
    };
    fetchRappels();
  }, [classe]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 text-sm font-medium">{error}</p>
      </motion.div>
    );
  }

  if (rappels.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ type: "tween", duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <Bell className="w-12 h-12 text-blue-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-base text-blue-600 font-medium mb-2">Aucun rappel</h3>
        <p className="text-blue-400 text-sm">Vous n'avez aucun rappel pour le moment</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Classe {classe}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-600 font-medium">
            {rappels.filter(r => r.fait).length} fait(s)
          </span>
          <span className="text-orange-600 font-medium">
            {rappels.filter(r => !r.fait).length} à faire
          </span>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {rappels.map((rappel, index) => (
          <motion.div
            key={rappel._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`p-2 rounded-xl border-2 transition-all duration-200 ${
              rappel.fait
                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className={`p-1 rounded-lg ${rappel.fait ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                {rappel.fait ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold capitalize text-blue-800">{rappel.type}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-700 font-medium truncate">{rappel.texte}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarCheck className="w-3 h-3" />
                  <span>{new Date(rappel.date).toLocaleDateString("fr-FR")}</span>
                  {rappel.professeur?.name && (
                    <>
                      <span>•</span>
                      <GraduationCap className="w-3 h-3" />
                      <span>{rappel.professeur.name}</span>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    rappel.fait ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {rappel.fait ? '✅ Terminé' : '⏰ En attente'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-2 border-t border-gray-200">
        <button
          onClick={() => window.location.href = '/student/rappels'}
          className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Voir tous mes rappels →
        </button>
      </motion.div>
    </div>
  );
} 