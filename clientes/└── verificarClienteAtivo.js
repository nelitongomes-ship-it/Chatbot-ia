module.exports = async function verificarClienteAtivo({
  cliente,
  phone,
  sendMessage
}) {

  if (!cliente) {
    return false;
  }

  if (!cliente.isActive) {

    await sendMessage(
      phone,
`🚫 Seu acesso está desativado.

Entre em contato com a Agils IA.`
    );

    return true;
  }

  return false;
};
