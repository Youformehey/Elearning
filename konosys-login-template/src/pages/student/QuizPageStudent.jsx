import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
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
  Play,
  Award,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

const QuizPageStudent = () => {
  const { id: chapitreId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [quiz, setQuiz] = useState(null);
  const [chapitre, setChapitre] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false); // Indicateur de sauvegarde

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Fonction pour sauvegarder les réponses dans localStorage
  const saveAnswersToStorage = (answers) => {
    if (!chapitreId) {
      console.error("❌ chapitreId manquant pour la sauvegarde");
      return false;
    }
    
    const storageKey = `quiz_answers_${chapitreId}`;
    try {
      const answersString = JSON.stringify(answers);
      localStorage.setItem(storageKey, answersString);
      console.log("💾 Réponses sauvegardées:", answers, "pour la clé:", storageKey);
      console.log("💾 Taille des données:", answersString.length, "caractères");
      return true;
    } catch (error) {
      console.error("❌ Erreur sauvegarde localStorage:", error);
      return false;
    }
  };

  // Fonction pour charger les réponses depuis localStorage
  const loadAnswersFromStorage = () => {
    if (!chapitreId) {
      console.error("❌ chapitreId manquant pour le chargement");
      return {};
    }
    
    const storageKey = `quiz_answers_${chapitreId}`;
    console.log("📂 Tentative de chargement des réponses pour la clé:", storageKey);
    
    try {
      const savedAnswers = localStorage.getItem(storageKey);
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        console.log("✅ Réponses chargées:", parsed);
        return parsed;
      } else {
        console.log("❌ Aucune réponse sauvegardée trouvée");
        return {};
      }
    } catch (error) {
      console.error("❌ Erreur parsing réponses sauvegardées:", error);
      return {};
    }
  };

  // Fonction pour réinitialiser les réponses
  const resetAnswers = () => {
    setUserAnswers({});
    const storageKey = `quiz_answers_${chapitreId}`;
    localStorage.removeItem(storageKey);
    setSuccessMessage("✅ Réponses réinitialisées !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  useEffect(() => {
    if (chapitreId) {
      fetchQuizData();
    }
  }, [chapitreId]);

  // Charger les réponses sauvegardées après que le quiz soit chargé
  useEffect(() => {
    console.log("🔄 useEffect triggered - quiz:", quiz ? quiz._id : "null", "chapitreId:", chapitreId);
    if (quiz && chapitreId) {
      console.log("🔄 Chargement des réponses depuis la base de données pour quiz:", quiz._id, "chapitre:", chapitreId);
      loadAnswersFromDatabase();
    } else {
      console.log("🔄 Conditions non remplies pour charger les réponses");
      console.log("🔄 quiz:", quiz ? "présent" : "absent");
      console.log("🔄 chapitreId:", chapitreId);
    }
  }, [quiz, chapitreId]);

  // Fonction pour charger les réponses depuis la base de données
  const loadAnswersFromDatabase = async () => {
    if (!chapitreId || !quiz) {
      console.error("❌ chapitreId ou quiz manquant pour le chargement");
      return;
    }

    try {
      console.log("🔍 Chargement des réponses depuis la base de données...");
      
      const response = await fetch(`${API_URL}/api/quiz-responses/${quiz._id}/${chapitreId}/answers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Réponse API:", data);
        
        if (data.success && data.answers && Object.keys(data.answers).length > 0) {
          console.log("✅ Réponses trouvées:", data.answers);
          setUserAnswers(data.answers);
          setSuccessMessage("✅ Réponses restaurées");
          setTimeout(() => setSuccessMessage(""), 2000);
        } else {
          console.log("⚠️ Aucune réponse en base, essai localStorage");
          // Essayer localStorage
          const localAnswers = loadAnswersFromStorage();
          if (Object.keys(localAnswers).length > 0) {
            console.log("✅ Réponses trouvées dans localStorage:", localAnswers);
            setUserAnswers(localAnswers);
            setSuccessMessage("✅ Réponses restaurées depuis localStorage");
            setTimeout(() => setSuccessMessage(""), 2000);
          }
        }
      } else {
        console.error("❌ Erreur API:", response.status);
        // Essayer localStorage en cas d'erreur
        const localAnswers = loadAnswersFromStorage();
        if (Object.keys(localAnswers).length > 0) {
          console.log("✅ Réponses trouvées dans localStorage:", localAnswers);
          setUserAnswers(localAnswers);
          setSuccessMessage("✅ Réponses restaurées depuis localStorage");
          setTimeout(() => setSuccessMessage(""), 2000);
        }
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      // Essayer localStorage en cas d'erreur réseau
      const localAnswers = loadAnswersFromStorage();
      if (Object.keys(localAnswers).length > 0) {
        console.log("✅ Réponses trouvées dans localStorage:", localAnswers);
        setUserAnswers(localAnswers);
        setSuccessMessage("✅ Réponses restaurées depuis localStorage");
        setTimeout(() => setSuccessMessage(""), 2000);
      }
    }
  };

  // Log pour déboguer l'état
  useEffect(() => {
    console.log("🔍 État:", { 
      userAnswers: userAnswers,
      userAnswersCount: Object.keys(userAnswers).length,
      quiz: quiz ? "✓" : "✗",
      chapitreId: chapitreId ? "✓" : "✗"
    });
  }, [finalScore, userAnswers, quiz, chapitreId]);

  const fetchQuizData = async () => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("🔍 Fetching quiz for chapitreId:", chapitreId);
      
      // Récupérer les données du quiz, chapitre et cours
      const [quizRes, chapitreRes] = await Promise.all([
        fetch(`${API_URL}/api/quiz/chapitre/${chapitreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/chapitres/student/${chapitreId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      console.log("🔍 Quiz response status:", quizRes.status);
      console.log("🔍 Chapitre response status:", chapitreRes.status);

      if (!quizRes.ok) {
        const errorData = await quizRes.text();
        console.error("❌ Quiz API error:", errorData);
        
        // Si c'est une erreur 404, cela signifie qu'aucun quiz n'existe encore
        if (quizRes.status === 404) {
          console.log("🔍 Aucun quiz trouvé, c'est normal");
          setQuiz(null);
        } else {
          throw new Error(`Erreur API quiz: ${quizRes.status}`);
        }
      } else {
        const quizData = await quizRes.json();
        console.log("🔍 Quiz data:", quizData);
        
        if (quizData.exists) {
          setQuiz(quizData.quiz);
        } else {
          setQuiz(null);
        }
      }

      if (!chapitreRes.ok) {
        const errorData = await chapitreRes.text();
        console.error("❌ Chapitre API error:", errorData);
        throw new Error(`Erreur API chapitre: ${chapitreRes.status}`);
      }

      const chapitreData = await chapitreRes.json();
      console.log("🔍 Chapitre data:", chapitreData);
      setChapitre(chapitreData);
      
      // Récupérer les données du cours
      if (chapitreData.course) {
        // Extraire l'ID du cours (peut être un objet ou un string)
        const courseId = typeof chapitreData.course === 'object' ? chapitreData.course._id : chapitreData.course;
        
        console.log("🔍 Course ID:", courseId);
        
        const courseRes = await fetch(`${API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData);
        }
      }
    } catch (err) {
      console.error("❌ Erreur chargement quiz:", err);
      setErrorMessage(`❌ Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionIndex, answerIndex) => {
    console.log("🎯 Réponse sélectionnée:", { questionIndex, answerIndex, chapitreId, finalScore });
    console.log("🎯 Réponses actuelles:", userAnswers);
    
    const newAnswers = {
      ...userAnswers,
      [questionIndex]: answerIndex
    };
    
    console.log("📝 Nouvelles réponses:", newAnswers);
    setUserAnswers(newAnswers);
    
    // Indicateur de sauvegarde
    setSaving(true);
    
    // Sauvegarder automatiquement les réponses
    let savedToDatabase = false;
    
    // Essayer de sauvegarder en base de données d'abord
    if (chapitreId && quiz) {
      console.log("💾 Tentative de sauvegarde en base de données pour quizId:", quiz._id);
      
      try {
        const response = await fetch(`${API_URL}/api/quiz-responses/${quiz._id}/${chapitreId}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionIndex,
            answerIndex
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Réponse sauvegardée en base de données:", data);
          savedToDatabase = true;
          setSuccessMessage("✅ Réponse sauvegardée");
          setTimeout(() => setSuccessMessage(""), 2000);
        } else {
          console.error("❌ Erreur sauvegarde en base de données:", response.status);
          const errorText = await response.text();
          console.error("❌ Détails de l'erreur:", errorText);
        }
      } catch (error) {
        console.error("❌ Erreur réseau lors de la sauvegarde:", error);
      }
    } else {
      console.log("⚠️ chapitreId ou quiz non défini, utilisation du localStorage");
    }
    
    // Fallback vers localStorage si la sauvegarde en base échoue ou n'est pas possible
    if (!savedToDatabase) {
      console.log("🔄 Fallback vers localStorage...");
      const saved = saveAnswersToStorage(newAnswers);
      if (saved) {
        console.log("✅ Réponses sauvegardées dans localStorage");
        setSuccessMessage("✅ Réponse sauvegardée localement");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        console.error("❌ Échec de la sauvegarde dans localStorage");
        setErrorMessage("❌ Impossible de sauvegarder la réponse");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
    
    // Arrêter l'indicateur de sauvegarde
    setTimeout(() => setSaving(false), 1000);
  };

  const handleSubmitQuiz = async () => {
    if (!chapitreId) {
      setErrorMessage("❌ ID du chapitre manquant");
      return;
    }

    if (!quiz || Object.keys(userAnswers).length < quiz.questions.length) {
      setErrorMessage("❌ Veuillez répondre à toutes les questions avant de soumettre");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      console.log("🔍 Submitting quiz for chapitreId:", chapitreId);
      console.log("🔍 Quiz ID:", quiz._id);
      console.log("🔍 Answers:", userAnswers);
      
      const res = await fetch(`${API_URL}/api/quiz-responses/${quiz._id}/${chapitreId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: userAnswers }),
      });

      console.log("🔍 Submit quiz response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Submit quiz error:", errorData);
        throw new Error(`Erreur soumission quiz: ${res.status}`);
      }

      const data = await res.json();
      console.log("🔍 Submit quiz data:", data);
      
      if (data.success) {
        setFinalScore(data.result);
        setSuccessMessage("✅ Quiz soumis avec succès !");
        
        // Nettoyer les réponses sauvegardées après soumission réussie
        const storageKey = `quiz_answers_${chapitreId}`;
        localStorage.removeItem(storageKey);
        
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.message || "Erreur lors de la soumission");
      }
    } catch (err) {
      console.error("❌ Erreur soumission quiz:", err);
      setErrorMessage(`❌ ${err.message}`);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSubmitting(false);
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] flex items-center justify-center relative overflow-hidden">
        {/* Effets de fond animés */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-20 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
          className="text-center relative z-10"
        >
          <motion.div
            className="p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 mb-8"
            whileHover={{ scale: 1.02, y: -5 }}
             transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 mx-auto mb-6 p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-full"
            >
              <Target className="w-16 h-16 text-pink-600" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎯 Aucun quiz disponible
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Le professeur n'a pas encore créé de quiz pour ce chapitre
            </motion.p>
            
            <motion.div
              className="flex items-center justify-center gap-4 text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Quiz en préparation</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Bientôt disponible</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux cours
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#edf3ff] to-[#f9fcff] overflow-hidden text-gray-800">

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

      <div className="max-w-4xl mx-auto px-6 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "tween", duration: 0.5, ease: "easeInOut" }}
          className="space-y-8"
        >
          {/* Bouton retour intégré */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start mb-6"
          >
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour aux cours</span>
            </motion.button>
          </motion.div>

          {/* Instructions */}
          {!finalScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200/50 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{ 
                    y: 0,
                    rotate: 0
                  }}
                  transition={{ 
                    type: "tween", 
                    stiffness: 300,
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Play className="w-8 h-8 text-pink-600" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">🎯 Instructions</h2>
                  <p className="text-lg text-gray-600 mt-2">Répondez à toutes les questions pour valider le quiz !</p>
                </div>
              </div>
              
              {/* Statistiques avec animations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="text-3xl font-bold text-blue-600">{quiz.questions.length}</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-700">Questions</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div className="text-3xl font-bold text-emerald-600">{Object.keys(userAnswers).length}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">Répondues</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div className="text-3xl font-bold text-amber-600">{quiz.questions.length - Object.keys(userAnswers).length}</div>
                  </div>
                  <div className="text-sm font-semibold text-amber-700">Restantes</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: questionIndex * 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-pink-600 to-red-600 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="p-4 bg-white/25 rounded-2xl shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      animate={{ 
                        y: 0,
                        rotate: 0
                      }}
                      transition={{ 
                        type: "tween", 
                        stiffness: 300,
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <FileText className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        🎯 Question {questionIndex + 1}
                      </h3>
                      <p className="text-pink-100 font-medium text-lg">
                        {question.question}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswers[questionIndex] === optionIndex;
                      const isCorrect = optionIndex === question.correctIndex;
                      const isWrong = isSelected && !isCorrect;
                      const showResult = isSelected; // Montrer le résultat dès qu'une réponse est sélectionnée

                      return (
                        <motion.div
                          key={optionIndex}
                          whileHover={userAnswers[questionIndex] === undefined ? { scale: 1.02, y: -2 } : {}}
                          whileTap={userAnswers[questionIndex] === undefined ? { scale: 0.98 } : {}}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
                            userAnswers[questionIndex] === undefined 
                              ? 'cursor-pointer hover:shadow-xl' 
                              : 'cursor-not-allowed opacity-80'
                          } ${
                            showResult
                              ? isCorrect
                                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300'
                                : isWrong
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                                : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
                              : isSelected
                              ? 'bg-gradient-to-r from-pink-50 to-red-50 border-pink-300'
                              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 hover:from-pink-50 hover:to-red-50 hover:border-pink-300'
                          }`}
                          onClick={() => {
                            console.log("🖱️ Clic sur option:", { questionIndex, optionIndex, finalScore });
                            // Empêcher de modifier la réponse si elle est déjà sélectionnée
                            if (!finalScore && userAnswers[questionIndex] === undefined) {
                              handleAnswer(questionIndex, optionIndex);
                            }
                          }}
                        >
                          {showResult ? (
                            isCorrect ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                              </motion.div>
                            ) : isWrong ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                <XCircle className="w-6 h-6 text-red-600" />
                              </motion.div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )
                          ) : (
                            <motion.div 
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'bg-gradient-to-r from-pink-500 to-red-500 border-pink-500' : 'border-gray-300'
                              }`}
                              animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-white rounded-full"
                                />
                              )}
                            </motion.div>
                          )}
                          <span className={`font-semibold text-lg ${
                            showResult
                              ? isCorrect
                                ? 'text-emerald-700'
                                : isWrong
                                ? 'text-red-700'
                                : 'text-gray-700'
                              : isSelected
                              ? 'text-pink-700'
                              : 'text-gray-700'
                          }`}>
                            {option}
                          </span>
                          {showResult && isCorrect && (
                            <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                              Bonne réponse
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Message de feedback immédiat */}
                  {userAnswers[questionIndex] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl border-2"
                      style={{
                        backgroundColor: userAnswers[questionIndex] === question.correctIndex 
                          ? 'rgb(236 253 245)' // bg-emerald-50
                          : 'rgb(254 242 242)', // bg-red-50
                        borderColor: userAnswers[questionIndex] === question.correctIndex 
                          ? 'rgb(16 185 129)' // border-emerald-500
                          : 'rgb(239 68 68)' // border-red-500
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {userAnswers[questionIndex] === question.correctIndex ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">✅ Bonne réponse !</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-700 font-semibold">
                              ❌ Mauvaise réponse. La bonne réponse était : <strong>{question.options[question.correctIndex]}</strong>
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        🔒 Réponse verrouillée - Vous ne pouvez plus modifier cette réponse
                      </div>
                    </motion.div>
                  )}

                  {finalScore && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200"
                    >
                      <div className="flex items-center gap-2">
                        {userAnswers[questionIndex] === question.correctIndex ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Bonne réponse !</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-700 font-semibold">
                              Mauvaise réponse. La bonne réponse était : {question.options[question.correctIndex]}
                            </span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Boutons d'action */}
          {!finalScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              {/* Bouton réinitialiser */}
              {Object.keys(userAnswers).length > 0 && (
                <motion.button
                  onClick={resetAnswers}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ type: "tween", duration: 2, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  <span>🔄 Réinitialiser les réponses</span>
                </motion.button>
              )}
              
              {/* Bouton soumettre */}
              <motion.button
                onClick={handleSubmitQuiz}
                disabled={submitting || Object.keys(userAnswers).length < quiz.questions.length}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-4 px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl transition-all duration-300 ${
                  submitting || Object.keys(userAnswers).length < quiz.questions.length
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-3xl hover:shadow-4xl'
                }`}
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6" />
                    </motion.div>
                    <span>Soumission...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                    >
                      <Trophy className="w-6 h-6" />
                    </motion.div>
                    <span>🎯 Soumettre le Quiz</span>
                  </>
                )}
              </motion.button>
              
              {Object.keys(userAnswers).length < quiz.questions.length && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-gray-500 font-medium"
                >
                  ⚠️ Répondez à toutes les questions pour pouvoir soumettre
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Résultats finaux */}
          {finalScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200/50 p-8 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-full">
                  <Award className="w-16 h-16 text-pink-600" />
                </div>
              </motion.div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
                🎉 Quiz terminé !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div className="text-3xl font-bold text-emerald-600">{finalScore.score}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">Bonnes réponses</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="text-3xl font-bold text-blue-600">{finalScore.totalQuestions}</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-700">Questions totales</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -3 }}
                  animate={{ y: 0 }}
                  transition={{ type: "tween", duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <div className="text-3xl font-bold text-amber-600">{Math.round(finalScore.percentage)}%</div>
                  </div>
                  <div className="text-sm font-semibold text-amber-700">Score</div>
                </motion.div>
              </div>

              <motion.div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                  finalScore.percentage >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : finalScore.percentage >= 50
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {finalScore.percentage >= 70 ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    Excellent !
                  </>
                ) : finalScore.percentage >= 50 ? (
                  <>
                    <Star className="w-5 h-5" />
                    Bien !
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Continuez à réviser !
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPageStudent;
