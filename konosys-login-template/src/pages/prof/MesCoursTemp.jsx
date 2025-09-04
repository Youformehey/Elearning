import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircle,
  Users,
  FileText,
  BookOpen,
  Trash2,
  MessageCircle,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001/api";

export default function MesCoursTemp() {
  const [coursProf, setCoursProf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  async function fetchCourses() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoursProf(response.data);
    } catch (error) {
      setErrorMessage("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  }

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const deleteSelectedCourses = async () => {
    if (selectedCourses.length === 0) return;
    
    try {
      setIsDeleting(true);
      
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCourses.length} cours ?`)) {
        return;
      }

      await Promise.all(selectedCourses.map(async (courseId) => {
        await axios.delete(`${API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }));

      setCoursProf(prev => prev.filter(course => !selectedCourses.includes(course._id)));
      setSelectedCourses([]);
      setSuccessMessage(`${selectedCourses.length} cours supprimés avec succès`);
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression des cours");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Cours</h1>
        {selectedCourses.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={deleteSelectedCourses}
            disabled={isDeleting}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? 'Suppression...' : `Supprimer (${selectedCourses.length})`}
          </motion.button>
        )}
      </div>

      {/* Messages de notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coursProf.map((course) => (
          <motion.div
            key={course._id}
            layout
            className={`bg-white rounded-lg p-4 shadow-md ${
              selectedCourses.includes(course._id)
                ? 'ring-2 ring-blue-500'
                : 'hover:shadow-lg'
            } transition-all`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedCourses.includes(course._id)}
                onChange={() => toggleCourseSelection(course._id)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <h3 className="font-semibold">{course.nom}</h3>
                <p className="text-sm text-gray-600">{course.matiere?.nom || "Matière non définie"}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{course.students?.length || 0} étudiants</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
