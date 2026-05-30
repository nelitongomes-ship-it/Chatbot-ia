
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const { PrismaClient } = require("@prisma/client");

const modo1 = require("./modo1");
const modo2 = require("./modo2");
const modo3 = require("./modo3");
const modo4 = require("./modo4");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// =====================================================
// CONFIGURAÇÕES
// =====================================================

const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";

const adminSessions = {};
const userCooldown = {};
const pendingDeletes = {};

// =====================================================
// STATUS
// =====================================================

app.get("/", (req, res) => {
  res.send("Agils IA Online 🚀");
});

// =====================================================
// ENVIAR WHATSAPP
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

    let message =
      req.body.data?.body ||
      req.body.message ||
      "";

    const phone =
      req.body.data?.from ||
      "";
if (req.body.data?.fromMe) {
  return res.sendStatus(200);
}
// =====================================================
// =====================================================
// ÁUDIO WHATSAPP
// =====================================================

let audioText = "";

if (
  req.body.data?.type === "audio"
) {

  try {

    await sendMessage(
      phone,
      "🎤 Áudio recebido. Transcrevendo..."
    );

    const audioUrl =
  req.body.data?.url ||
  req.body.data?.media;

    console.log("URL AUDIO:", audioUrl);

    // =====================================================
    // BAIXAR ÁUDIO
    // =====================================================

    const audioResponse =
      await axios({
        method: "GET",
        url: audioUrl,
        responseType: "arraybuffer"
      });

    const timestamp =
      Date.now();

    const audioPath =
      `./audio_${timestamp}.ogg`;

    const mp3Path =
      `./audio_${timestamp}.mp3`;

    fs.writeFileSync(
      audioPath,
      audioResponse.data
    );

    // =====================================================
    // CONVERTER MP3
    // =====================================================

    await new Promise((resolve, reject) => {

      ffmpeg(audioPath)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(mp3Path);

    });

    // =====================================================
    // WHISPER
    // =====================================================

    const form =
      new FormData();

    form.append(
      "file",
      fs.createReadStream(mp3Path)
    );

    form.append(
      "model",
      "whisper-1"
    );

    const whisper =
      await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        form,
        {
          timeout: 60000,
          headers: {
            Authorization:
              `Bearer ${process.env.OPENAI_API_KEY}`,
            ...form.getHeaders()
          }
        }
      );

    audioText =
  whisper.data.text;

console.log(
  "TEXTO WHISPER:",
  audioText
);

message =
  audioText;

message =
  message
    .replace(/\n/g, " ")
    .trim();

console.log(
  "Áudio convertido:",
  audioText
);

    // =====================================================
    // APAGAR
    // =====================================================

    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    if (fs.existsSync(mp3Path)) {
      fs.unlinkSync(mp3Path);
    }

  } catch (error) {

    console.log(
      "ERRO ÁUDIO:",
      error.response?.data ||
      error.message ||
      error
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui entender o áudio."
    );

    return res.sendStatus(200);
  }
           }
      
    // =====================================================
    // IGNORAR GRUPOS
    // =====================================================

    if (phone.includes("@g.us")) {
      return res.sendStatus(200);
    }

    // =====================================================
    // LIMITAR TAMANHO MSG
    // =====================================================

    if (message.length > 2000) {

      await sendMessage(
        phone,
        "⚠️ Mensagem muito grande."
      );

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
      await prisma.blockedNumber.findFirst({
        where: {
          phone
        }
      });

    if (blocked) {

      console.log("Número bloqueado");

      return res.sendStatus(200);
    }

    // =====================================================
    // LOGIN ADMIN
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
    // RESETAR TREINAMENTO
    // =====================================================

    if (
      message.startsWith("/resettreino") &&
      adminSessions[phone]
    ) {

      await prisma.adminSettings.deleteMany();

      await prisma.adminSettings.create({
        data: {
          systemPrompt:
            "Você é uma IA empresarial profissional."
        }
      });

      await sendMessage(
        phone,
        "🧠 Treinamentos resetados com sucesso."
      );

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

  
  const bloqueado =
  await prisma.blockedNumber.findFirst({
    where: {
      phone: numero
    }
  });


  if (!bloqueado) {

  await prisma.blockedNumber.create({
    data: {
      phone: numero
    }
  });

}

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
  const cpf = dados[2]?.trim();
  const senha = dados[3]?.trim();
  const plano = dados[4]?.trim();

  if (
    !nome ||
    !telefone ||
    !cpf ||
    !senha ||
    !plano
  ) {

    await sendMessage(
      phone,
`⚠️ FORMATO CORRETO

/cadastrarcliente Nome | Telefone | CPF | Senha | Plano

Exemplo:

/cadastrarcliente João Silva | 16999999999 | 12345678900 | 1234 | BASICO

PLANOS DISPONÍVEIS:

• BASICO
• COMPLETO
• AGILS_CRED

🔒 Apenas administradores autorizados podem realizar cadastros.`
    );

    return res.sendStatus(200);
  }

  const telefoneLimpo = telefone
    .replace("@c.us", "")
    .replace(/\D/g, "");

  const telefoneFinal =
    telefoneLimpo.startsWith("55")
      ? telefoneLimpo
      : "55" + telefoneLimpo;

  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) {
    await sendMessage(
      phone,
      "❌ CPF inválido. Informe os 11 números do CPF."
    );

    return res.sendStatus(200);
  }

  const planoFinal = plano.toUpperCase();

  if (
    planoFinal !== "BASICO" &&
    planoFinal !== "COMPLETO" &&
    planoFinal !== "AGILS_CRED"
  ) {

    await sendMessage(
      phone,
      "❌ Plano inválido. Utilize BASICO, COMPLETO ou AGILS_CRED."
    );

    return res.sendStatus(200);
  }

  const existingClient =
    await prisma.client.findFirst({
      where: {
        phone: telefoneFinal
      }
    });

  if (existingClient) {

    await sendMessage(
      phone,
      "⚠️ Cliente já cadastrado."
    );

    return res.sendStatus(200);
  }

  let modo = "SEM_CADASTRO";

  if (planoFinal === "BASICO") {
    modo = "BASICO";
  }

  if (planoFinal === "COMPLETO") {
    modo = "COMPLETO";
  }

  if (planoFinal === "AGILS_CRED") {
    modo = "AGILS_CRED";
  }

  await prisma.client.create({
    data: {
      name: nome,
      phone: telefoneFinal,
      
      password: senha,
      planType: planoFinal,
      serviceType: planoFinal,
      aiMode: modo,
      isActive: true
    }
  });

  await sendMessage(
    phone,
`
✅ CLIENTE CADASTRADO COM SUCESSO

👤 Nome: ${nome}
📱 Telefone: ${telefoneFinal}
🆔 CPF: ${cpfLimpo}
📦 Plano: ${planoFinal}
🤖 Modo IA: ${modo}
🔐 Senha: ${senha}
🟢 Status: ATIVO
`
  );

  return res.sendStatus(200);
}
    // =====================================================
// ALTERAR SENHA
// =====================================================

if (
  message.startsWith("/alterarsenha") &&
  adminSessions[phone]
) {

  const dados =
    message.replace("/alterarsenha", "")
    .trim()
    .split("|");

  const telefone = dados[0]?.trim();
  const novaSenha = dados[1]?.trim();

  if (!telefone || !novaSenha) {

    await sendMessage(
      phone,
`⚠️ Use:

/alterarsenha Telefone | NovaSenha`
    );

    return res.sendStatus(200);
  }

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      password: novaSenha
    }
  });

  await sendMessage(
    phone,
`🔐 Senha alterada com sucesso

📱 ${telefone}`
  );

  return res.sendStatus(200);
  }

    // =====================================================
// ALTERAR PLANO
// =====================================================

if (
  message.startsWith("/alterarplano") &&
  adminSessions[phone]
) {

  const dados =
    message.replace("/alterarplano", "")
    .trim()
    .split("|");

  const telefone = dados[0]?.trim();
  const novoPlano = dados[1]?.trim();

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      planType: novoPlano
    }
  });

  await sendMessage(
  phone,
`
📦 Plano alterado

📱 Telefone: ${telefone}
📦 Novo plano: ${novoPlano}
`
);


  return res.sendStatus(200);
}
    // =====================================================
// DESATIVAR CLIENTE
// =====================================================

if (
  message.startsWith("/desativarcliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/desativarcliente", "")
    .trim();

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      isActive: false
    }
  });

  await sendMessage(
    phone,
`🚫 Cliente desativado

📱 ${telefone}`
  );

  return res.sendStatus(200);
}
    // =====================================================
// REATIVAR CLIENTE
// =====================================================

if (
  message.startsWith("/reativarcliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/reativarcliente", "")
    .trim();

  await prisma.client.updateMany({
    where: {
      phone: telefone
    },
    data: {
      isActive: true
    }
  });

  await sendMessage(
    phone,
`✅ Cliente reativado

📱 ${telefone}`
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

  const telefone =
    message.replace("/cliente", "")
    .trim();

  const clienteConsulta =
    await prisma.client.findFirst({
      where: {
        phone: telefone
      }
    });

  if (!clienteConsulta) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return res.sendStatus(200);
  }

  await sendMessage(
    phone,
`    
👤 CLIENTE

Nome: ${clienteConsulta.name}
Telefone: ${clienteConsulta.phone}
Plano: ${clienteConsulta.planType}
Modo IA: ${clienteConsulta.aiMode}
Status: ${clienteConsulta.isActive ? "Ativo" : "Inativo"}
Senha: ${clienteConsulta.password}
`
 );
    return res.sendStatus(200);
}
    
    // =====================================================
    // AGENDAR
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

      if (!numero) {

        await sendMessage(
          phone,
          "⚠️ Use:\n/limparhistorico 5511999999999"
        );

        return res.sendStatus(200);
      }

      pendingDeletes[phone] = numero;

      await sendMessage(
        phone,
        `⚠️ Confirma apagar todo histórico do número:\n\n${numero}\n\nDigite:\n/sim`
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // CONFIRMAR LIMPEZA
    // =====================================================

    if (
      message.toLowerCase() === "/sim" &&
      adminSessions[phone]
    ) {

      const numero =
        pendingDeletes[phone];

      if (!numero) {

        await sendMessage(
          phone,
          "⚠️ Nenhuma limpeza pendente."
        );

        return res.sendStatus(200);
      }

      await prisma.message.deleteMany({
        where: {
          phone: numero
        }
      });

      delete pendingDeletes[phone];

      await sendMessage(
        phone,
        `🗑️ Histórico apagado com sucesso.\n\nNúmero: ${numero}`
      );

      return res.sendStatus(200);
    }
// =====================================================
// EXCLUIR CLIENTE
// =====================================================

if (
  message.startsWith("/excluircliente") &&
  adminSessions[phone]
) {

  const telefone =
    message.replace("/excluircliente", "")
    .trim();

  if (!telefone) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/excluircliente 5511999999999"
    );

    return res.sendStatus(200);
  }

  await prisma.client.deleteMany({
    where: {
      phone: telefone
    }
  });

  await sendMessage(
    phone,
`🗑️ Cliente excluído com sucesso

📱 ${telefone}`
  );

  return res.sendStatus(200);
}
    // =====================================================
    // VALIDAR CLIENTE
    // =====================================================
const cliente =
  await prisma.client.findFirst({
    where: {
      phone: phone.replace("@c.us", "")
    }
  });

let contextoSistema = modo1;

if (cliente?.aiMode === "BASICO") {
  contextoSistema = modo2;
}

if (cliente?.aiMode === "COMPLETO") {
  contextoSistema = modo3;
}

if (cliente?.aiMode === "AGILS_CRED") {
  contextoSistema = modo4;
}
    
// =====================================================
// PROMPT
// =====================================================
const settings =
  await prisma.adminSettings.findFirst();

const systemPrompt =
  settings?.systemPrompt
    ? settings.systemPrompt + "\n\n" + contextoSistema
    : contextoSistema;

    console.log("TESTE NOVO CODIGO 123");
    // =====================================================
    // SALVAR USUÁRIO
    // =====================================================

    const usuario = await prisma.user.findFirst({
  where: {
    phone
  }
});

if (!usuario) {

  await prisma.user.create({
    data: {
      phone
    }
  });

}

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
        take: 100
      });
// =====================================================
// COTAÇÃO DÓLAR
// =====================================================

if (
  message.toLowerCase().includes("dólar") ||
  message.toLowerCase().includes("dolar")
) {

  try {

    console.log("Consultando dólar...");

    const response = await axios.get(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
      {
        timeout: 10000
      }
    );

    console.log(response.data);

    const valor =
      response.data.USDBRL.bid;

    await sendMessage(
      phone,
      `💵 Dólar atual:\nR$ ${valor}`
    );

  } catch (error) {

    console.log(
      "ERRO DOLAR:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o dólar agora."
    );

  }

  return res.sendStatus(200);
}

   
// =====================================================
// COTAÇÃO EURO
// =====================================================

if (
  message.toLowerCase().includes("euro")
) {

  try {

    console.log("Consultando euro...");

    const response = await axios.get(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL",
      {
        timeout: 10000
      }
    );

    console.log(response.data);

    const valor =
      response.data?.EURBRL?.bid;

    await sendMessage(
      phone,
      `💶 Euro atual:\nR$ ${valor}`
    );

  } catch (error) {

    console.log(
      "ERRO EURO:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o euro agora."
    );

  }

  return res.sendStatus(200);
}
   
// =====================================================
// SELIC
// =====================================================

if (
  message.toLowerCase().includes("selic")
) {

  try {

    console.log("Consultando Selic...");

    const response = await axios.get(
      "https://brasilapi.com.br/api/taxas/v1",
      {
        timeout: 10000
      }
    );

    const taxas =
      response.data;

    const selic =
      taxas.find(
        item =>
          item.nome.toLowerCase()
          .includes("selic")
      );

    await sendMessage(
      phone,
      `📈 Taxa Selic atual:\n${selic.valor}%`
    );

  } catch (error) {

    console.log(
      "ERRO SELIC:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar a Selic agora."
    );

  }

  return res.sendStatus(200);
}

// =====================================================
// CDI
// =====================================================

if (
  message.toLowerCase().includes("cdi")
) {

  try {

    console.log("Consultando CDI...");

    const response = await axios.get(
      "https://brasilapi.com.br/api/taxas/v1",
      {
        timeout: 10000
      }
    );

    const taxas =
      response.data;

    const cdi =
      taxas.find(
        item =>
          item.nome.toLowerCase()
          .includes("cdi")
      );

    await sendMessage(
      phone,
      `💰 CDI atual:\n${cdi.valor}%`
    );

  } catch (error) {

    console.log(
      "ERRO CDI:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o CDI agora."
    );

  }

  return res.sendStatus(200);
}

// =====================================================
// BITCOIN
// =====================================================

if (
  message.toLowerCase().includes("bitcoin")
) {

  try {

    console.log("Consultando Bitcoin...");

    const response = await axios.get(
      "https://economia.awesomeapi.com.br/json/last/BTC-BRL",
      {
        timeout: 10000
      }
    );

    const valor =
      response.data?.BTCBRL?.bid;

    await sendMessage(
      phone,
      `🪙 Bitcoin atual:\nR$ ${valor}`
    );

  } catch (error) {

    console.log(
      "ERRO BITCOIN:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar o Bitcoin agora."
    );

  }

  return res.sendStatus(200);
}

// =====================================================
// NOTÍCIAS FINANCEIRAS
// =====================================================

if (

  message.toLowerCase().includes("notícias") ||
  message.toLowerCase().includes("noticia") ||
  message.toLowerCase().includes("manchetes")

) {

  try {

    console.log("Consultando notícias...");

    const response = await axios.get(

      `https://newsapi.org/v2/everything?q=mercado financeiro OR economia OR investimentos&language=pt&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`,

      {
        timeout: 10000
      }

    );

    const noticias =
      response.data.articles;

    if (!noticias.length) {

      await sendMessage(
        phone,
        "⚠️ Nenhuma notícia encontrada."
      );

      return res.sendStatus(200);
    }

    let resumo =
      "📰 Notícias Financeiras:\n\n";

    noticias.forEach((n, index) => {

      resumo +=
`${index + 1}️⃣ ${n.title}

Fonte: ${n.source.name}

`;
    });

    await sendMessage(
      phone,
      resumo
    );

  } catch (error) {

    console.log(
      "ERRO NEWS:",
      error.message
    );

    await sendMessage(
      phone,
      "⚠️ Não consegui consultar notícias agora."
    );

  }

  return res.sendStatus(200);
}
    //CADASTRO DESATIVADO//
if (cliente && !cliente.isActive) {

  await sendMessage(
    phone,
`🚫 Seu acesso está desativado.

Entre em contato com a Agils IA.`
  );

  return res.sendStatus(200);
}

    
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
          temperature: 0.9,
          max_tokens: 800
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
