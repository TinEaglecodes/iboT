export default async function helpCommand(sock, jid, message) {
  //typing state
  await sock.sendPresenceUpdate('composing', jid)

  // send message
  await sock.sendMessage(jid, {
    text: `🤖 *iboT — Command Me*

🏓 *.ping* - Check if I’m alive.
🤖 *.info* - Find out more about me.
📖 *.help* - Show this command menu.
📚 *.nextclass* - See your next class.
🗓️ *.schedule* - View your class timetable.
⏰ *.reminder {on}{off}* - Enable reminders 
📄 *.send <document name>* - Request a specific document from my storage.
    `},
    {quoted: message}
  );
}