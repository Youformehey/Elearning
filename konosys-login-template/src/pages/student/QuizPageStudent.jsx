import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5001";

const QuizPageStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAnswer = (qIndex, answerIndex) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: answerIndex }));
  };

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

      {/* Liste questions */}
      <div className="space-y-6">
        {questions.length === 0 && <p>Aucune question pour ce quiz.</p>}

        {questions.map((q, index) => {
          const isSelected = userAnswers[index] !== undefined;
          const isCorrect = finalScore !== null && userAnswers[index] === q.correctIndex;
          return (
            <div
              key={q._id || index}
              className="bg-white p-6 rounded shadow flex flex-col gap-4"
            >
              <h3 className="font-semibold">{index + 1}. {q.question}</h3>

              <div className="flex flex-col gap-2">
                {q.options.map((opt, i) => {
                  const checked = userAnswers[index] === i;
                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-2 rounded border cursor-pointer
                        ${finalScore === null
                          ? "hover:bg-indigo-100"
                          : i === q.correctIndex
                          ? "bg-green-100 border-green-400"
                          : checked
                          ? "bg-red-100 border-red-400"
                          : "bg-gray-100"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${index}`}
                        disabled={finalScore !== null}
                        checked={checked}
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
          );
        })}
      </div>

      {/* Bouton soumettre */}
      {finalScore === null && questions.length > 0 && (
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

export default QuizPageStudent;
