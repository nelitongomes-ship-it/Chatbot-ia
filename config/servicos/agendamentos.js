const normalizarTelefone =
require("../../utils/normalizarTelefone");

async function consultarAgenda({
  message,
  phone,
  prisma,
  sendMessage
}) {


// =====================================================
// MEUS COMPROMISSOS
// =====================================================

if (
  [
  
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

// const numeroCliente =
//    phone;
  const numeroCliente =
  normalizarTelefone(phone);

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

  return true;
}

return false;
}

module.exports = {
  consultarAgenda
};

//=====================================================//
//AGENDAR COMPROMISSO
// =====================================================

async function agendarCompromissoAdmin({
  message,
  phone,
  prisma,
  sendMessage,
  adminSessions
}) {

// =====================================================
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

return true;
}
  module.exports = {
  consultarAgenda,
  agendarCompromissoAdmin
};
