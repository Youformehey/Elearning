import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForumStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // id du message auquel on répond

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Charger les messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/${id}`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(data);
    } catch (err) {
      console.error("Erreur chargement forum :", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id, token]);

  // Envoi d'un nouveau message ou d'une réponse
  const handleSendMessage = async () => {
    if (!newMessageContent.trim()) return;

    const body = {
      content: newMessageContent,
      parentId: replyingTo, // optionnel, ignoré côté back si non utilisé
    };

    try {
      // IMPORTANT: pas de "/message" à la fin
      const res = await fetch(`/api/forum/${id}`, {
        method: "POST",
        headers: authHeaders, // contient déjà Content-Type + Authorization
        body: JSON.stringify(body),
      });

      // parse robuste pour éviter l’erreur si la réponse n'est pas JSON
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : { message: await res.text() };

      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      // reset + reload
      setNewMessageContent("");
      setReplyingTo(null);
      await fetchMessages();
    } catch (err) {
      console.error("Erreur envoi message :", err.message);
    }
  };

  // Fonction pour afficher les messages avec leurs réponses imbriquées
  const renderMessages = (msgs, parentId = null) => {
    return msgs
      .filter((msg) => (msg.parentId || null) === parentId)
      .map((msg, i) => (
        <motion.div
          key={msg._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={`bg-white border border-blue-200 p-4 rounded-xl shadow-sm ${parentId ? "ml-8" : ""}`}
        >
          <p className="text-sm font-semibold text-blue-700">
            {msg.senderName} <span className="text-gray-400 text-xs">({msg.senderRole})</span>
          </p>
          <p className="text-xs text-gray-400 mb-1">{new Date(msg.createdAt).toLocaleString()}</p>
          <p className="text-gray-700 text-sm whitespace-pre-line">{msg.content}</p>
          <button
            onClick={() => setReplyingTo(msg._id)}
            className="text-xs text-blue-500 hover:underline mt-2"
          >
            Répondre
          </button>

          {/* Afficher récursivement les réponses */}
          {renderMessages(msgs, msg._id)}
        </motion.div>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-blue-100 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">📚 Forum de Classe</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:underline"
          >
            ← Retour
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-4 p-4 bg-gray-50 border border-blue-100 rounded-xl shadow-inner mb-6">
          {loading ? (
            <p className="text-center text-gray-400 italic animate-pulse">Chargement...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 italic">Aucun message.</p>
          ) : (
            renderMessages(messages)
          )}
        </div>

        {/* Formulaire d'envoi */}
        <div className="mt-6">
          {replyingTo && (
            <div className="mb-2 text-sm text-gray-600">
              Réponse à un message{" "}
              <button
                onClick={() => setReplyingTo(null)}
                className="text-red-500 underline ml-2"
              >
                Annuler
              </button>
            </div>
          )}
          <textarea
            rows={4}
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder={replyingTo ? "Écrire votre réponse..." : "Écrire un nouveau message..."}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={!newMessageContent.trim()}
          >
            Envoyer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForumStudent;
