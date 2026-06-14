// =====================================================
// MEUS COMPROMISSOS
// =====================================================

if (
  [

  "lembre",   
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

  return res.sendStatus(200);
}
    
