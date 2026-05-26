const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

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

    console.log("Mensagem recebida:", message);

    // CRIAR USUÁRIO
    await prisma.user.upsert({
      where: {
        phone
      },
      update: {},
      create: {
        phone
      }
    });

    // SALVAR MENSAGEM USUÁRIO
    await prisma.message.create({
      data: {
        phone,
        role: "user",
        content: message
      }
    });

    // COMANDO ADMIN TREINAR IA
    if (message.startsWith("/treinar ")) {

      const newPrompt =
        message.replace("/treinar ", "");

      const existingSettings =
        await prisma.adminSettings.findFirst();

      if (existingSettings) {

        await prisma.adminSettings.update({
          where: {
            id: existingSettings.id
          },
          data: {
            systemPrompt: newPrompt
          }
        });

      } else {

        await prisma.adminSettings.create({
          data: {
            systemPrompt: newPrompt
          }
        });

      }

      await axios.post(
        `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
        {
          token: process.env.ULTRA_TOKEN,
          to: phone,
          body: "✅ IA treinada com sucesso."
        }
      );

      return res.sendStatus(200);
    }

    // BUSCAR CONFIG ADMIN
    const adminSettings =
      await prisma.adminSettings.findFirst();

    const systemPrompt =
      adminSettings?.systemPrompt ||
      "Você é um especialista financeiro e atendimento empresarial.";

    // HISTÓRICO
    const history = await prisma.message.findMany({
      where: {
        phone
      },
      orderBy: {
        createdAt: "asc"
      },
      take: 10
    });

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // OPENAI
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages
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

    // SALVAR RESPOSTA IA
    await prisma.message.create({
      data: {
        phone,
        role: "assistant",
        content: reply
      }
    });

    // ENVIAR WHATSAPP
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

    console.log(
      error.response?.data ||
      error.message
    );

    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {

  console.log(`Servidor rodando na porta ${PORT}`);

  try {

    await prisma.$connect();

    console.log("Banco conectado 🚀");

  } catch (err) {

    console.log("Erro banco:", err);

  }

});
