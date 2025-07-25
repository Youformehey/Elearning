// src/components/ChapterCard.jsx
import React, { useState } from "react";
import { Folder, ClipboardCheck } from "lucide-react";
import { Btn, InputModern } from "./UI";

export default function ChapterCard({ chapitre, coursId, onRegister }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch(
        `/api/courses/${coursId}/chapitres/${chapitre._id}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      onRegister(chapitre._id, email);
      setEmail("");
    } catch (e) {
      alert("Erreur d’inscription : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-inner space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{chapitre.titre}</h4>
        <span className="text-sm text-gray-500">
          {chapitre.progression ?? 0}%
        </span>
      </div>

      <div className="flex gap-2">
        <Btn variant="light" onClick={() => alert("Quiz " + chapitre._id)}>
          <ClipboardCheck size={16} /> Quiz
        </Btn>
        <Btn variant="light" onClick={() => alert("Docs " + chapitre._id)}>
          <Folder size={16} /> Documents
        </Btn>
      </div>

      <div className="flex gap-2 items-end">
        <InputModern
          label="Inscrire (email)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Btn
          variant="primary"
          disabled={loading || !email}
          onClick={handleRegister}
        >
          {loading ? "..." : "Inscrire"}
        </Btn>
      </div>
    </div>
  );
}
