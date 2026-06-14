async function testeBanco({
  message,
  phone,
  prisma,
  sendMessage,
  isAdminPhone
}) {

  console.log(
    "CHEGOU ANTES DO TESTEBANCO"
  );

  if (
    message !== "/testebanco"
  ) {
    return false;
  }

  console.log(
    "🔥 TESTEBANCO EXECUTOU 🔥"
  );

  console.log("PHONE:");
  console.log(phone);

  console.log("ADMIN:");
  console.log(
    isAdminPhone(phone)
  );

  const cliente =
    await prisma.client.findFirst();

  await sendMessage(
    phone,
    JSON.stringify(
      cliente,
      null,
      2
    )
  );

  return true;
}

module.exports = {
  testeBanco
};
