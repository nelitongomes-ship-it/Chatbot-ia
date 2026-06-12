const recuperarSenha = require("./comandos/admin");
const bloqueios = require("./comandos/bloqueios");
const estatisticas = require("./comandos/estatisticas");
const usuarios = require("./comandos/usuarios");
const clienteFree = require("./comandos/clientefree");
const clientes = require("./comandos/clientes");
const cadastroTesteGratis = require("./cadastros/cadastroTesteGratis");
const cadastroAutomatico = require("./cadastros/cadastroAutomatico");
const desbloquearAdm = require("./codigos/desbloquearAdm");
const treinar = require("./IA.treinamentos/treinar");
const carregarTreinamentos = require("./IA.treinamentos/carregarTreinamentos");
const listarTreinamentos = require("./IA.treinamentos/listarTreinamentos");
const dolar = require("./comandos/dolar");


console.log("🚀 VERSAO 11-06-2026 17:40");
const iniciarLembretes =
require("./lembretes");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);
const express = require("express");
const app = express();
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


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
const modo7 = require("./modo7");
const modo8 = require("./modo8");

require("dotenv").config();

const prisma = new PrismaClient();

// =====================================================
// REGISTRO DE DESPESAS - AGILS IA
// =====================================================

async function registrarDespesa({
prisma,
phone,
valor,
categoria,
descricao,
dataRegistro  
  
}) {
console.log("🔥 REGISTRAR DESPESA CHAMADO");
  console.log({
    phone,
    valor,
    categoria,
    descricao,
    dataRegistro
 });
   try {

const despesa =
  await prisma.expense.create({
    data: {
      phone,
      value: Number(valor),
      category: categoria,
      description: descricao,
      createdAt: dataRegistro
      
    }
  });
console.log("🔥 RETORNANDO:");
console.log({
  sucesso: true
});

  
return {
  sucesso: true,
  despesa
};

} catch (erro) {

console.error(
  "ERRO AO REGISTRAR DESPESA:",
  erro
);

return {
  sucesso: false
};

}

}

// =====================================================
// PROCESSA BLOCO [REGISTRAR_DESPESA]
// =====================================================

async function processarRegistroDespesa({
respostaIA,
prisma,
phone
}) {

  console.log("🔥🔥🔥 ENTROU EM processarRegistroDespesa");

  
const match =
respostaIA.match(
/\[REGISTRAR_DESPESA\]([\s\S]*?)\[\/REGISTRAR_DESPESA\]/
);

if (!match) {
return null;
}

const conteudo = match[1];

const valor =
conteudo.match(
/VALOR:\s*(.+)/i
)?.[1]?.trim();

const categoria =
conteudo.match(
/CATEGORIA:\s*(.+)/i
)?.[1]?.trim();

const descricao =
conteudo.match(
/DESCRI.*?:\s*(.+)/i
)?.[1]?.trim();


  const dataInformada =
conteudo.match(
/DATA:\s*(.+)/i
)?.[1]?.trim();

const horaInformada =
conteudo.match(
/HORA:\s*(.+)/i
)?.[1]?.trim();

let dataRegistro = new Date();

  
  if (
  descricao?.toLowerCase().includes("ontem")
) {
  dataRegistro.setDate(
    dataRegistro.getDate() - 1
  );
}

if (
  descricao?.toLowerCase().includes("hoje")
) {
  dataRegistro = new Date();
}

  

if (
  dataInformada &&
  horaInformada
) {

  const [dia, mes, ano] =
    dataInformada.split("/");

  const [hora, minuto] =
    horaInformada.split(":");

  dataRegistro = new Date(
    ano,
    mes - 1,
    dia,
    hora,
    minuto
  );
}

  
  
console.log("🔥 VALOR:", valor);
console.log("🔥 CATEGORIA:", categoria);
console.log("🔥 DESCRICAO:", descricao);
  
if (
!valor ||
!categoria
) {
return {
sucesso: false
};
}

return await registrarDespesa({
prisma,
phone,
valor: parseFloat(
valor.replace(",", ".")
),
categoria,
descricao,
dataRegistro
});

}

//const app = express();

app.use(express.json());

// =====================================================
// CONFIGURAÇÕES ADM
// =====================================================

const ADMIN_USER = "AgilsIA";
const ADMIN_PASS = "151080Sis*";
const ADMIN_PIN = "151080";
const ADMIN_PHONE = ["5516999796559",
 "551637225563"];

const adminSessions = {};
const userCooldown = {};
const pendingDeletes = {}; 


function isAdminPhone(phone) {

  const numero =
    phone
      .replace("@c.us", "")
      .replace(/\D/g, "");

  return ADMIN_PHONE.includes(numero);

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
// =====================================================
// WEBHOOK
// =====================================================

app.post("/webhook", async (req, res) => {
console.log("HEADERS:");
console.log(req.headers);
  

  console.log("🔥🔥🔥 WEBHOOK ACIONADO 🔥🔥🔥");
console.log("METODO:", req.method);
console.log("BODY:", JSON.stringify(req.body, null, 2));

  console.log("################################");
  console.log("NOVO WEBHOOK 999");
  console.log("################################");


  
  console.log("================================");
  console.log("WEBHOOK RECEBIDO");
  console.log("================================");

  console.log("PROCESS ID:");
  console.log(process.pid);

  console.log("TESTE SESSION INICIO:");
  console.log(global.testeGratisSession);

  console.log("MEMORIA:");
  console.log(process.memoryUsage().heapUsed);

  console.log("WEBHOOK COMPLETO:");
  console.log(
    JSON.stringify(req.body, null, 2)
  );

  const tipo =
    req.body?.data?.type || "";

  let message =
    req.body?.data?.body ||
    req.body?.message ||
    "";
  
const textoLower =
String(message || "").toLowerCase();
  

  const phone =
    req.body?.data?.from ||
    "";

  console.log("🚀 CHAMANDO USUARIOS.JS");
if (
  await usuarios({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions,
    res
  })
) {
  return;
}
console.log("🚀 RETORNOU USUARIOS.JS");

if (
  await clienteFree({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return;
}
console.log("ANTES CLIENTES");

const retornoClientes =
  await clientes({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  });

console.log(
  "RETORNO CLIENTES:",
  retornoClientes
);

if (retornoClientes) {
  return;
}

 if (
  await cadastroTesteGratis({
    message,
    textoLower,
    phone,
    prisma,
    sendMessage,
    res
  })
) {
  return;
}
  
  console.log("🚀 CHAMANDO ESTATISTICAS");

if (
  await estatisticas({
    message,
    phone,
    sendMessage,
    adminSessions
  })
) {
  console.log("✅ RETORNOU ESTATISTICAS");
  return;
}

console.log("❌ NAO ENTROU ESTATISTICAS");

  if (
  await cadastroAutomatico({
    message,
    phone,
    prisma,
    sendMessage
  })
) {
  return;
  }

  console.log("🚀 CHAMANDO BLOQUEIOS");

if (
  await bloqueios({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return;
  }

  console.log("✅ RETORNOU BLOQUEIOS");
  


if (
  await desbloquearAdm({
    message,
    phone
  })
) {
return;
  }

  console.log(
    "🚀 PASSOU PELO DESBLOQUEIO"
  );


if (
  await recuperarSenha({
    message,
    phone,
    sendMessage,
    ADMIN_PIN,
    ADMIN_USER,
    ADMIN_PASS
  })
) {
return;
  }

  console.log(
    "🔐 RECUPERAR SENHA EXECUTOU"  
  );

if (
  await dolar({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
  }
  
if (message.startsWith("/treinar")) {

  return treinar({
    message,
    phone,
    sendMessage,
    prisma,
    adminSessions,
    res
  });

}

if (
  await listarTreinamentos({
  message,
  phone,
  sendMessage,
  prisma,
  adminSessions,
  res
})
  ){
  return;
  }

  
  console.log("TIPO:");
  console.log(tipo);

  console.log("MESSAGE:");
  console.log(message);

  console.log("PHONE:");
  console.log(phone);

  console.log("MEDIA:");
  console.log(req.body?.data?.media);

  console.log("URL:");
  console.log(req.body?.data?.url);

  console.log("IMAGE:");
  console.log(req.body?.data?.image);

  console.log("DOCUMENT:");
  console.log(req.body?.data?.document);

  

// =====================================
// ATUALIZAR SESSÃO
// =====================================

try {
  await prisma.session.upsert({

    where: {
      phone
    },

    update: {
      lastSeenAt: new Date()
    },

    create: {
      phone,
      lastSeenAt: new Date()
    }

  });

} catch (error) {

  console.log(
    "ERRO SESSION:",
    error.message
  );

}
 //fin//   
console.log("================================");
console.log("MESSAGE RECEBIDA:");
console.log(message);
console.log("PHONE:");
console.log(phone);
console.log("ADMIN SESSION:");
console.log(adminSessions[phone]);
console.log("================================");

if (!req.body) {
  console.log("❌ BODY VAZIO");
  return res.sendStatus(200);
}

if (req.body?.data?.fromMe) {
  return res.sendStatus(200);
}
    //

    console.log("TEXTO LOWER:");
console.log(textoLower);
    //
console.log("🔥 PASSOU DO TEXTO LOWER");
console.log("1");
  
//====================================================
// STATUS DA CONTA
// =====================================================
console.log("2");


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

  console.log("3");
// =====================================================
// DEBUG TESTE
// =====================================================

if (
  message === "/debugteste" &&
  adminSessions[phone]
) {

  const userTeste =
    await prisma.user.findFirst({
      where: {
        aiMode: "TESTE_GRATIS"
      }
    });

  const clientTeste =
    await prisma.client.findFirst({
      where: {
        aiMode: "TESTE_GRATIS"
      }
    });

  await sendMessage(
  phone,
    `USER:\n${JSON.stringify(userTeste, null, 2)}\n\nCLIENT:\n${JSON.stringify(clientTeste, null, 2)}`
  );

  return;
}
  console.log("4");
  // =====================================
  // PLANOS PAGOS (CLIENT)
  // =====================================

  const planoBasico =
    await prisma.client.count({
      where: {
        selectedPlan: "basico"
      }
    });

  const planoIntermediario =
    await prisma.client.count({
      where: {
        selectedPlan: "intermediario"
      }
    });

  const planoAvancado =
    await prisma.client.count({
      where: {
        selectedPlan: "avancado"
      }
    });

  const planoAgilsCred =
    await prisma.client.count({
      where: {
        selectedPlan: "agils_cred"
      }
    });
console.log("5");
  // =====================================
  // PAGAMENTOS
  // =====================================

  const pagamentosAprovados =
    await prisma.client.count({
      where: {
        paymentStatus: "PAID"
      }
    });

  const pagamentosPendentes =
    await prisma.client.count({
      where: {
        paymentStatus: "PENDENTE"
      }
    });
  console.log("6");
  
      //  =====================================================
// =====================================================
// ÁUDIO WHATSAPP
// =====================================================

console.log("6.1");

let audioText = "";

console.log("6.2");
console.log("TIPO:",
req.body.data?.type);

if (
  req.body.data?.type === "audio"
  ||
  req.body.data?.type === "ptt"
) {
  
console.log("AUDIO RECEBIDO");
  
  try {

    await sendMessage(
      phone,
      "🎤 Áudio recebido. Transcrevendo..."
    );
console.log("6.3");

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
    console.log("POS AUDIO");
console.log("7");

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
console.log("8");

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
console.log("9");

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
console.log("10");

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
  console.log("11");
  
    // =====================================================
    // IGNORAR GRUPOS
    // =====================================================

    if (phone.includes("@g.us")) {
      return res.sendStatus(200);
    }
console.log("12");
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
console.log("13");
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
console.log("14");
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
console.log("15");
    // =====================================================
    // LOGIN ADMIN
    // =====================================================

    if (message.startsWith("/login")) {

     //teste//
     console.log("================================");
console.log("LOGIN EXECUTOU");
console.log("PHONE LOGIN:");
console.log(phone);
console.log("MESSAGE LOGIN:");
console.log(message);
console.log("================================");
     //fim//

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
       //teste//
console.log("ADMIN SESSION CRIADA");
console.log(adminSessions);
console.log("PHONE LOGIN:");
console.log(phone);
       //fim//

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
console.log("16");
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
///////
console.log("17");

    // =====================================================
    

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
console.log("18");
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
  
          
 console.log("19");

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
  console.log("20");
    // =====================================================
// EDITAR TREINAMENTO
// =====================================================

if (message.startsWith("/editartreinamento")) {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const dados =
    message.replace("/editartreinamento", "").trim();

  const partes = dados.split("|");

  const id = parseInt(partes[0]?.trim());

  const novoConteudo = partes[1]?.trim();

  if (!id || !novoConteudo) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/editartreinamento ID|Novo conteúdo"
    );

    return res.sendStatus(200);
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      content: novoConteudo
    }
  });

  await sendMessage(
    phone,
    "✅ Treinamento atualizado."
  );

  return res.sendStatus(200);
}
    // =====================================================
// DESATIVAR TREINAMENTO
// =====================================================

if (message.startsWith("/desativartreinamento")) {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const id = parseInt(
    message.replace("/desativartreinamento", "").trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/desativartreinamento ID"
    );

    return res.sendStatus(200);
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      active: false
    }
  });

  await sendMessage(
    phone,
    "🔴 Treinamento desativado."
  );

  return res.sendStatus(200);
      }
    // =====================================================
// ATIVAR TREINAMENTO
// =====================================================

if (message.startsWith("/ativartreinamento")) {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const id = parseInt(
    message.replace("/ativartreinamento", "").trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/ativartreinamento ID"
    );

    return res.sendStatus(200);
  }

  await prisma.training.update({
    where: {
      id
    },
    data: {
      active: true
    }
  });

  await sendMessage(
    phone,
    "🟢 Treinamento ativado."
  );

  return res.sendStatus(200);
}
    // =====================================================
// EXCLUIR TREINAMENTO
// =====================================================

if (message.startsWith("/excluirtreinamento")) {

  if (!adminSessions[phone]) {

    await sendMessage(
      phone,
      "⛔ Faça login administrativo."
    );

    return res.sendStatus(200);
  }

  const id = parseInt(
    message.replace("/excluirtreinamento", "").trim()
  );

  if (!id) {

    await sendMessage(
      phone,
      "⚠️ Use:\n/excluirtreinamento ID"
    );

    return res.sendStatus(200);
  }

  await prisma.training.delete({
    where: {
      id
    }
  });

  await sendMessage(
    phone,
    "🗑️ Treinamento excluído."
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
// LISTAR BLOQUEADOS
// =====================================================

if (
  message === "/bloqueados" &&
  adminSessions[phone]
) {

  const bloqueados =
    await prisma.blockedNumber.findMany({
      orderBy: {
        phone: "asc"
      }
    });

  if (bloqueados.length === 0) {

    await sendMessage(
      phone,
      "✅ Nenhum número bloqueado."
    );

    return res.sendStatus(200);
  }

  let lista =
    "🚫 NÚMEROS BLOQUEADOS\n\n";

  bloqueados.forEach((item, index) => {
    lista += `${index + 1}. ${item.phone}\n`;
  });

  lista += `\nTotal: ${bloqueados.length}`;

  await sendMessage(
    phone,
    lista
  );

  return res.sendStatus(200);
}
// =====================================================
// VER NUMERO BLOQUEADO
// =====================================================

if (
  message.startsWith("/verbloqueado") &&
  adminSessions[phone]
) {

  const numero =
    message.replace("/verbloqueado", "").trim();

  if (!numero) {

    await sendMessage(
      phone,
      "⚠️ Informe um número.\n\nExemplo:\n/verbloqueado 5516999999999"
    );

    return res.sendStatus(200);
  }

  const bloqueado =
    await prisma.blockedNumber.findFirst({
      where: {
        phone: numero
      }
    });

  if (bloqueado) {

    await sendMessage(
      phone,
      `🚫 O número ${numero} está bloqueado.`
    );

  } else {

    await sendMessage(
      phone,
      `✅ O número ${numero} não está bloqueado.`
    );

  }

  return res.sendStatus(200);
}
// =====================================================
// =====================================================  
 // =====================================================
// SAUDE DO SISTEMA
// =====================================================

if (
  message === "/saudesistema" &&
  adminSessions[phone]
) {

  let bancoStatus = "🟢 Online";
  let prismaStatus = "🟢 Online";

  try {

    await prisma.client.count();

  } catch (error) {

    bancoStatus = "🔴 Erro";
    prismaStatus = "🔴 Erro";

  }
//alterado//
  const cincoMinutosAtras =
  new Date(
    Date.now() - 5 * 60 * 1000
  );

const sessoesAtivas =
  await prisma.session.count({
    where: {
      lastSeenAt: {
        gte: cincoMinutosAtras
      }
    }
  });
//Fim//
  const dataHora =
    new Date().toLocaleString("pt-BR");

  await sendMessage(
    phone,
`🏥 SAÚDE DO SISTEMA

✅ Banco de Dados: ${bancoStatus.replace("🟢 ","")}
✅ Prisma: ${prismaStatus.replace("🟢 ","")}
✅ OpenAI: Online
✅ WhatsApp API: Online
✅ Agendamentos: Online
✅ Treinamentos: Online

🤖 Sessões Ativas: ${sessoesAtivas}

⚠️ Erros últimas 24h: 0

🟢 STATUS GERAL:
OPERACIONAL

🕒 Verificação:
${dataHora}`
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

 // =====================================================
// DEBUG MODO
// =====================================================

if (message.trim() === "/debugmodo") {

  const cliente =
    await prisma.client.findFirst({
      where: { phone }
    });

  const usuario =
    await prisma.user.findFirst({
      where: { phone }
    });

  await sendMessage(
    phone,
`DEBUG

CLIENT:
${cliente?.aiMode || "NULL"}

USER:
${usuario?.aiMode || "NULL"}

CONTEXTO:
${contextoSistema === modo1 ? "modo1" : "outro"}`
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

if (cliente?.aiMode === "AGUARDANDO_DADOS_TESTE") {
  contextoSistema = modo7;
  console.log("📝 MODO AGUARDANDO_DADOS_TESTE CARREGADO");
}
    
if (cliente?.aiMode === "PAGAMENTO_PENDENTE") {
  contextoSistema = modo8;
  console.log("💳 MODO PAGAMENTO_PENDENTE CARREGADO");
}  
//teste temporario//
  /*
    // =====================================================
// TESTE EMAIL
// =====================================================

if (
  message.trim() === "/testeemail"
) {

  console.log("🔥 TESTEEMAIL EXECUTOU");

  const cliente =
    await prisma.client.findFirst();

  await sendMessage(
    phone,
    JSON.stringify(cliente, null, 2)
  );

  return res.sendStatus(200);
}


  const usuario =
    await prisma.user.findFirst({
      where: { phone }
    });

  const cliente =
    await prisma.client.findFirst({
      where: { phone }
    });

  await sendMessage(
    phone,
`USER:
${JSON.stringify(usuario, null, 2)}

CLIENT:
${JSON.stringify(cliente, null, 2)}`
  );

  return res.sendStatus(200);
}
*/    
    // =====================================================
// =====================================================
// PROMPT
// =====================================================

const settings =
  await prisma.adminSettings.findFirst();

const memoriaTreinamentos =
 await carregarTreinamentos(
 prisma
  );
 // const memoriaTreinamentos = "";

const systemPrompt = `
${settings?.systemPrompt || contextoSistema}

${memoriaTreinamentos}
`;

console.log("================================");
console.log("TREINAMENTOS CARREGADOS");
console.log("================================");
console.log(memoriaTreinamentos);

console.log("================================");
console.log("SYSTEM PROMPT");
console.log("================================");
console.log(
  `TAMANHO: ${systemPrompt.length}`
);

// =====================================================
// DIAGNOSTICO MIDIA
// =====================================================

console.log("================================");
console.log("DIAGNOSTICO MIDIA");
console.log("================================");

console.log("TIPO:");
console.log(req.body?.data?.type);

console.log("BODY:");
console.log(req.body?.data?.body);

console.log("MEDIA:");
console.log(req.body?.data?.media);

console.log("URL:");
console.log(req.body?.data?.url);

console.log("IMAGE:");
console.log(req.body?.data?.image);

console.log("DOCUMENT:");
console.log(req.body?.data?.document);

console.log("WEBHOOK:");
console.log(
  JSON.stringify(req.body, null, 2)
);

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

  //  try {//

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
//try//
     try {
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
    
  //===========≈====================≈==============
  
// =====================================================
// PROTEÇÃO CONTRA LOOP DE IAs E BOTS
// SOMENTE PARA NÚMEROS SEM CADASTRO
// =====================================================


    
// =====================================================
// DETECÇÃO DE MENUS E BOTÕES
// =====================================================



// =====================================================
// DETECÇÃO POR PALAVRAS-CHAVE
// =====================================================


// =====================================================
// LOOP DE MENSAGENS
// =====================================================



// =====================================================
// =====================================================
// DETECÇÃO AVANÇADA VIA GPT
// SOMENTE PARA NÚMEROS SEM CADASTRO
// =====================================================


// =====================================================
// FIM DA PROTEÇÃO
// =====================================================
// =====================================
// IGNORAR DETECTOR
// =====================================


    
    
// =====================================================
// BOTS BLOQUEADOS
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

console.log("🔥 REPLY IA:");
console.log(reply);
  /*
// =====================================================
// REGISTRAR DESPESA
// =====================================================
console.log("🔥 REPLY IA:");
console.log(reply);

const registroDespesa =
  await processarRegistroDespesa({
    respostaIA: reply,
    prisma,
    phone
  });
console.log("🔥 RESULTADO REGISTRO:");
console.log(registroDespesa);

if (registroDespesa?.sucesso) {

  const agora = new Date();

  const data =
    agora.toLocaleDateString("pt-BR");

  const hora =
    agora.toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  const mensagem = `✅ DESPESA REGISTRADA

💰 Valor: R$ ${registroDespesa.despesa.value.toFixed(2)}
🏷️ Categoria: ${registroDespesa.despesa.category}
📝 Descrição: ${registroDespesa.despesa.description || "-"}

📅 Data: ${data}
🕒 Hora: ${hora}

──────────────
📌 Registro salvo com sucesso.
Agils IA - Assistente Financeiro
──────────────`;

  await sendMessage(
    phone,
    mensagem
  );

  return res.sendStatus(200);
}
*/
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

//  } catch (error) {//

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
