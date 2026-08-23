sock.ev.on("messages.upsert", async ({ messages }) => {
  const message = messages[0];

  if (!message.message) return;
  if (message.key.fromMe) return;

  const text =
    message.message.conversation ||
    message.message.extendedTextMessage?.text ||
    "";

  const jid = message.key.remoteJid;

  console.log(`📩 ${jid}: ${text}`);

  if (text === "!ping") {
    await sock.sendMessage(jid, {
      text: "🏓 Pong!"
    });
  }

  if (text === "!help") {
    await sock.sendMessage(jid, {
      text: `🤖 Available commands:

!ping - Check if the bot is alive
!help - Show this menu`
    });
  }
});