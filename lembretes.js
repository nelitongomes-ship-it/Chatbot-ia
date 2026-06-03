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

/*
      
await prisma.appointment.delete({
  where: {
    id: item.id
  }
});
      console.log(  
  `🗑️ COMPROMISSO REMOVIDO: ${item.id}`  
);
      
    }

  }

} catch (erro) {

  console.log(
    "❌ ERRO LEMBRETES:",
    erro
  );

}

});

};
