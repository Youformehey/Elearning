import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const userId = userInfo?.id;
  const userRole = userInfo?.role;
  const userName = userInfo?.name;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchMessages = async () => {
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

    fetchMessages();
  }, [id, token]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ content: input }),
      });

      const newMessage = await res.json();
      if (!res.ok) throw new Error(newMessage.message);

      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (err) {
      alert("Erreur envoi message : " + err.message);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Supprimer ce message ?")) return;

    try {
      const res = await fetch(`/api/forum/message/${messageId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("Suppression échouée");
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      alert("Erreur suppression message : " + err.message);
    }
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
            messages.map((msg, i) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white border border-blue-200 p-4 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      {msg.senderName === userName ? "Vous" : msg.senderName} <span className="text-gray-400 text-xs">({msg.senderRole})</span>
                    </p>
                    <p className="text-xs text-gray-400 mb-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                  {userRole === msg.senderRole && userName === msg.senderName && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="text-red-400 hover:text-red-600 ml-3"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4"
        >
          <input
            type="text"
            className="flex-1 border border-blue-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md"
            title="Envoyer"
          >
            <FiSend />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForumPage;