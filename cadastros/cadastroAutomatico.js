module.exports = async function ({
  message,
  phone,
  prisma,
  sendMessage
}) {

  const texto =
    String(message || "");

  if (
    !texto.toUpperCase().includes("CONTRATO") ||
    !texto.includes("Cliente:")
  ) {
    return false;
  }

  console.log(
    "🔥 CADASTRO AUTOMÁTICO EXECUTOU 🔥"
  );

  const contrato =
    texto.match(/Contrato:\s*(.+)/i)?.[1]?.trim() || "";

  const nome =
    texto.match(/Cliente:\s*(.+)/i)?.[1]?.trim() || "";

  const cpf =
    texto.match(/CPF:\s*(.+)/i)?.[1]?.trim() || "";

  const valor =
    texto.match(
      /Valor Total:\s*R\$\s*([\d.,]+)/i
    )?.[1]?.trim() || "";

  const parcelas =
    texto.match(/Parcelas:\s*(.+)/i)?.[1]?.trim() || "";

  const dataContrato =
    texto.match(
      /Data do Contrato:\s*(.+)/i
    )?.[1]?.trim() || "";

  const primeiraParcela =
    texto.match(
      /1ª Parcela:\s*(.+)/i
    )?.[1]?.trim() || "";

  const telefoneCliente =
    texto.match(/📲\s*(\d{10,13})/)?.[1] || "";

  if (!telefoneCliente) {

    await sendMessage(
      phone,
      "❌ Telefone não encontrado no contrato."
    );

    return true;
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

    return true;
  }

  await prisma.client.create({
    data: {
      name: nome,
      fullName: nome,
      cpf: cpfLimpo,
      phone: telefoneFinal,
      password: cpfLimpo.slice(-4),

      serviceType:
        "ASSESSORIA_FINANCEIRA",

      planType: "BASICO",

      contractNumber: contrato,

      totalValue: parseFloat(
        valor
          .replace(/\./g, "")
          .replace(",", ".")
      ),

      installments: parcelas,
      contractDate: dataContrato,
      firstDueDate: primeiraParcela,

      isActive: true
    }
  });

  await sendMessage(
    phone,
    `✅ Cliente cadastrado com sucesso!

👤 ${nome}
📱 ${telefoneFinal}
📄 Contrato: ${contrato}`
  );

  return true;
};
