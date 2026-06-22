
module.exports = async function loginLogout({
  message,
  phone,
  sendMessage,
  adminSessions,
  ADMIN_USER,
  ADMIN_PASS,
  isAdminPhone
}) {

  // LOGIN
  if (message.startsWith("/login")) {

    if (!isAdminPhone(phone)) {

      await sendMessage(
        phone,
        "⛔ Este número não possui acesso administrativo."
      );

      return true;
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

    return true;
  }

  // LOGOUT
  if (message.startsWith("/logout")) {

    delete adminSessions[phone];

    await sendMessage(
      phone,
      "🔒 Logout administrativo realizado."
    );

    return true;
  }

  return false;
};
