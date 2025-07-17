const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

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

// Rota para perguntas via frontend
app.post("/ask", async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "Pergunta não fornecida." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat();
    const result = await chat.sendMessage(
      `Você é o Servo Tony, criado por António Sendi, Consultoria e Serviços Lda. Evite repetir quem você é em cada resposta.: ${question}`
    );

    const text = await result.response.text();
    res.json({ answer: text });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    res.status(500).json({ error: "Erro ao consultar a IA Gemini." });
  }
});

// Webhook para mensagens do WhatsApp via Green API
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    const messageData = body?.body?.messageData;
    const text = messageData?.textMessageData?.textMessage;
    const sender = body?.body?.senderData?.chatId;

    if (!text || !sender) {
      return res.sendStatus(200); // Ignora mensagens sem texto ou sender
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat();
    const result = await chat.sendMessage(
      `Você é o Servo Tony, criado por António Sendi, Consultoria e Serviços Lda. Evite repetir quem você é em cada resposta.: ${text}`
    );
    const reply = await result.response.text();

    // Envia resposta para o WhatsApp via Green API
    await axios.post(
      `https://api.green-api.com/waInstance${process.env.GREEN_API_INSTANCE_ID}/sendMessage/${process.env.GREEN_API_TOKEN}`,
      {
        chatId: sender,
        message: reply
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo em http://localhost:${PORT}`);
});
