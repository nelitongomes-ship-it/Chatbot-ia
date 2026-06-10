module.exports = async function estatisticas({
  message,
  phone,
  sendMessage,
  adminSessions
}) {

  if (
    message === "/estatisticas" &&
    adminSessions[phone]
  ) {

    console.log("🔥 ESTATISTICAS.JS EXECUTOU 🔥");

    await sendMessage(
      phone,
      "✅ TESTE ESTATISTICAS OK"
    );

    return true;
  }

  return false;
};
