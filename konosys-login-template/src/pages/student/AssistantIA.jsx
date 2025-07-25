import React, { useState } from "react";
import axios from "axios";

export default function AssistantIA() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Bonjour ! Pose-moi une question sur l'école ou tes devoirs ✨" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/assistant/ask", { message: input });
      const botReply = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Je n'ai pas compris..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🤖 Assistant IA</h2>
      <div className="h-64 overflow-y-auto border p-4 rounded bg-gray-50 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.role === "bot"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Assistant en train de répondre...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
