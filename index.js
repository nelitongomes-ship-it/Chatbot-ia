const {limparBanco} = require("./config/banco/limparBanco");
const {testeBanco} = require("./config/banco/testebanco");
const {processarAgendamentoNatural} = require("./config/servicos/agendamentoNatural");
const {consultarAgenda,agendarCompromissoAdmin,testarTotalAgendamentos,debugAgenda} = require("./config/servicos/agendamentos");
const {processarRegistroDespesa} = require("./servicos/despesas");
const prisma = require("./config/prisma");
const normalizarTelefone = require("./utils/normalizarTelefone");
const validarTexto = require("./validadores/validarTexto");
const iniciarLembretes = require("./lembretes");
const recuperarSenha = require("./comandos/admin");
///////////////////////////////////////////////////////////////////////////////

const liberarComandoAdmin = require("./bloqueio/liberarComandoAdmin");
const {verificarBloqueio} = require("./bloqueio/verificarBloqueio");
const {bloquearNumero} = require("./bloqueio/bloquearNumero");
const {desbloquearNumero} = require("./bloqueio/desbloquearNumero");
const {listarBloqueados} = require("./bloqueio/listarBloqueados");
const { verBloqueado } = require("./bloqueio/verBloqueado");

/////////////////////////////////////////////////////////////////////////////////
const estatisticas = require("./comandos/estatisticas");
const usuarios = require("./comandos/usuarios");
/////////////////////////////////////////////////////////////////////////////////////
const clienteFree = require("./comandos/clientefree");
const clientes = require("./comandos/clientes");
////////////////////////////////////////////////////////////////////////////////////
const cadastroTesteGratis = require("./cadastros/cadastroTesteGratis");
const cadastroAutomatico = require("./cadastros/cadastroAutomatico");
const desbloquearAdm = require("./codigos/desbloquearAdm");
////////////////////////////////////////////////////////////////////////////////////
const treinar = require("./IA.treinamentos/treinar");
const carregarTreinamentos = require("./IA.treinamentos/carregarTreinamentos");
const listarTreinamentos = require("./IA.treinamentos/listarTreinamentos");
const {resetarTreinamento} = require("./IA.treinamentos/resetarTreinamento");
const {verTreinamento} = require("./IA.treinamentos/vertreinamento");
const {editarTreinamento} = require("./IA.treinamentos/editarTreinamento");
const {desativarTreinamento} = require("./IA.treinamentos/desativarTreinamento");
const {ativarTreinamento} = require("./IA.treinamentos/ativarTreinamento");
const {excluirTreinamento} = require("./IA.treinamentos/excluirTreinamento");
////////////////////////////////////////////////////////////////////////////////////////////////


const dolar = require("./comandos/dolar");
const {consultarEuro} = require("./config/servicos/euro");
const {consultarBitcoin} = require("./config/servicos/bitcoin");
const {consultarSelic} = require("./config/servicos/selic");
const {consultarCDI} = require("./config/servicos/cdi");
const {consultarNoticias} = require("./config/servicos/noticias");


console.log("🚀 VERSAO 11-06-2026 17:40");



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
  //
  if (!validarTexto(message)) {
  return res.sendStatus(200);
  }
  //
  
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
//////////////////////////////////////////////////////////////
  //BLOQUEIOS ⬇️
  /////////////////////////////////////////////////////////////
if (
  await liberarComandoAdmin({
    message,
    phone
  })
) {
  
  console.log(
    "✅ COMANDO ADMIN LIBERADO"
  );
}
    
  if (
  await bloquearNumero({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
}

  if (
  await desbloquearNumero({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await verificarBloqueio({
    phone,
    prisma
  })
) {
  return res.sendStatus(200);
  }

  if (
  await listarBloqueados({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await verBloqueado({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

/////////////////////////////////////////////////////////////////////  
// SENHA ⬇️
////////////////////////////////////////////////////////////////////
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

if (
  await consultarEuro({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
}

if (
  await consultarBitcoin({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
}

if (
  await consultarSelic({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
}

  if (
  await consultarCDI({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
    }

  if (
  await consultarNoticias({
    message,
    phone,
    sendMessage
  })
) {
  return res.sendStatus(200);
  }
////////////////////////////////////////////
  //TREINAR IA ⬇️
///////////////////////////////////////////
  
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

  if (
  await verTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await resetarTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await editarTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await desativarTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await ativarTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  if (
  await excluirTreinamento({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }

  /////////////////////////////////////////
  //AGENDAR ⬇️
 ////////////////////////////////////////// 
if (
  await consultarAgenda({
    message,
    phone,
    prisma,
    sendMessage
  })
) {
  return res.sendStatus(200);
}
  
  if (
  await agendarCompromissoAdmin({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
  }
  
if (
  await testarTotalAgendamentos({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
}

if (
  await debugAgenda({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
}  
  
  if (
  await processarAgendamentoNatural({
    message,
    phone,
    prisma,
    sendMessage
  })
) {
  return res.sendStatus(200);
  }
  
////////////////////////////////////////////////
if (
  await testeBanco({
    message,
    phone,
    prisma,
    sendMessage,
    isAdminPhone
  })
) {
  return res.sendStatus(200);
}

  if (
  await limparBanco({
    message,
    phone,
    prisma,
    sendMessage,
    adminSessions
  })
) {
  return res.sendStatus(200);
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
  
  
// Processamento de áudio ⬇️
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

// =====================================================



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

 /*   const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...historico.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    */
  //
try{
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
//
  } catch (error) {

  console.log("ERRO OPENAI:");
  console.log(
    error.response?.data ||
    error.message
  );

  return res.sendStatus(500);

}
  
  
  
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


 //  try {

  await sendMessage(
    phone,
    reply
  );

  return res.sendStatus(200);

// } catch (error) {

  console.log("ERRO SENDMESSAGE:");
  console.log(
    error.response?.data ||
    error.message
  );

  return res.sendStatus(500);



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
