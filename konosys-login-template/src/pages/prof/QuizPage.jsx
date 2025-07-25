import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5001";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-indigo-50 p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-indigo-600 underline mb-6">
        ← Retour
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Quiz</h1>

      {role === "teacher" && (
        <div className="mb-8 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Ajouter une question</h2>

          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />

          {newOptions.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="cursor-pointer"
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
                className="flex-grow p-2 border rounded"
              />
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Ajouter la question
          </button>
        </div>
      )}

      {/* Liste questions */}
      <div className="space-y-6">
        {questions.length === 0 && <p>Aucune question pour ce quiz.</p>}

        {questions.map((q, index) => (
          <div
            key={q._id || index}
            className="bg-white p-6 rounded shadow flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{index + 1}. {q.question}</h3>
              {role === "teacher" && (
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const isSelected = userAnswers[index] === i;
                const isCorrect = finalScore !== null && i === q.correctIndex;
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded border cursor-pointer
                      ${finalScore === null
                        ? "hover:bg-indigo-100"
                        : isCorrect
                        ? "bg-green-100 border-green-400"
                        : isSelected
                        ? "bg-red-100 border-red-400"
                        : "bg-gray-100"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`q-${index}`}
                      disabled={finalScore !== null}
                      checked={isSelected}
                      onChange={() => handleAnswer(index, i)}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>

            {finalScore !== null && (
              <p className={`mt-2 font-medium ${
                userAnswers[index] === q.correctIndex ? "text-green-600" : "text-red-600"
              }`}>
                {userAnswers[index] === q.correctIndex
                  ? "✅ Bonne réponse"
                  : `❌ Mauvaise réponse, la bonne était : ${q.options[q.correctIndex]}`}
              </p>
            )}
          </div>
        ))}
      </div>

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
