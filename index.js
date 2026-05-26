const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

const adminSessions = {};

// CONFIGURAÇÕES ADMIN
const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";

// STATUS
app.get("/", (req, res) => {
  res.send("Agils IA Online 🚀");
});

// WEBHOOK
app.post("/webhook", async (req, res) => {

  try {

    const message =
      req.body.data?.body ||
      req.body.message ||
      "";

    const phone =
      req.body.data?.from ||
      "";

    console.log("Mensagem recebida:", message);

    if (!message) {
      return res.sendStatus(200);
    }

    // =========================
    // LOGIN ADMIN
    // =========================

    if (message.startsWith("/login")) {

      const args = message.trim().split(" ");

      const usuario = args[1];
      const senha = args[2];

      if (
        usuario === ADMIN_USER &&
        senha === ADMIN_PASS
      ) {

        adminSessions[phone] = true;

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body: "✅ Login administrativo realizado com sucesso."
          }
        );

      } else {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body: "❌ Usuário ou senha inválidos."
          }
        );

      }

      return res.sendStatus(200);
    }

    // =========================
    // RECUPERAR SENHA
    // =========================

    if (message.startsWith("/recuperar")) {

      const args = message.trim().split(" ");

      const pin = args[1];

      if (pin === ADMIN_PIN) {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body:
              `🔐 Recuperação autorizada.\n\nUsuário: ${ADMIN_USER}\nSenha: ${ADMIN_PASS}`
          }
        );

      } else {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body: "❌ PIN inválido."
          }
        );

      }

      return res.sendStatus(200);
    }

    // =========================
    // TREINAR IA
    // =========================

    if (
      message.startsWith("/treinar") &&
      adminSessions[phone]
    ) {

      const novoPrompt = message.replace("/treinar", "").trim();

      await prisma.adminSettings.upsert({
        where: { id: 1 },
        update: {
          systemPrompt: novoPrompt
        },
        create: {
          id: 1,
          systemPrompt: novoPrompt
        }
      });

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

    // =========================
    // BUSCAR PROMPT TREINADO
    // =========================

    const settings =
      await prisma.adminSettings.findFirst();

    const systemPrompt =
      settings?.systemPrompt ||
      "Você é uma IA empresarial inteligente.";

    // =========================
    // SALVAR USUÁRIO
    // =========================

    await prisma.user.upsert({
      where: {
        phone
      },
      update: {},
      create: {
        phone
      }
    });

    // =========================
    // SALVAR MENSAGEM USUÁRIO
    // =========================

    await prisma.message.create({
      data: {
        phone,
        role: "user",
        content: message
      }
    });

    // =========================
    // HISTÓRICO
    // =========================

    const historico =
      await prisma.message.findMany({
        where: { phone },
        orderBy: {
          createdAt: "asc"
        },
        take: 10
      });

    // =========================
    // OPENAI
    // =========================

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...historico.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const openaiResponse =
      await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages
        },
        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

    const reply =
      openaiResponse.data
      .choices[0]
      .message
      .content;

    // =========================
    // SALVAR RESPOSTA IA
    // =========================

    await prisma.message.create({
      data: {
        phone,
        role: "assistant",
        content: reply
      }
    });

    // =========================
    // ENVIAR WHATSAPP
    // =========================

    await axios.post(
      `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
      {
        token: process.env.ULTRA_TOKEN,
        to: phone,
        body: reply
      }
    );

    return res.sendStatus(200);

  } catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

    return res.sendStatus(500);
  }

});

// PORTA
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando na porta ${PORT}`
  );
});
