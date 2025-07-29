import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowLeft, Eye, Download, Star, CheckCircle, AlertCircle } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5001";

export default function GererDevoirs() {
  const [cours, setCours] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [titles, setTitles] = useState({});
  const [uploadingFor, setUploadingFor] = useState(null);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState({});
  const [showSubmissionsFor, setShowSubmissionsFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalFile, setGlobalFile] = useState(null);
  const [globalUploading, setGlobalUploading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Charger les cours du prof
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCourses();
  }, [token, navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/courses/teacher`, {
      headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error("Erreur chargement cours");
      }
      
      const data = await res.json();
      console.log("Cours chargés:", data);
      setCours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement cours:", err);
      setError(err.message);
      setCours([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les rendus d'un devoir
  const loadSubmissions = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/devoirs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Erreur chargement devoirs");
      const devoirs = await res.json();
      
      // Pour chaque devoir, charger les soumissions
      const submissionsData = {};
      for (const devoir of devoirs) {
        const submissionsRes = await fetch(`${API_URL}/api/courses/${courseId}/devoirs/${devoir._id}/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (submissionsRes.ok) {
          const data = await submissionsRes.json();
          submissionsData[devoir._id] = data;
        }
      }
      
      setHomeworkSubmissions(prev => ({ ...prev, [courseId]: submissionsData }));
    } catch (err) {
      console.error("Erreur chargement soumissions:", err);
      alert("Erreur lors du chargement des soumissions");
    }
  };

  const handleFileChange = (e, courseId) => {
    setSelectedFiles((prev) => ({ ...prev, [courseId]: e.target.files[0] }));
    setUploadingFor(courseId);
  };

  const handleTitleChange = (e, courseId) => {
    setTitles((prev) => ({ ...prev, [courseId]: e.target.value }));
  };

  const handleUpload = async (courseId) => {
    const file = selectedFiles[courseId];
    const title = titles[courseId];

    if (!file) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    if (!title) {
      alert("Veuillez entrer un titre pour le devoir");
      return;
    }

    setUploadingFor(courseId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const res = await fetch(`${API_URL}/api/courses/${courseId}/devoirs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'upload course ID gerer devoirs");
      }

      const data = await res.json();
      alert("✅ Devoir uploadé avec succès !");
      
      // Réinitialiser les champs
      setSelectedFiles(prev => ({ ...prev, [courseId]: null }));
      setTitles(prev => ({ ...prev, [courseId]: "" }));
      
      // Recharger les cours pour voir les mises à jour
      fetchCourses();
    } catch (err) {
      console.error("Erreur upload:", err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setUploadingFor(null);
    }
  };

  const handleGlobalFileChange = (e) => {
    setGlobalFile(e.target.files[0]);
  };

  const handleGlobalUpload = async () => {
    if (!globalFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    if (!globalTitle.trim()) {
      alert("Veuillez entrer un titre pour le devoir");
      return;
    }

    setGlobalUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", globalFile);
      formData.append("title", globalTitle.trim());

      // Upload global (pour tous les cours du prof)
      const res = await fetch(`${API_URL}/api/courses/devoirs/global`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

  

      const data = await res.json();
      alert("✅ Devoir uploadé avec succès pour tous vos cours !");
      
      // Réinitialiser les champs
      setGlobalFile(null);
      setGlobalTitle("");
      
      // Recharger les cours pour voir les mises à jour
      fetchCourses();
    } catch (err) {
      console.error("Erreur upload global:", err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setGlobalUploading(false);
    }
  };

  const handleVoirRendus = (courseId) => {
    loadSubmissions(courseId);
  };

  const handleGradeSubmission = async (courseId, devoirId, submissionId, grade, comment) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/devoirs/${devoirId}/submissions/${submissionId}/grade`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ grade, comment })
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la notation");
      }

      alert("✅ Note ajoutée avec succès !");
      
      // Recharger les soumissions pour voir les mises à jour
      loadSubmissions(courseId);
    } catch (err) {
      console.error("Erreur notation:", err);
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header avec bouton retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
        onClick={() => navigate("/prof/cours")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-lg`}
      >
        <ArrowLeft size={20} />
            Retour aux cours
          </motion.button>
        </motion.div>

        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          }`}>
            📚 Gérer les Devoirs
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Téléchargez des devoirs et consultez les rendus des étudiants
          </p>
        </motion.div>

        {/* Section Upload Global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mb-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden ${
            darkMode ? 'bg-gray-800/80' : 'bg-white/80'
          }`}
        >
          <div className={`px-8 py-6 font-bold text-lg ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white' 
              : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900'
          }`}>
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Upload className="text-white" size={24} />
              </motion.div>
              <span className="uppercase tracking-wide">📤 Envoyer un Devoir</span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titre du devoir */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  📝 Titre du devoir
                </label>
                <input
                  type="text"
                  placeholder="Ex: Devoir de mathématiques - Chapitre 3"
                  value={globalTitle}
                  onChange={(e) => setGlobalTitle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:outline-none transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400/30' 
                      : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400/30'
                  }`}
                />
              </div>

              {/* Upload de fichier */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  📎 Fichier du devoir
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  globalFile 
                    ? darkMode 
                      ? 'border-blue-400 bg-blue-900/20' 
                      : 'border-blue-400 bg-blue-50'
                    : darkMode 
                      ? 'border-gray-600 hover:border-blue-400' 
                      : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <input
                    type="file"
                    onChange={handleGlobalFileChange}
                    className="hidden"
                    id="global-file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <label 
                    htmlFor="global-file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-4 rounded-xl ${
                        globalFile 
                          ? darkMode ? 'bg-blue-600' : 'bg-blue-500'
                          : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      {globalFile ? (
                        <CheckCircle className={`w-8 h-8 ${
                          darkMode ? 'text-white' : 'text-white'
                        }`} />
                      ) : (
                        <Upload className={`w-8 h-8 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      )}
                    </motion.div>
                    <div>
                      <p className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {globalFile ? "✅ Fichier sélectionné" : "Cliquez pour sélectionner un fichier"}
                      </p>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {globalFile ? globalFile.name : "PDF, DOC, TXT, JPG, PNG acceptés"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bouton Upload */}
            <motion.button
              onClick={handleGlobalUpload}
              disabled={globalUploading || !globalFile || !globalTitle.trim()}
              whileHover={!globalUploading && globalFile && globalTitle.trim() ? { scale: 1.02 } : {}}
              whileTap={!globalUploading && globalFile && globalTitle.trim() ? { scale: 0.98 } : {}}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                globalUploading || !globalFile || !globalTitle.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {globalUploading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Upload className="w-6 h-6" />
                  <span>Envoyer le devoir à tous mes étudiants</span>
                </div>
              )}
            </motion.button>

            <div className={`text-center text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              💡 Ce devoir sera automatiquement visible par tous les étudiants de vos cours
            </div>
          </div>
        </motion.div>

        {/* Liste des cours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Chargement de vos cours...
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-lg text-red-400">
                  Erreur: {error}
                </p>
              </div>
            </motion.div>
          ) : cours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText className={`w-24 h-24 mx-auto mb-6 ${
                  darkMode ? 'text-gray-400' : 'text-gray-300'
                }`} />
              </motion.div>
              <h3 className={`text-2xl font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Aucun cours disponible
              </h3>
              <p className={`text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Créez d'abord des cours pour pouvoir gérer les devoirs
              </p>
            </motion.div>
          ) : (
            cours.map((cours) => (
              <motion.div
                key={cours._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`rounded-3xl shadow-2xl border overflow-hidden transform transition-all duration-300 ${
                  darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
                } hover:shadow-3xl`}
              >
                {/* Header du cours avec gradient moderne */}
                <div className={`px-8 py-8 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <motion.div 
                        className={`p-4 rounded-2xl ${
                          darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FileText className={`w-8 h-8 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </motion.div>
                      <div>
                        <h3 className={`text-2xl font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {cours.classe} - {cours.semestre}
                        </h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          📅 {new Date(cours.date).toLocaleDateString("fr-FR")} à {cours.horaire}
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          📚 {cours.matiere?.nom || "Matière"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu du cours avec design moderne */}
                <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="space-y-6">
                    {/* Titre du devoir */}
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        📝 Titre du devoir
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Devoir de mathématiques - Chapitre 3"
                        value={titles[cours._id] || ""}
                        onChange={(e) => handleTitleChange(e, cours._id)}
                        className={`w-full px-5 py-4 rounded-2xl border-2 focus:ring-4 focus:outline-none transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400/30' 
                            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-400/30'
                        }`}
                      />
                    </div>

                    {/* Upload de fichier avec design amélioré */}
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        📎 Fichier du devoir
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                        selectedFiles[cours._id]
                          ? darkMode 
                            ? 'border-blue-400 bg-blue-900/20' 
                            : 'border-blue-400 bg-blue-50'
                          : darkMode 
                            ? 'border-gray-600 hover:border-blue-400' 
                            : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, cours._id)}
                          className="hidden"
                          id={`file-${cours._id}`}
                        />
                        <label 
                          htmlFor={`file-${cours._id}`}
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-6 rounded-2xl ${
                              selectedFiles[cours._id]
                                ? darkMode ? 'bg-blue-600' : 'bg-blue-500'
                                : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                          >
                            {selectedFiles[cours._id] ? (
                              <CheckCircle className={`w-10 h-10 ${
                                darkMode ? 'text-white' : 'text-white'
                              }`} />
                            ) : (
                              <Upload className={`w-10 h-10 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                            )}
                          </motion.div>
                          <div>
                            <p className={`font-semibold text-lg ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {selectedFiles[cours._id] ? "✅ Fichier sélectionné" : "Cliquez pour sélectionner un fichier"}
                            </p>
                            <p className={`text-sm mt-1 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {selectedFiles[cours._id] ? selectedFiles[cours._id].name : "PDF, DOC, TXT, JPG, PNG acceptés"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Boutons d'action avec design moderne */}
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => handleUpload(cours._id)}
                        disabled={uploadingFor === cours._id || !selectedFiles[cours._id] || !titles[cours._id]?.trim()}
                        whileHover={uploadingFor !== cours._id && selectedFiles[cours._id] && titles[cours._id]?.trim() ? { scale: 1.05 } : {}}
                        whileTap={uploadingFor !== cours._id && selectedFiles[cours._id] && titles[cours._id]?.trim() ? { scale: 0.95 } : {}}
                        className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          uploadingFor === cours._id || !selectedFiles[cours._id] || !titles[cours._id]?.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : darkMode
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg'
                        }`}
                      >
                        {uploadingFor === cours._id ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Upload className="w-5 h-5" />
                            <span>Envoyer le devoir</span>
                          </div>
                        )}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleVoirRendus(cours._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          darkMode
                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Eye className="w-5 h-5" />
                          <span>Voir les rendus</span>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* État vide */}
        {cours.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl shadow-2xl border p-12 text-center ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className={`w-24 h-24 mx-auto mb-6 ${
                darkMode ? 'text-gray-400' : 'text-gray-300'
              }`} />
            </motion.div>
            <h3 className={`text-2xl font-medium mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Aucun cours disponible
            </h3>
            <p className={`text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Créez d'abord des cours pour pouvoir gérer les devoirs
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
