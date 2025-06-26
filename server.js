// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializar Gemini com a chave da API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(express.static("public"));
app.post("/ask", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "Pergunta não fornecida." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [{ text: `Responda como Servo Tony IA, um conselheiro cristão: ${question}` }],
      },
    ]);

    const response = result.response;
    const text = response.text();
    res.json({ answer: text });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    res.status(500).json({ error: "Erro ao consultar a IA Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
