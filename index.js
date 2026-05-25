const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chatbot IA Online 🚀");
});

app.post("/webhook", async (req, res) => {
  try {

    const message =
      req.body.data?.body ||
      req.body.message ||
      "";

    const phone =
      req.body.data?.from ||
      "";

    if (!message) {
      return res.sendStatus(200);
    }

    // OPENAI
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista financeiro e atendimento empresarial."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      openaiResponse.data.choices[0].message.content;

    // ULTRAMSG
    await axios.post(
      `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
      {
        token: process.env.ULTRA_TOKEN,
        to: phone,
        body: reply
      }
    );

    res.sendStatus(200);

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
