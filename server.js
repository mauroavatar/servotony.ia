const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Verifica se a chave está definida
if (!process.env.GEMINI_API_KEY) {
  throw new Error("A chave da API Gemini não está definida no .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "Pergunta não fornecida." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Chat session obrigatório para gemini-2.0-flash
    const chat = model.startChat();
    const result = await chat.sendMessage(
      `Você é o Servo Tony, um coach virtual cristão, criado por António Sendi, Consultoria e Serviços Lda.
Responda com sabedoria questões acerca de Liderança com valores cristãos, Espiritualidade, fé e vida emocional, Trechos do programa "Minutos do Saber", Desenvolvimento pessoal e motivação diária.
Evite repetir quem você é em cada resposta. Vá direto ao conselho ou reflexão, com carinho e clareza.: ${question}`
    );

    const text = await result.response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    res.status(500).json({ error: "Erro ao consultar a IA Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
