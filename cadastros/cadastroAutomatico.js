// =====================================================
// CADASTRO AUTOMÁTICO DE CLIENTE
// =====================================================

console.log("MENSAGEM ANTES DO CADASTRO:");
console.log(message);

const texto =
  String(message || "");

if (
  texto.toUpperCase().includes("CONTRATO") &&
  texto.includes("Cliente:")
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

  // cadastro continua aqui...
}
