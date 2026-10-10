export default async function helpCommand(sock, jid, message) {
  //typing state
  await sock.sendPresenceUpdate('composing', jid)

  // send message
  await sock.sendMessage(jid, {
    text: `🤖 *iboT — Command Me*

🤖 *.info* - Know more about me.
📖 *.help* - Show this command menu.
🗓️ *.department* - Choose your department
📚 *.reminder {on}/{off}* - Get a reminder when your class is about to start.
🗓️ *.schedule* - View your class timetable.
📄 *.send <document name>* - Request a specific document from my storage.
📄*.documents* - View all available documents in my records.
🗑️ *.remove <document name>* - Delete a specific document from my records.
🗓️ *.tomorrow* - View your schedule for tomorrow.
🗓️ *.today* - View your schedule for today.
    `},
    {quoted: message}
  );
}