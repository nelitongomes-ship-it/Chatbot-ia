module.exports = async function desbloquearAdm({
  message,
  phone
}) {

  const ehComando =
    message &&
    message.trim().startsWith("/");

  if (!ehComando) {
    return false;
  }

  console.log(
    "✅ COMANDO ADMINISTRATIVO LIBERADO"
  );

  console.log("📱", phone);
  console.log("💬", message);

  return true;
};
