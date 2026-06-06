console.log("🚀 LEMBRETES INICIADO");

const cron = require("node-cron");

module.exports = function (prisma, sendMessage) {

cron.schedule("* * * * *", async () => {
//
try {

  const agora = new Date(
  new Date().toLocaleString(
    "en-US",
    { timeZone: "America/Sao_Paulo" }
  )
);
  
console.log(
  "🇧🇷 HORA BRASIL:",
  agora.toString()
);
  
const dia =
  String(agora.getDate()).padStart(2, "0");

const mes =
  String(agora.getMonth() + 1).padStart(2, "0");

const ano =
  agora.getFullYear();
  //

  const dataHoje =
    `${dia}/${mes}/${ano}`;

  const horaAtual =
    `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

  console.log(
    `⏰ CRON RODANDO ${dataHoje} ${horaAtual}`
  );

  const compromissos =
    await prisma.appointment.findMany();

  console.log(
    `📋 TOTAL COMPROMISSOS: ${compromissos.length}`
  );

  for (const item of compromissos) {
//alterado//
// =====================================================
// VERIFICAR TESTES VENCIDOS
// =====================================================

const clientesTeste =
  await prisma.client.findMany({
    where: {
      aiMode: "TESTE_GRATIS",
      isActive: true
    }
  });

for (const cliente of clientesTeste) {

  if (
    cliente.trialEndAt &&
    new Date(cliente.trialEndAt) < agora
  ) {

    console.log(
      `⛔ TESTE VENCIDO -> ${cliente.phone}`
    );

    await prisma.client.update({
      where: {
        id: cliente.id
      },
      data: {
        aiMode: "AGUARDANDO_PAGAMENTO",
        isActive: false
      }
    });

    await sendMessage(
      cliente.phone,

`⏰ Seu período de teste gratuito terminou.

Para continuar utilizando a Agils IA escolha um dos planos disponíveis.

📦 Básico - R$ 9,90
📦 Intermediário - R$ 39,90
📦 Avançado - R$ 69,90

Quando desejar, posso enviar o link de pagamento.`
    );

  }

}

// =====================================================
// VERIFICAR PLANOS VENCIDOS
// =====================================================

const clientesAtivos =
  await prisma.client.findMany({
    where: {
      isActive: true
    }
  });

for (const cliente of clientesAtivos) {

  if (
    cliente.planExpiresAt &&
    cliente.aiMode !== "TESTE_GRATIS"
  ) {

    const vencimento =
      new Date(cliente.planExpiresAt);

    if (vencimento < agora) {

      console.log(
        `💰 PLANO VENCIDO -> ${cliente.phone}`
      );

      await prisma.client.update({
        where: {
          id: cliente.id
        },
        data: {
          aiMode: "AGUARDANDO_PAGAMENTO",
          isActive: false
        }
      });

      await sendMessage(
        cliente.phone,

`⚠️ Sua mensalidade está vencida.

Seu acesso à IA foi suspenso temporariamente.

Envie o comprovante de pagamento para reativação imediata.

Se precisar, posso informar os planos disponíveis e enviar o link de pagamento.`
      );

    }

  }

}
    //fim//
    console.log(
      `VERIFICANDO -> ${item.phone} | ${item.date} | ${item.time}`
    );

    if (
      item.date === dataHoje &&
      item.time === horaAtual
    ) {

      console.log(
        `📨 ENVIANDO LEMBRETE PARA ${item.phone}`
      );

      await sendMessage(
        item.phone,

`🔔 LEMBRETE DE COMPROMISSO

🕒 Horário: ${item.time}

📝 ${item.description}`
);

console.log(
  "✅ LEMBRETE ENVIADO"
);
      
    }

};
  
} catch (erro) {

  console.log(
    "❌ ERRO LEMBRETES:",
    erro
  );

}

});

};
