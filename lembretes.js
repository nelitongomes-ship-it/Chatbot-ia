
const cron = require("node-cron");

module.exports = function (prisma, sendMessage) {

  cron.schedule("* * * * *", async () => {

    try {

      console.log("Verificando agenda...");

      const agora = new Date();

      const dia =
        String(agora.getDate()).padStart(2, "0");

      const mes =
        String(agora.getMonth() + 1).padStart(2, "0");

      const ano =
        agora.getFullYear();

      const dataHoje =
        `${dia}/${mes}/${ano}`;

      const horaAtual =
        `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

      const compromissos =
        await prisma.appointment.findMany();

      for (const item of compromissos) {

        if (
          item.date === dataHoje &&
          item.time === horaAtual
        ) {

          await sendMessage(
            item.phone,
`⏰ LEMBRETE

Você possui um compromisso agora.

🕒 ${item.time}
📝 ${item.description}`
          );

        }

      }

    } catch (erro) {

      console.log(
        "ERRO LEMBRETES:",
        erro
      );

    }

  });

};
