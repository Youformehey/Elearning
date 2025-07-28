import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const API_URL = "http://localhost:5001";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pour ajout question (prof)
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);

  // Pour étudiant
  const [userAnswers, setUserAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const role = userInfo?.role;

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prof : ajout question
  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || newOptions.some((opt) => !opt.trim()) || correctIndex === null) {
      alert("Merci de remplir tous les champs et choisir la bonne réponse.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/quiz/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question: newQuestion,
          options: newOptions,
          correctIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNewQuestion("");
      setNewOptions(["", "", "", ""]);
      setCorrectIndex(null);
      fetchQuestions();
    } catch (err) {
      alert("Erreur ajout question : " + err.message);
    }
  };

  // Prof : supprimer question
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm("Supprimer cette question ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/quiz/question/${qId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      fetchQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  // Étudiant : sélection réponse
  const handleAnswer = (qIndex, answerIndex) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: answerIndex }));
  };

  // Étudiant : soumission
  const handleSubmitQuiz = () => {
    if (questions.length && Object.keys(userAnswers).length < questions.length) {
      alert("Répondez à toutes les questions avant de soumettre.");
      return;
    }
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctIndex) score++;
    });
    setFinalScore(score);
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;

  return (
    <div className={`min-h-screen p-6 max-w-4xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-indigo-50'}`}>
      <button onClick={() => navigate(-1)} className="text-indigo-600 underline mb-6">
        ← Retour
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Quiz</h1>

      {role === "teacher" && (
        <div style={{
          marginBottom: 36,
          padding: 24,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 12px #2563eb11',
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          animation: 'fadeInSlide 0.7s',
        }}>
          <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Ajouter une question</h2>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e0e7ff', fontSize: 15, marginBottom: 14 }}
          />
          {newOptions.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                style={{ accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...newOptions];
                  newOpts[i] = e.target.value;
                  setNewOptions(newOpts);
                }}
                style={{ flex: 1, padding: 9, borderRadius: 8, border: '1px solid #e0e7ff', fontSize: 15 }}
              />
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            style={{ marginTop: 18, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 6px #2563eb22', transition: 'background 0.2s' }}
          >
            Ajouter la question
          </button>
        </div>
      )}
      {/* Liste questions (prof) */}
      {role === "teacher" && (
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {questions.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>Aucune question pour ce quiz.</p>}
          {questions.map((q, index) => (
            <div key={q._id || index} style={{ background: '#f6faff', border: '1px solid #e3e8f0', borderRadius: 12, boxShadow: '0 2px 8px #2563eb0a', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'fadeInSlide 0.5s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ fontWeight: 600, color: '#2563eb', fontSize: 16, margin: 0 }}>{index + 1}. {q.question}</h3>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  style={{ background: 'none', color: '#b91c1c', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', padding: '2px 8px', borderRadius: 6, transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background='#fee2e2'}
                  onMouseOut={e => e.currentTarget.style.background='none'}
                >
                  Supprimer
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 18 }}>
                {q.options.map((opt, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 15, color: i === q.correctIndex ? '#059669' : '#334155', fontWeight: i === q.correctIndex ? 700 : 400 }}>
                    {i === q.correctIndex && <span style={{ background: '#bbf7d0', color: '#059669', borderRadius: 6, padding: '2px 8px', fontSize: 13, fontWeight: 700, marginRight: 6 }}>Bonne réponse</span>}
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton soumettre (étudiant) */}
      {finalScore === null && role === "student" && questions.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleSubmitQuiz}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
          >
            Soumettre mes réponses
          </button>
        </div>
      )}

      {/* Affichage score final */}
      {finalScore !== null && (
        <p className="mt-8 text-center text-xl font-bold text-green-600">
          🎉 Score final : {finalScore} / {questions.length}
        </p>
      )}
    </div>
  );
};

export default QuizPage;
