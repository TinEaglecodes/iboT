export default async function helpCommand(sock, jid) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    // send message
    await sock.sendMessage(jid, {
      text: `🤖 Available commands:

    .ping - Check if the bot is alive and active.
    .info- Display information about this bot.
    .help - Show this menu.
    .nextclass - Display your next class.
    .schedule - Display Your Schedule.
    .send <document name> - Send a specific document from the bot's storage.
      `
    });
  }