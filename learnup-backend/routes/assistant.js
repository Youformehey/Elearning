const express = require("express");
const router = express.Router();
const axios = require("axios");

// Remplace par ta clé secrète OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // ou gpt-3.5-turbo
        messages: [
          { role: "system", content: "Tu es un assistant pédagogique pour élèves du primaire." },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erreur assistant IA:", error.message);
    res.status(500).json({ error: "Erreur côté assistant IA" });
  }
});

module.exports = router;
