//================================================
//RECUPERAR SENHA 
//=================================================

module.exports = async function recuperarSenha({
  message,
  phone,
  sendMessage,
  ADMIN_PIN,
  ADMIN_USER,
  ADMIN_PASS
}) {

  if (!message.startsWith("/recuperar")) {
    return false;
  }

  const args =
    message.trim().split(" ");

  const pin = args[1];

  if (pin === ADMIN_PIN) {

    await sendMessage(
      phone,
      `🔐 Usuário: ${ADMIN_USER}
🔑 Senha: ${ADMIN_PASS}`
    );

  } else {

    await sendMessage(
      phone,
      "❌ PIN inválido."
    );

  }

  return true;
};
