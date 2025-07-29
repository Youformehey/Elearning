import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Save,
  Eye,
  Target,
  Trophy,
  Star,
  Sparkles,
  Zap,
  BarChart3,
  FileText,
  Users,
  Clock,
  Calendar
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

const QuizPage = () => {
  const { id: chapitreId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapitre, setChapitre] = useState(null);
  const [course, setCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Formulaire pour ajouter une question
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    if (chapitreId) {
      fetchQuizData();
    }
  }, [chapitreId]);

  const fetchQuizData = async () => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("🔍 Fetching quiz for chapitreId:", chapitreId);
      
      // Récupérer les données du chapitre et du cours
      const [quizRes, chapitreRes] = await Promise.all([
        fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/chapitres/${chapitreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      console.log("🔍 Quiz response status:", quizRes.status);
      console.log("🔍 Chapitre response status:", chapitreRes.status);

      if (!quizRes.ok) {
        const errorData = await quizRes.text();
        console.error("❌ Quiz API error:", errorData);
        throw new Error(`Erreur API quiz: ${quizRes.status}`);
      }

      if (!chapitreRes.ok) {
        const errorData = await chapitreRes.text();
        console.error("❌ Chapitre API error:", errorData);
        throw new Error(`Erreur API chapitre: ${chapitreRes.status}`);
      }

      const quizData = await quizRes.json();
      const chapitreData = await chapitreRes.json();

      console.log("🔍 Quiz data:", quizData);
      console.log("🔍 Chapitre data:", chapitreData);

      setChapitre(chapitreData);
      
      // Récupérer les données du cours
      if (chapitreData.course) {
        const courseRes = await fetch(`${API_URL}/api/courses/${chapitreData.course}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData);
        }
      }

      if (quizData.exists) {
        setQuiz(quizData.quiz);
      } else {
        setQuiz(null);
      }
    } catch (err) {
      console.error("❌ Erreur chargement quiz:", err);
      setErrorMessage(`❌ Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      console.log("🔍 Creating quiz for chapitreId:", chapitreId);
      
      const res = await fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      console.log("🔍 Create quiz response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Create quiz error:", errorData);
        throw new Error(`Erreur création quiz: ${res.status}`);
      }

      const data = await res.json();
      console.log("🔍 Created quiz data:", data);
      
      setQuiz(data.quiz);
      setSuccessMessage("✅ Quiz créé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Erreur création quiz:", err);
      setErrorMessage(`❌ ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleAddQuestion = async () => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    if (!newQuestion.trim() || newOptions.some(opt => !opt.trim()) || correctIndex === null) {
      setErrorMessage("❌ Veuillez remplir tous les champs et sélectionner la bonne réponse");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      console.log("🔍 Adding question for chapitreId:", chapitreId);
      console.log("🔍 Question data:", { question: newQuestion, options: newOptions, correctIndex });
      
      const res = await fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}/question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: newQuestion,
          options: newOptions,
          correctIndex,
        }),
      });

      console.log("🔍 Add question response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Add question error:", errorData);
        throw new Error(`Erreur ajout question: ${res.status}`);
      }

      const data = await res.json();
      console.log("🔍 Added question data:", data);
      
      setQuiz(data.quiz);
      setNewQuestion("");
      setNewOptions(["", "", "", ""]);
      setCorrectIndex(null);
      setShowAddForm(false);
      setSuccessMessage("✅ Question ajoutée avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Erreur ajout question:", err);
      setErrorMessage(`❌ ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    if (!window.confirm("Voulez-vous vraiment supprimer cette question ?")) return;

    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      console.log("🔍 Deleting question:", questionId, "for chapitreId:", chapitreId);
      
      const res = await fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}/question/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔍 Delete question response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Delete question error:", errorData);
        throw new Error(`Erreur suppression question: ${res.status}`);
      }

      // Recharger le quiz
      await fetchQuizData();
      setSuccessMessage("✅ Question supprimée avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Erreur suppression question:", err);
      setErrorMessage(`❌ ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-700 font-medium"
          >
            Chargement du quiz...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">
      
      {/* Header ultra-moderne avec effets 3D */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8 px-10 shadow-2xl relative overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Effet de brillance amélioré */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          animate={{ x: [-200, 400] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Effet de particules */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-4 left-1/4 w-2 h-2 bg-white rounded-full" />
          <div className="absolute top-8 right-1/3 w-1 h-1 bg-white rounded-full" />
          <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Titre et icône avec effets 3D */}
            <motion.div 
              className="flex items-center gap-8"
              whileHover={{ scale: 1.02 }}
            >
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/25 backdrop-blur-md rounded-2xl text-white hover:bg-white/35 transition-all duration-200 shadow-lg"
              >
                <BookOpen className="w-6 h-6" />
              </motion.button>
              <motion.div 
                className="p-5 bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden"
                whileHover={{ scale: 1.2, rotate: 15, y: -10 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Effet de brillance sur l'icône */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-50, 50] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <Target className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Quiz du Chapitre
                </motion.h1>
                <motion.p 
                  className="text-blue-100 font-medium text-xl"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {chapitre?.titre || "Chapitre"}
                </motion.p>
                {course && (
                  <motion.p 
                    className="text-blue-200 font-medium text-lg"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {course.nom} — {course.classe}
                  </motion.p>
                )}
              </div>
            </motion.div>
            
            {/* Statistiques avec effets 3D */}
            <motion.div 
              className="flex items-center gap-10"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">{quiz?.questions?.length || 0}</div>
                <div className="text-blue-100 text-sm font-medium">Questions</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">3</div>
                <div className="text-blue-100 text-sm font-medium">Maximum</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/15 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                whileHover={{ scale: 1.15, y: -8, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
              >
                <div className="text-4xl font-bold text-white mb-1">{quiz ? "✅" : "❌"}</div>
                <div className="text-blue-100 text-sm font-medium">Quiz Créé</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Messages de notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-base backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-base backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="space-y-8"
        >
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {!quiz && (
              <motion.button
                onClick={handleCreateQuiz}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Plus className="w-6 h-6" />
                Créer le Quiz
              </motion.button>
            )}

            {quiz && quiz.questions.length < 3 && (
              <motion.button
                onClick={() => setShowAddForm(!showAddForm)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Plus className="w-6 h-6" />
                Ajouter une Question
              </motion.button>
            )}
          </motion.div>

          {/* Formulaire d'ajout de question */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-3 bg-white/20 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Ajouter une Question</h2>
                      <p className="text-blue-100 font-medium">Question {quiz?.questions?.length + 1 || 1} sur 3</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowAddForm(false)}
                    whileHover={{ scale: 1.1 }}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Entrez votre question..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg resize-none h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Options de réponse
                  </label>
                  <div className="space-y-3">
                    {newOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correct"
                          checked={correctIndex === index}
                          onChange={() => setCorrectIndex(index)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOpts = [...newOptions];
                            newOpts[index] = e.target.value;
                            setNewOptions(newOpts);
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleAddQuestion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                >
                  <Save className="w-5 h-5" />
                  Ajouter la Question
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Liste des questions */}
          {quiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {quiz.questions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 p-12 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl text-blue-600 font-medium mb-2">Aucune question</h3>
                  <p className="text-blue-400">Ajoutez des questions pour créer le quiz</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <motion.div
                      key={question._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="p-3 bg-white/20 rounded-xl"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <FileText className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                Question {index + 1}
                              </h3>
                              <p className="text-blue-100 font-medium">
                                {question.question}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteQuestion(question._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <motion.div
                              key={optionIndex}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                                optionIndex === question.correctIndex
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              {optionIndex === question.correctIndex ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={`font-medium ${
                                optionIndex === question.correctIndex
                                  ? 'text-emerald-700'
                                  : 'text-gray-700'
                              }`}>
                                {option}
                              </span>
                              {optionIndex === question.correctIndex && (
                                <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                  Bonne réponse
                                </span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
