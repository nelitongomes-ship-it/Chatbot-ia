const iniciarLembretes =
require("./lembretes");

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
const modo5 = require("./modo5");
const modo6 = require("./modo6");

require("dotenv").config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// =====================================================
// CONFIGURAÇÕES ADM
// =====================================================

const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";
const ADMIN_PHONE = "5516999796559";

const adminSessions = {};
const userCooldown = {};
const pendingDeletes = {};

function isAdminPhone(phone) {

  const numero =
    phone
      .replace("@c.us", "")
      .replace(/\D/g, "");

  return numero === ADMIN_PHONE;

}
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
iniciarLembretes(
  prisma,
  sendMessage
);

// =====================================================
// WEBHOOK
// =====================================================
app.post("/webhook", async (req, res) => {

console.log("PROCESS ID:");
console.log(process.pid);

console.log("TESTE SESSION INICIO:");
console.log(global.testeGratisSession);

console.log("MEMORIA:");
console.log(process.memoryUsage().heapUsed);


console.log(
  "TIPO:",
  req.body?.data?.type
);

console.log(
  JSON.stringify(req.body, null, 2)
);
  
  console.log(
  "TIPO RECEBIDO:",
  req.body.data?.type
);
  try {

    let message =
  req.body.data?.body ||
  req.body.message ||
  "";

const phone =
  req.body.data?.from ||
  "";

console.log("================================");
console.log("MESSAGE RECEBIDA:");
console.log(message);
console.log("PHONE:");
console.log(phone);
console.log("ADMIN SESSION:");
console.log(adminSessions[phone]);
console.log("================================");

if (req.body.data?.fromMe) {
  return res.sendStatus(200);
}

    //// 

const textoLower =
  (message || "")
    .toLowerCase()
    .trim();

    console.log("TEXTO LOWER:");
console.log(textoLower);
    //

//====================================================
// STATUS DA CONTA
// =====================================================

if (textoLower === "status") {

  const usuario = await prisma.user.findFirst({
    where: {
      phone
    }
  });

  if (!usuario) {

    await sendMessage(
      phone,
      "❌ Usuário não encontrado."
    );

    return res.sendStatus(200);
  }

  await sendMessage(
    phone,
    `📋 Status da conta

Plano: ${usuario.planType}

Modo: ${usuario.aiMode}

Ativo: ${usuario.isActive ? "SIM" : "NÃO"}`
  );

  return res.sendStatus(200);
         }
// =====================================================
// =====================================================
// ATIVAR TESTE GRÁTIS
// =====================================================

if (
  textoLower.includes("teste grátis") ||
  textoLower.includes("teste gratis") ||
  textoLower.includes("quero testar") ||
  textoLower.includes("tem teste")
) {

  console.log("🎁 BLOCO TESTE GRATIS EXECUTOU");

  await prisma.user.updateMany({
    where: {
      phone
    },
    data: {
      aiMode: "AGUARDANDO_TESTE"
    }
  });

  const usuarioAguardando =
    await prisma.user.findFirst({
      where: {
        phone
      }
    });

  console.log(
    "USUÁRIO AGUARDANDO TESTE:"
  );
  console.log(usuarioAguardando);

  await sendMessage(
    phone,
    `🎁 Posso liberar um teste grátis de 7 dias da Agils IA.

Durante o período de teste você poderá:

✅ Conversar com a IA
✅ Criar lembretes
✅ Agendar compromissos
✅ Organizar tarefas

Deseja ativar agora?

Responda apenas: SIM`
  );

  return res.sendStatus(200);
}

// =====================================================

 // =====================================================
// CONFIRMAÇÃO TESTE
// =====================================================

const usuarioTeste =
  await prisma.user.findFirst({
    where: {
      phone
    }
  });

console.log("USUARIO TESTE:");
console.log(usuarioTeste);

if (
  textoLower === "sim" &&
  usuarioTeste?.aiMode === "AGUARDANDO_TESTE"
) {

  const resultado =
    await prisma.user.updateMany({
      where: {
        phone
      },
      data: {
        aiMode: "TESTE_GRATIS",
        isActive: true,
        trialStartAt: new Date(),
        trialEndAt: new Date(
          Date.now() +
          7 * 24 * 60 * 60 * 1000
        )
      }
    });

  console.log("UPDATE RESULTADO:");
  console.log(resultado);

  const userAtivado =
    await prisma.user.findFirst({
      where: {
        phone
      }
    });

  console.log(
    "USER APÓS ATIVAÇÃO:"
  );
  console.log(userAtivado);

  await sendMessage(
    phone,
    `🎉 Teste grátis ativado com sucesso!

Seu acesso ficará disponível por 7 dias.

Agora você já pode utilizar todos os recursos da Agils IA.`
  );

  return res.sendStatus(200);
}
// =====================================================
// CADASTRO AUTOMÁTICO DE CLIENTE
// =====================================================

console.log("MENSAGEM ANTES DO CADASTRO:");
console.log(message);

if (
  message.toUpperCase().includes("CONTRATO") &&
  message.includes("Cliente:")
) {

  console.log("🔥🔥🔥 CADASTRO AUTOMÁTICO EXECUTOU 🔥🔥🔥");

  const contrato =
    message.match(/Contrato:\s*(.+)/i)?.[1]?.trim() || "";

  const nome =
    message.match(/Cliente:\s*(.+)/i)?.[1]?.trim() || "";

  const cpf =
    message.match(/CPF:\s*(.+)/i)?.[1]?.trim() || "";

  const valor =
    message.match(/Valor Total:\s*R\$\s*([\d.,]+)/i)?.[1]?.trim() || "";

  const parcelas =
    message.match(/Parcelas:\s*(.+)/i)?.[1]?.trim() || "";

  const dataContrato =
    message.match(/Data do Contrato:\s*(.+)/i)?.[1]?.trim() || "";

  const primeiraParcela =
    message.match(/1ª Parcela:\s*(.+)/i)?.[1]?.trim() || "";

  const telefoneCliente =
    message.match(/📲\s*(\d{10,13})/)?.[1] || "";

  if (!telefoneCliente) {

    await sendMessage(
      phone,
      "❌ Não foi possível localizar o telefone do cliente no contrato."
    );

    return res.sendStatus(200);
  }

  const telefoneFinal =
    telefoneCliente.startsWith("55")
      ? telefoneCliente
      : "55" + telefoneCliente;

  const cpfLimpo =
    cpf.replace(/\D/g, "");

  const clienteExistente =
    await prisma.client.findFirst({
      where: {
        OR: [
          { cpf: cpfLimpo },
          { phone: telefoneFinal }
        ]
      }
    });

  if (clienteExistente) {

    await sendMessage(
      phone,
      "⚠️ Cliente já cadastrado."
    );

    return res.sendStatus(200);
  }

  await prisma.client.create({
    data: {
      name: nome,
      fullName: nome,
      cpf: cpfLimpo,
      phone: telefoneFinal,
      password: cpfLimpo.slice(-4),
      serviceType: "ASSESSORIA_FINANCEIRA",
      planType: "BASICO",
      contractNumber: contrato,
      totalValue: parseFloat(
        valor
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0,
      installments: parcelas,
      contractDate: dataContrato,
      firstDueDate: primeiraParcela,
      aiMode: "BASICO",
      isActive: true
    }
  });

  console.log("✅ CLIENTE CADASTRADO");
  console.log({
    nome,
    cpf: cpfLimpo,
    telefone: telefoneFinal,
    contrato
  });

  await sendMessage(
    phone,
`✅ CLIENTE CADASTRADO COM SUCESSO

👤 ${nome}
📋 ${contrato}
🪪 ${cpfLimpo}

📦 Plano: BÁSICO
💰 Valor: R$ ${valor}

🔐 Senha inicial: ${cpfLimpo.slice(-4)}

📱 Login:
${telefoneFinal}`
  );

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
  
console.log("AUDIO RECEBIDO");
  
  try {

    await sendMessage(
      phone,
      "🎤 Áudio recebido. Transcrevendo..."
    );

    const audioUrl =
  req.body.data?.url ||
  req.body.data?.media;

console.log("URL AUDIO:", audioUrl);

if (!audioUrl) {

  console.log("URL DE AUDIO NÃO ENCONTRADA");

  await sendMessage(
    phone,
    "⚠️ Não encontrei o arquivo de áudio."
  );

  return res.sendStatus(200);
}

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

  if (!isAdminPhone(phone)) {

    await sendMessage(
      phone,
      "⛔ Este número não possui acesso administrativo."
    );

    return res.sendStatus(200);
  }

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
// LIMPAR BANCO
// =====================================================

if (
  message === "/limparbanco" &&
  adminSessions[phone]
) {

  await prisma.payment.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.blockedNumber.deleteMany({});

  await sendMessage(
    phone,
    "✅ Banco limpo com sucesso."
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
// *TREINAMENTOS IA*
// =====================================================
    // =====================================================
// LISTAR TREINAMENTOS
// =====================================================

if (message === "/treinamentos") {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const treinamentos =
    await prisma.training.findMany({
      orderBy: {
        id: "asc"
      }
    });

  if (treinamentos.length === 0) {

    await sendMessage(
      phone,
      "📚 Nenhum treinamento cadastrado."
    );

    return res.sendStatus(200);
  }

  let texto = "📚 TREINAMENTOS DA AGILS IA\n\n";

  treinamentos.forEach(t => {

    texto +=
      `ID: ${t.id}\n` +
      `Título: ${t.title}\n` +
      `Status: ${t.active ? "🟢 Ativo" : "🔴 Inativo"}\n\n`;

  });

  await sendMessage(
    phone,
    texto
  );

  return res.sendStatus(200);
}

    // =====================================================
// VER TREINAMENTO
// =====================================================

if (message.startsWith("/vertreinamento")) {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const id = parseInt(
    message.replace("/vertreinamento", "").trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/vertreinamento ID"
    );

    return res.sendStatus(200);
  }

  const treinamento =
    await prisma.training.findUnique({
      where: {
        id
      }
    });

  if (!treinamento) {

    await sendMessage(
      phone,
      "❌ Treinamento não encontrado."
    );

    return res.sendStatus(200);
  }

  await sendMessage(
    phone,
`📚 TREINAMENTO #${treinamento.id}

📝 Título:
${treinamento.title}

📖 Conteúdo:
${treinamento.content}

📌 Status:
${treinamento.active ? "Ativo" : "Inativo"}`
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

console.log("MENSAGEM RECEBIDA:");
console.log(message);
    
// =====================================================
// CADASTRAR CLIENTE
// =====================================================
console.log("ENTROU NO CADASTRO AUTOMATICO");

    
if (
  message.startsWith("/cadastrarcliente") &&
  adminSessions[phone]
) {

  const dados = message
    .replace("/cadastrarcliente", "")
    .trim()
    .split("|");

  const nome = dados[0]?.trim();
  const telefone = dados[1]?.trim();
  const cpf = dados[2]?.trim();
  const senha = dados[3]?.trim();
  const plano = dados[4]?.trim()?.toUpperCase();

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

/cadastrarcliente João Silva | 16999999999 | 12345678900 | 1234 | BASICO`
    );

    return res.sendStatus(200);
  }

  const telefoneFinal =
    telefone.replace(/\D/g, "").startsWith("55")
      ? telefone.replace(/\D/g, "")
      : "55" + telefone.replace(/\D/g, "");

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

  if (plano === "BASICO") {
    modo = "BASICO";
  }

  if (plano === "INTERMEDIARIO") {
    modo = "INTERMEDIARIO";
  }

  if (plano === "AGILS_CRED") {
    modo = "AGILS_CRED";
  }

  if (plano === "AVANCADO") {
    modo = "AVANCADO";
  }

  if (plano === "TESTE_GRATIS") {
    modo = "TESTE_GRATIS";
  }
  
  await prisma.client.create({
    data: {
      name: nome,
      fullName: nome,
      cpf: cpf,
      phone: telefoneFinal,
      password: senha,
      planType: plano,
      serviceType: plano,
      aiMode: modo,
      isActive: true
    }
  });

  await sendMessage(
    phone,
`✅ CLIENTE CADASTRADO COM SUCESSO

👤 Nome: ${nome}
📱 Telefone: ${telefoneFinal}
🪪 CPF: ${cpf}
📦 Plano: ${plano}
🤖 Modo IA: ${modo}`
  );

  return res.sendStatus(200);
}

   
    // =====================================================
// VER CLIENTE POR CPF
// =====================================================

if (
  message.startsWith("/vercliente") &&
  adminSessions[phone]
) {

  const cpfBusca =
    message
      .replace("/vercliente", "")
      .trim()
      .replace(/\D/g, "");

  const cliente =
    await prisma.client.findFirst({
      where: {
        cpf: cpfBusca
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
`👤 CLIENTE

Nome: ${cliente.name}
Telefone: ${cliente.phone}
CPF: ${cliente.cpf}
Contrato: ${cliente.contractNumber || "Não informado"}
Plano: ${cliente.planType}
Modo IA: ${cliente.aiMode}
Valor: R$ ${cliente.totalValue || 0}
Status: ${cliente.isActive ? "ATIVO" : "INATIVO"}`
  );

  return res.sendStatus(200);
}

  
    // =====================================================
// EXCLUIR CLIENTE POR CPF
// =====================================================

if (
  message.startsWith("/excluircpf") &&
  adminSessions[phone]
) {

  const cpf =
    message
      .replace("/excluircpf", "")
      .trim()
      .replace(/\D/g, "");

  const cliente =
    await prisma.client.findFirst({
      where: {
        cpf
      }
    });

  if (!cliente) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return res.sendStatus(200);
  }

  await prisma.client.delete({
    where: {
      id: cliente.id
    }
  });

  await sendMessage(
    phone,
`🗑️ Cliente removido

👤 ${cliente.name}
🪪 ${cliente.cpf}`
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
// LIMPAR AGENDA COMPLETA
// =====================================================

if (
  message.trim() === "/limparagenda"
) {

  console.log("LIMPANDO AGENDA COMPLETA");

  await prisma.appointment.deleteMany({});

  await sendMessage(
    phone,
    "🗑️ Todos os compromissos foram removidos."
  );

  return res.sendStatus(200);
}
    
// =====================================================
// LIMPAR AGENDA CLIENTE
// =====================================================

if (
  message.startsWith("/limparagendacliente")
) {

  const telefone =
    message
      .replace("/limparagendacliente", "")
      .trim();

  if (!telefone) {

    await sendMessage(
      phone,
      "⚠️ Informe o telefone.\n\nExemplo:\n/limparagendacliente 5516992040119"
    );

    return res.sendStatus(200);
  }

  const resultado =
    await prisma.appointment.deleteMany({
      where: {
        phone: telefone
      }
    });

  await sendMessage(
    phone,
`🗑️ Compromissos removidos

📱 ${telefone}

📋 Total removido: ${resultado.count}`
  );

  return res.sendStatus(200);
}
    // ============================
    // TESTE BANCO
// =====================================================
console.log("CHEGOU ANTES DO TESTEBANCO");

if (
  message === "/testebanco"
){

console.log("🔥 TESTEBANCO EXECUTOU 🔥");
  console.log("PHONE:");
console.log(phone);

console.log("ADMIN:");
console.log(isAdminPhone(phone));
  const cliente =
    await prisma.client.findFirst();

  await sendMessage(
    phone,
    JSON.stringify(cliente, null, 2)
  );

  return res.sendStatus(200);
}

    // =====================================================
// VALIDAR CLIENTE
// =====================================================

const telefoneCliente =
phone;

const cliente =
await prisma.client.findFirst({
where: {
phone: telefoneCliente
}
});

console.log("CLIENTE ENCONTRADO:", cliente);
if (!cliente) {
console.log("❌ CLIENTE NÃO CADASTRADO");
} else {
console.log("✅ CLIENTE CADASTRADO");
}

let contextoSistema = modo1;

if (cliente?.aiMode === "BASICO") {
contextoSistema = modo2;
}

if (cliente?.aiMode === "INTERMEDIARIO") {
contextoSistema = modo3;
}

if (cliente?.aiMode === "AGILS_CRED") {
contextoSistema = modo4;
}

if (cliente?.aiMode === "AVANCADO") {
contextoSistema = modo5;
}

if (cliente?.aiMode === "TESTE_GRATIS") {
contextoSistema = modo6;
console.log("🎁 MODO TESTE_GRATIS CARREGADO");
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

    console.log("TESTE 1");

console.log("MESSAGE:");
console.log(message);

console.log("TESTE 2");

console.log("PHONE:");
console.log(phone);

console.log("TESTE 3");

console.log("SYSTEM PROMPT OK");

console.log("TESTE 4");

    console.log("CHEGOU ANTES DO TESTEBANCO");

if (message === "/testebanco") {

  console.log("🔥 TESTEBANCO EXECUTOU 🔥");

  await sendMessage(
    phone,
    "COMANDO TESTEBANCO FUNCIONOU"
  );

  return res.sendStatus(200);
}
    // =====================================================
// SALVAR USUÁRIO
// =====================================================

console.log("ANTES DO USER");

try {

  const usuario = await prisma.user.findFirst({
    where: {
      phone
    }
  });

  console.log("USUARIO ENCONTRADO:");
  console.log(usuario);

  if (!usuario) {

    await prisma.user.create({
      data: {
        phone
      }
    });

    console.log("USUARIO CRIADO");
  }

} catch (erro) {

  console.log("ERRO USER:");
  console.log(erro);

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
// MEUS COMPROMISSOS
// =====================================================

if (
  [

  "me lembre",   
  "meus compromisso",
  "meus compromissos",
  "agenda",
  "minha agenda",
  "consultar agenda",
  "consultar meus compromissos",
  "ver agenda",
  "ver compromissos",
  "quais são meus compromissos"
].includes(message.toLowerCase().trim())
) {

  const numeroCliente =
    phone;

  console.log("WHATSAPP RECEBIDO:", phone);
  console.log("NUMERO CLIENTE:", numeroCliente);

  const compromissos =
    await prisma.appointment.findMany({
      where: {
        phone: numeroCliente
      },
      orderBy: {
        createdAt: "desc"
      }
    });

  console.log("COMPROMISSOS:", compromissos);

  if (!compromissos.length) {

    await sendMessage(
      phone,
      "📭 Você não possui compromissos agendados."
    );

    return res.sendStatus(200);
  }

  let resposta =
    "📅 SEUS COMPROMISSOS\n\n";

  compromissos.forEach(item => {

    resposta +=
`📆 ${item.date}
🕒 ${item.time}
📝 ${item.description}

`;
  });

  await sendMessage(
    phone,
    resposta
  );

  return res.sendStatus(200);
}
    

// =====================================================
// AGENDAR COMPROMISSO
// =====================================================

if (
  message.trim().startsWith("/agendar") &&
  adminSessions[phone]
) {

  const dados =
    message
      .replace("/agendar", "")
      .trim()
      .split("|");

  const telefone = dados[0]?.trim();
  const data = dados[1]?.trim();
  const hora = dados[2]?.trim();
  const descricao = dados[3]?.trim();

  if (
    !telefone ||
    !data ||
    !hora ||
    !descricao
  ) {

    await sendMessage(
      phone,
`⚠️ Use:

/agendar Telefone|Data|Hora|Descrição

Exemplo:

/agendar 5516992040119|05/06/2026|14:00|Reunião financeira`
    );

    return res.sendStatus(200);
  }

  const telefoneFinal =
    telefone.replace(/\D/g, "").startsWith("55")
      ? telefone.replace(/\D/g, "")
      : "55" + telefone.replace(/\D/g, "");

  const clienteAgenda =
    await prisma.client.findFirst({
      where: {
        phone: telefoneFinal
      }
    });

  if (!clienteAgenda) {

    await sendMessage(
      phone,
      "❌ Cliente não encontrado."
    );

    return res.sendStatus(200);
  }

  await prisma.appointment.create({
    data: {
      clientName: clienteAgenda.name,
      phone: telefoneFinal,
      date: data,
      time: hora,
      description: descricao
    }
  });

  console.log("✅ COMPROMISSO SALVO");
  console.log({
    cliente: clienteAgenda.name,
    telefone: telefoneFinal,
    data,
    hora,
    descricao
  });

  await sendMessage(
    phone,
`📅 COMPROMISSO AGENDADO

👤 ${clienteAgenda.name}
📱 ${telefoneFinal}

📆 ${data}
🕒 ${hora}

📝 ${descricao}`
  );

  return res.sendStatus(200);
}

  // =====================================================
// TESTAR TOTAL DE AGENDAMENTOS
// =====================================================

if (
  message.trim() === "/testeagenda" &&
  adminSessions[phone]
) {

  const total =
    await prisma.appointment.count();

  console.log(
    "TOTAL NO BANCO:",
    total
  );

  await sendMessage(
    phone,
    `📅 TOTAL DE AGENDAMENTOS: ${total}`
  );

  return res.sendStatus(200);
}

 // =====================================================
// DEBUG AGENDA
// =====================================================
if (
  message.trim() === "/debugagenda" &&
  adminSessions[phone]
) {

  const agenda =
    await prisma.appointment.findMany();

  console.log("AGENDA:");
  console.log(JSON.stringify(agenda, null, 2));

  await sendMessage(
    phone,
    `📋 Total encontrados: ${agenda.length}`
  );

  return res.sendStatus(200);
}
  
// =====================================================
// LISTAR CLIENTES
// =====================================================

if (
  message === "/listarclientes" &&
  adminSessions[phone]
) {

  const clientes =
    await prisma.client.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

  if (!clientes.length) {

    await sendMessage(
      phone,
      "📭 Nenhum cliente cadastrado."
    );

    return res.sendStatus(200);
  }

  let resposta =
    "📋 CLIENTES CADASTRADOS\n\n";

  clientes.forEach((cliente, index) => {

    resposta +=
`${index + 1}️⃣ ${cliente.name}

📱 ${cliente.phone}
📦 ${cliente.planType}
🟢 ${cliente.isActive ? "ATIVO" : "INATIVO"}

`;
  });

  await sendMessage(
    phone,
    resposta
  );

  return res.sendStatus(200);
}

// =====================================================
// TESTAR TOTAL DE AGENDAMENTOS
// =====================================================

if (
  message.trim() === "/testeagenda"
) {

  const total =
    await prisma.appointment.count();

  console.log(
    "TOTAL NO BANCO:",
    total
  );

  await sendMessage(
    phone,
    `📅 TOTAL DE AGENDAMENTOS: ${total}`
  );

  return res.sendStatus(200);
}
     
// =====================================================
//// =====================================================
// AGENDAMENTO NATURAL IA
// =====================================================

const texto = message.toLowerCase();
const ehAgendamento =
  
  texto.includes("agendar") ||
  texto.includes("agende") ||
  texto.includes("marcar") ||
  texto.includes("marque") ||
  texto.includes("compromisso") ||
  texto.includes("reunião") ||
  texto.includes("reuniao") ||
  texto.includes("lembrar") ||
  texto.includes("lembre") ||
  texto.includes("lembrete")

    if (ehAgendamento) {
   console.log("📅 ENTROU NO AGENDAMENTO");

  
  try {

    const numeroCliente =
      phone;
//
    const clienteAgenda =
  await prisma.client.findFirst({
    where: {
      phone: numeroCliente
    }
  });

const usuarioAgenda =
  await prisma.user.findFirst({
    where: {
      phone: numeroCliente
    }
  });

if (!clienteAgenda && !usuarioAgenda) {

  console.log(
    "❌ CLIENTE/USUÁRIO NÃO ENCONTRADO:",
    numeroCliente
  );

  return res.sendStatus(200);
}

console.log(
  "✅ CLIENTE OU USUÁRIO ENCONTRADO"
);
    

    const dataBrasil =
      new Date()
        .toLocaleDateString("pt-BR");

    console.log(
      "📅 DATA BRASIL:",
      dataBrasil
    );

    const extracao =
      await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Hoje é ${dataBrasil}.

Extraia data, hora e descrição.

REGRAS:

- Se houver "hoje", use ${dataBrasil}
- Se não houver data, use ${dataBrasil}
- Se houver "amanhã", use o próximo dia
- Hora sempre HH:MM
- Retorne SOMENTE JSON

Formato:

{
 "data":"${dataBrasil}",
 "hora":"14:00",
 "descricao":"Compromisso"
}`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0
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

    let respostaIA =
      extracao.data.choices[0].message.content
        .trim();

    respostaIA = respostaIA
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(
      "🤖 RESPOSTA IA:",
      respostaIA
    );

    let dadosAgenda;

    try {

      const json =
        respostaIA.match(/\{[\s\S]*\}/);

      if (!json) {
        throw new Error(
          "JSON não encontrado"
        );
      }

      dadosAgenda =
        JSON.parse(json[0]);
//alteracao//
      const possuiDataNaMensagem =
  /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(texto) ||
  texto.includes("hoje") ||
  texto.includes("amanhã") ||
  texto.includes("amanha");

if (!possuiDataNaMensagem) {

  console.log(
    "📅 SEM DATA INFORMADA - USANDO DATA DE HOJE"
  );

  dadosAgenda.data = dataBrasil;
}
//Fim//
      
    } catch (erroJson) {

      console.log(
        "❌ ERRO JSON:",
        erroJson
      );

      await sendMessage(
        phone,
        "❌ Não consegui entender a data e horário do compromisso."
      );

      return res.sendStatus(200);
    }

    if (
      texto.includes("hoje")
    ) {
      dadosAgenda.data =
        dataBrasil;
    }

    if (!dadosAgenda.data) {
      dadosAgenda.data =
        dataBrasil;
    }

    if (!dadosAgenda.hora) {
      dadosAgenda.hora =
        "09:00";
    }

    if (!dadosAgenda.descricao) {
      dadosAgenda.descricao =
        "Compromisso agendado";
    }

    dadosAgenda.descricao =
      dadosAgenda.descricao.trim();

    console.log(
      "📋 DADOS EXTRAIDOS:",
      dadosAgenda
    );

    const compromissoExistente =
      await prisma.appointment.findFirst({
        where: {
          phone: numeroCliente,
          date: dadosAgenda.data,
          time: dadosAgenda.hora
        }
      });

    if (compromissoExistente) {

      console.log(
        "⚠️ COMPROMISSO DUPLICADO"
      );

      await sendMessage(
        phone,
        `⚠️ Já existe um compromisso agendado para ${dadosAgenda.data} às ${dadosAgenda.hora}.`
      );

      return res.sendStatus(200);
    }

     
        //alterado//
          const nomeCliente =
  clienteAgenda?.name ||
  usuarioAgenda?.name ||
  "Usuário";
    console.log("NOME CLIENTE:");
console.log(nomeCliente);

const novoCompromisso =
  await prisma.appointment.create({
    data: {
      clientName: nomeCliente,

      phone: numeroCliente,

      date: dadosAgenda.data,

      time: dadosAgenda.hora,

      description: dadosAgenda.descricao
    }
  });
    
//fin//
    
    console.log(
      "✅ COMPROMISSO SALVO:",
      novoCompromisso
    );

    await sendMessage(
      phone,
      `✅ Compromisso agendado com sucesso!

📅 Data: ${dadosAgenda.data}
🕒 Hora: ${dadosAgenda.hora}

📝 ${dadosAgenda.descricao}

Digite *minha agenda* para consultar seus compromissos.`
    );

    return res.sendStatus(200);

  } catch (erro) {

    console.log(
      "❌ ERRO AGENDAMENTO:",
      erro
    );

    await sendMessage(
      phone,
      "❌ Ocorreu um erro ao realizar o agendamento."
    );

    return res.sendStatus(200);
  }
    }
    
    // =====================================================
// PROTEÇÃO CONTRA LOOP DE IAs E BOTS
// =====================================================

// Ignora mensagens enviadas pela própria conta

if (req.body?.data?.fromMe === true) {
  return res.sendStatus(200);
}

// Ignora grupos

if (phone.includes("@g.us")) {
  return res.sendStatus(200);
}

const mensagemLower =
  (message || "")
    .toLowerCase()
    .trim();

// =====================================================
// DETECÇÃO DE MENUS E BOTÕES
// =====================================================

if (
  req.body?.data?.buttonText ||
  req.body?.data?.listResponse ||
  req.body?.data?.selectedButtonId
) {

  console.log(
    "🤖 MENU AUTOMÁTICO DETECTADO"
  );

  return res.sendStatus(200);
}

// =====================================================
// DETECÇÃO POR PALAVRAS-CHAVE
// =====================================================

const indicadoresIA = [

  "sou uma inteligência artificial",
  "sou uma inteligencia artificial",
  "sou uma ia",
  "como assistente virtual",
  "como modelo de linguagem",
  "como modelo de linguagem ia",
  "chatgpt",
  "openai",
  "gemini",
  "claude",
  "copilot",
  "assistente virtual",
  "atendimento automático",
  "atendimento automatizado",
  "robô de atendimento",
  "robo de atendimento",
  "bot de atendimento",
  "assistente digital",
  "olá, sou o assistente",
  "ola, sou o assistente",
  "olá, eu sou um assistente",
  "ola, eu sou um assistente",
  "sou o assistente virtual",
  "atendente virtual",
  "assistente de atendimento",
  "sistema automatizado",
  "resposta automática",
  "resposta automatica",
  "mensagem automática",
  "mensagem automatica",

  // menus automáticos

  "não entendi",
  "nao entendi",
  "vamos tentar novamente",
  "selecione uma das opções",
  "selecione uma das opcoes",
  "clique no botão",
  "clique no botao",
  "ver opções",
  "ver opcoes",
  "como podemos te ajudar",
  "escolha uma opção",
  "escolha uma opcao",
  "digite uma opção",
  "digite uma opcao",
  "menu principal",
  "atendimento digital",
  "fluxo de atendimento",
  "responda com o número",
  "responda com o numero",
  "para prosseguirmos",
  "opções da lista",
  "opcoes da lista"

];

const detectouIA =
  indicadoresIA.some(
    termo =>
      mensagemLower.includes(termo)
  );

if (detectouIA) {

  console.log(
    "🤖 IA/BOT DETECTADO POR PALAVRAS-CHAVE"
  );

  return res.sendStatus(200);
}

// =====================================================
// PROTEÇÃO CONTRA LOOP DE MENSAGENS
// =====================================================

global.ultimasMensagens =
  global.ultimasMensagens || {};

const chaveLoop = phone;

if (
  global.ultimasMensagens[chaveLoop] ===
  mensagemLower
) {

  console.log(
    "🤖 LOOP DE IA DETECTADO"
  );

  return res.sendStatus(200);
}

global.ultimasMensagens[chaveLoop] =
  mensagemLower;

// =====================================================
// DETECÇÃO AVANÇADA VIA GPT
// =====================================================

try {

  const detectorIA =
    await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
`Você é um detector de chatbots.

Analise a mensagem recebida.

Responda SOMENTE:

SIM

ou

NAO

Responda SIM se a mensagem claramente parece ter sido enviada por:

- chatbot
- assistente virtual
- bot
- atendimento automático
- fluxo automatizado
- menu automatizado
- inteligência artificial

Responda NAO se parecer humana.

Não explique.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0,
        max_tokens: 5
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

  const respostaDetector =
    detectorIA.data
      .choices[0]
      .message.content
      .trim()
      .toUpperCase();

  if (
    respostaDetector.includes("SIM")
  ) {

    console.log(
      "🤖 IA DETECTADA PELO GPT"
    );

    return res.sendStatus(200);
  }

} catch (error) {

  console.log(
    "ERRO DETECTOR IA:",
    error.message
  );

}

// =====================================================
// FIM DA PROTEÇÃO
// =====================================================
   
   // =============================================
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
