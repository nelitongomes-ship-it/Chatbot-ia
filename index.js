const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// =====================================================
// CONFIG
// =====================================================

const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";

const adminSessions = {};
const userCooldown = {};

// =====================================================
// STATUS
// =====================================================

app.get("/", (req, res) => {
  res.send("Agils IA Online 🚀");
});

// =====================================================
// FUNÇÃO ENVIAR WHATSAPP
// =====================================================

async function sendMessage(to, body) {

  await axios.post(
    `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
    {
      token: process.env.ULTRA_TOKEN,
      to,
      body
    }
  );

}

// =====================================================
// WEBHOOK
// =====================================================

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

    // =====================================================
    // IGNORAR GRUPOS
    // =====================================================

    if (phone.includes("@g.us")) {
      return res.sendStatus(200);
    }

    // =====================================================
    // ANTI SPAM
    // =====================================================

    const now = Date.now();

    if (
      userCooldown[phone] &&
      now - userCooldown[phone] < 3000
    ) {

      return res.sendStatus(200);

    }

    userCooldown[phone] = now;

    // =====================================================
    // BLOQUEADOS
    // =====================================================

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

    // =====================================================
    // LOGIN
    // =====================================================

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

        await sendMessage(
          phone,
          "✅ Login administrativo realizado."
        );

      } else {

        await sendMessage(
          phone,
          "❌ Usuário ou senha inválidos."
        );

      }

      return res.sendStatus(200);
    }

    // =====================================================
    // LOGOUT
    // =====================================================

    if (message.startsWith("/logout")) {

      delete adminSessions[phone];

      await sendMessage(
        phone,
        "🔒 Logout administrativo realizado."
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // RECUPERAR SENHA
    // =====================================================

    if (message.startsWith("/recuperar")) {

      const args =
        message.trim().split(" ");

      const pin = args[1];

      if (pin === ADMIN_PIN) {

        await sendMessage(
          phone,
          `🔐 Usuário: ${ADMIN_USER}\nSenha: ${ADMIN_PASS}`
        );

      } else {

        await sendMessage(
          phone,
          "❌ PIN inválido."
        );

      }

      return res.sendStatus(200);
    }

    // =====================================================
    // TREINAR IA
    // =====================================================

    if (message.startsWith("/treinar")) {

      if (!adminSessions[phone]) {

        await sendMessage(
          phone,
          "⛔ Faça login administrativo."
        );

        return res.sendStatus(200);
      }

      const novoPrompt =
        message.replace("/treinar", "").trim();

      if (!novoPrompt) {

        await sendMessage(
          phone,
          "⚠️ Digite um treinamento."
        );

        return res.sendStatus(200);
      }

      const currentSettings =
        await prisma.adminSettings.findFirst();

      if (currentSettings) {

        await prisma.adminSettings.update({
          where: {
            id: currentSettings.id
          },
          data: {
            systemPrompt:
              currentSettings.systemPrompt +
              "\n\n━━━━━━━━━━━━━━━\nNOVO TREINAMENTO\n━━━━━━━━━━━━━━━\n\n" +
              novoPrompt
          }
        });

      } else {

        await prisma.adminSettings.create({
          data: {
            systemPrompt: novoPrompt
          }
        });

      }

      await sendMessage(
        phone,
        "✅ IA treinada com sucesso.\n🧠 Conhecimento acumulado."
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // BLOQUEAR
    // =====================================================

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

      await sendMessage(
        phone,
        `🚫 Número bloqueado: ${numero}`
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // DESBLOQUEAR
    // =====================================================

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

      await sendMessage(
        phone,
        `✅ Número desbloqueado: ${numero}`
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // CADASTRAR CLIENTE
    // =====================================================

    if (
      message.startsWith("/cadastrarcliente") &&
      adminSessions[phone]
    ) {

      const dados =
        message.replace("/cadastrarcliente", "")
        .trim()
        .split("|");

      const nome = dados[0]?.trim();
      const telefone = dados[1]?.trim();
      const servico = dados[2]?.trim();

      if (
        !nome ||
        !telefone ||
        !servico
      ) {

        await sendMessage(
          phone,
          "⚠️ Formato:\n/cadastrarcliente Nome | Telefone | Serviço"
        );

        return res.sendStatus(200);
      }

      await prisma.client.create({
        data: {
          name: nome,
          phone: telefone,
          serviceType: servico
        }
      });

      await sendMessage(
        phone,
        `✅ Cliente cadastrado.\n\n👤 ${nome}`
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // CONSULTAR CLIENTE
    // =====================================================

    if (
      message.startsWith("/cliente") &&
      adminSessions[phone]
    ) {

      const nome =
        message.replace("/cliente", "").trim();

      const cliente =
        await prisma.client.findFirst({
          where: {
            name: {
              contains: nome,
              mode: "insensitive"
            }
          }
        });

      if (!cliente) {

        await sendMessage(
          phone,
          "❌ Cliente não encontrado."
        );

        return res.sendStatus(200);
      }

      await sendMessage(
        phone,
`
👤 CLIENTE ENCONTRADO

Nome: ${cliente.name}
Telefone: ${cliente.phone}
Serviço: ${cliente.serviceType}
`
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // AGENDAMENTO
    // =====================================================

    if (
      message.startsWith("/agendar")
    ) {

      const dados =
        message.replace("/agendar", "")
        .trim()
        .split("|");

      const nome = dados[0]?.trim();
      const data = dados[1]?.trim();
      const hora = dados[2]?.trim();
      const descricao = dados[3]?.trim();

      if (
        !nome ||
        !data ||
        !hora ||
        !descricao
      ) {

        await sendMessage(
          phone,
          "⚠️ Formato:\n/agendar Nome | Data | Hora | Descrição"
        );

        return res.sendStatus(200);
      }

      await prisma.appointment.create({
        data: {
          clientName: nome,
          date: data,
          time: hora,
          description: descricao
        }
      });

      await sendMessage(
        phone,
`
📅 Agendamento realizado

Cliente: ${nome}
Data: ${data}
Hora: ${hora}
Descrição: ${descricao}
`
      );

      return res.sendStatus(200);
    }
// =====================================================
// LIMPAR HISTÓRICO
// =====================================================

if (
  message.startsWith("/limparhistorico") &&
  adminSessions[phone]
) {

  const numero =
    message.replace("/limparhistorico", "").trim();

  // VALIDAR
  if (!numero) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/limparhistorico 5511999999999"
    );

    return res.sendStatus(200);
  }

  // APAGAR MENSAGENS
  await prisma.message.deleteMany({
    where: {
      phone: numero
    }
  });

  // CONFIRMAÇÃO
  await sendMessage(
    phone,
    `🗑️ Histórico apagado com sucesso.\n\nNúmero: ${numero}`
  );

  return res.sendStatus(200);
}
    // =====================================================
    // PROMPT SISTEMA
    // =====================================================

    const settings =
      await prisma.adminSettings.findFirst();

    const systemPrompt =
      settings?.systemPrompt ||
      "Você é uma IA empresarial inteligente.";

    // =====================================================
    // SALVAR USER
    // =====================================================

    await prisma.user.upsert({
      where: {
        phone
      },
      update: {},
      create: {
        phone
      }
    });

    // =====================================================
    // SALVAR MSG USER
    // =====================================================

    await prisma.message.create({
      data: {
        phone,
        role: "user",
        content: message
      }
    });

    // =====================================================
    // HISTÓRICO
    // =====================================================

    const historico =
      await prisma.message.findMany({
        where: {
          phone
        },
        orderBy: {
          createdAt: "asc"
        },
        take: 30
      });

    // =====================================================
    // OPENAI
    // =====================================================

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
          messages,
          temperature: 0.7
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

    // =====================================================
    // SALVAR MSG IA
    // =====================================================

    await prisma.message.create({
      data: {
        phone,
        role: "assistant",
        content: reply
      }
    });

    // =====================================================
    // RESPONDER
    // =====================================================

    await sendMessage(
      phone,
      reply
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

// =====================================================
// PORTA
// =====================================================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  );

});
