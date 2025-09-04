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
  Calendar,
  ArrowLeft,
  RefreshCw
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

      // On lance les deux requêtes en parallèle
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

      // 1) Traiter le quiz en priorité (l'UI ne dépend pas du chapitre)
      let q = null;
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        console.log("🔍 Quiz data:", quizData);

        if (quizData && typeof quizData === "object") {
          if ("quiz" in quizData && quizData.quiz) {
            q = quizData.quiz;
          } else if (Array.isArray(quizData.questions)) {
            // normalisation si le serveur renvoie directement {questions:[]}
            q = {
              _id: quizData._id ?? null,
              chapitreId,
              questions: quizData.questions,
              createdAt: quizData.createdAt,
              updatedAt: quizData.updatedAt,
            };
          } else if (quizData.exists === false) {
            q = null;
          }
        }
        setQuiz(q);
      } else if (quizRes.status === 404) {
        setQuiz(null);
      } else {
        const errorText = await quizRes.text();
        console.error("❌ Quiz API error:", errorText);
        throw new Error(`Erreur API quiz: ${quizRes.status}`);
      }

      // 2) Traiter le chapitre en best-effort (ne pas bloquer l'affichage du quiz)
      if (chapitreRes.ok) {
        const chapitreData = await chapitreRes.json();
        console.log("🔍 Chapitre data:", chapitreData);
        setChapitre(chapitreData);
      } else if (chapitreRes.status === 403) {
        console.warn("⛔ Accès au chapitre refusé pour ce compte (403)");
        setChapitre({ _id: chapitreId, titre: "Chapitre (accès restreint)" });
      } else if (chapitreRes.status === 404) {
        setChapitre(null);
      } else {
        const chapterErr = await chapitreRes.text();
        console.error("❌ Chapitre API error:", chapterErr);
        setChapitre(null);
      }
    } catch (err) {
      console.error("❌ Erreur fetchQuizData:", err);
      setErrorMessage(err.message);
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
      console.log("🔍 User info:", userInfo);
      console.log("🔍 Token:", token ? "Present" : "Missing");

      const res = await fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      console.log("🔍 Create quiz response status:", res.status);

      if (!res.ok) {
        const raw = await res.text();
        console.error("❌ Create quiz error:", raw);

        let messageServer = "";
        try {
          messageServer = JSON.parse(raw)?.message || "";
        } catch {
          // ignore
        }

        if (res.status === 404) {
          throw new Error("❌ Chapitre introuvable. Vérifiez que le chapitre existe.");
        }
        if (res.status === 403) {
          throw new Error("❌ Accès refusé. Vous n'enseignez pas ce cours.");
        }
        if (
          res.status === 400 &&
          (messageServer.toLowerCase().includes("existe déjà") ||
           messageServer.toLowerCase().includes("existe deja") ||
           messageServer.toLowerCase().includes("already exists"))
        ) {
          // Le quiz existe déjà : le charger et sortir proprement
          await fetchQuizData();
          setSuccessMessage("ℹ️ Un quiz existant a été chargé.");
          setTimeout(() => setSuccessMessage(""), 3000);
          return;
        }

        throw new Error(`❌ Erreur création quiz: ${res.status}`);
      }

      const data = await res.json();
      console.log("🔍 Created quiz data:", data);

      setQuiz(data?.quiz ?? null);
      setSuccessMessage("✅ Quiz créé avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Erreur création quiz:", err);
      setErrorMessage(err.message || "❌ Erreur création quiz");
      setTimeout(() => setErrorMessage(""), 4000);
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
      
      {/* Header avec bouton de retour */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => navigate('/prof/mes-cours')}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'} shadow-md hover:shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz du Chapitre</h1>
            <p className="text-gray-600">
              {chapitre ? `Chapitre: ${chapitre.titre}` : 'Chargement...'}
            </p>
          </div>
        </div>
        
        {/* Bouton de rafraîchissement */}
        <motion.button
          onClick={fetchQuizData}
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.div>
          <span className="text-sm font-medium">Actualiser</span>
        </motion.button>
      </div>

      {/* Messages d'erreur et de succès */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            key="quiz-error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="flex-1">{errorMessage}</span>
            <motion.button
              onClick={() => setErrorMessage("")}
              className="text-red-600 hover:text-red-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
        
        {successMessage && (
          <motion.div
            key="quiz-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="flex-1">{successMessage}</span>
            <motion.button
              onClick={() => setSuccessMessage("")}
              className="text-green-600 hover:text-green-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
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
                      key={question._id || index}
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
