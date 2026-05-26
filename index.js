const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// =========================
// SESSÕES ADMIN
// =========================

const adminSessions = {};

// =========================
// ADMIN
// =========================

const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";

// =========================
// STATUS
// =========================

app.get("/", (req, res) => {
  res.send("Agils IA Online 🚀");
});

// =========================
// WEBHOOK
// =========================

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
    // IGNORAR GRUPOS
    // =========================

    if (phone.includes("@g.us")) {
      return res.sendStatus(200);
    }

    // =========================
    // VERIFICAR BLOQUEIO
    // =========================

    const blocked =
      await prisma.blockedNumber.findUnique({
        where: {
          phone
        }
      });

    if (blocked) {

      console.log("Número bloqueado");

      return res.sendStatus(200);
    }

    // =========================
    // LOGIN
    // =========================

    if (message.startsWith("/login")) {

      const args =
        message.trim().split(" ");

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
            body:
              "✅ Login administrativo realizado com sucesso."
          }
        );

      } else {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body:
              "❌ Usuário ou senha inválidos."
          }
        );

      }

      return res.sendStatus(200);
    }

    // =========================
    // LOGOUT
    // =========================

    if (message.startsWith("/logout")) {

      delete adminSessions[phone];

      await axios.post(
        `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
        {
          token: process.env.ULTRA_TOKEN,
          to: phone,
          body:
            "🔒 Logout administrativo realizado."
        }
      );

      return res.sendStatus(200);
    }

    // =========================
    // RECUPERAR
    // =========================

    if (message.startsWith("/recuperar")) {

      const args =
        message.trim().split(" ");

      const pin = args[1];

      if (pin === ADMIN_PIN) {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body:
              `🔐 Usuário: ${ADMIN_USER}\nSenha: ${ADMIN_PASS}`
          }
        );

      } else {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body:
              "❌ PIN inválido."
          }
        );

      }

      return res.sendStatus(200);
    }

    // =========================
    // TREINAR IA
    // =========================

    if (
      message.startsWith("/treinar")
    ) {

      if (!adminSessions[phone]) {

        await axios.post(
          `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
          {
            token: process.env.ULTRA_TOKEN,
            to: phone,
            body:
              "⛔ Faça login administrativo."
          }
        );

        return res.sendStatus(200);
      }

      const novoPrompt =
        message.replace("/treinar", "").trim();

      await prisma.adminSettings.upsert({
        where: {
          id: 1
        },
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
          body:
            "✅ IA treinada com sucesso."
        }
      );

      return res.sendStatus(200);
    }

    // =========================
    // BLOQUEAR
    // =========================

    if (
      message.startsWith("/bloquear") &&
      adminSessions[phone]
    ) {

      const numero =
        message.replace("/bloquear", "").trim();

      await prisma.blockedNumber.create({
        data: {
          phone: numero
        }
      });

      await axios.post(
        `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
        {
          token: process.env.ULTRA_TOKEN,
          to: phone,
          body:
            `🚫 Número bloqueado: ${numero}`
        }
      );

      return res.sendStatus(200);
    }

    // =========================
    // DESBLOQUEAR
    // =========================

    if (
      message.startsWith("/desbloquear") &&
      adminSessions[phone]
    ) {

      const numero =
        message.replace("/desbloquear", "").trim();

      await prisma.blockedNumber.deleteMany({
        where: {
          phone: numero
        }
      });

      await axios.post(
        `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
        {
          token: process.env.ULTRA_TOKEN,
          to: phone,
          body:
            `✅ Número desbloqueado: ${numero}`
        }
      );

      return res.sendStatus(200);
    }

    // =========================
    // PROMPT SISTEMA
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
    // SALVAR MENSAGEM
    // =========================

    await prisma.message.create({
      data: {
        phone,
        role: "user",
        content: message
      }
    });

    // =========================
    // IA ANALISAR INTENÇÃO
    // =========================

    const intentResponse =
      await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                `
Analise a mensagem do usuário e identifique se ela representa:
- gasto
- agendamento
- cadastro cliente
- ou conversa normal

Responda APENAS JSON.

Exemplo:
{
 "type":"expense"
}

Tipos:
expense
appointment
client
chat
`
            },
            {
              role: "user",
              content: message
            }
          ]
        },
        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type":
              "application/json"
          }
        }
      );

    let intent = "chat";

    try {

      intent =
        JSON.parse(
          intentResponse.data
          .choices[0]
          .message
          .content
        ).type;

    } catch (e) {}

    // =========================
    // DETECTAR GASTO
    // =========================

    if (intent === "expense") {

      await prisma.expense.create({
        data: {
          phone,
          value: 0,
          category: "geral",
          description: message
        }
      });

    }

    // =========================
    // DETECTAR AGENDAMENTO
    // =========================

    if (intent === "appointment") {

      await prisma.appointment.create({
        data: {
          clientName: phone,
          date: "pendente",
          time: "pendente",
          note: message
        }
      });

    }

    // =========================
    // DETECTAR CLIENTE
    // =========================

    if (intent === "client") {

      await prisma.client.create({
        data: {
          name: phone,
          phone,
          serviceType: "consultoria"
        }
      });

    }

    // =========================
    // HISTÓRICO
    // =========================

    const historico =
      await prisma.message.findMany({
        where: {
          phone
        },
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
            "Content-Type":
              "application/json"
          }
        }
      );

    const reply =
      openaiResponse.data
      .choices[0]
      .message
      .content;

    // =========================
    // SALVAR RESPOSTA
    // =========================

    await prisma.message.create({
      data: {
        phone,
        role: "assistant",
        content: reply
      }
    });

    // =========================
    // RESPONDER WHATSAPP
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

// =========================
// PORTA
// =========================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  );

});
