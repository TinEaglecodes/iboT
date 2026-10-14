export default async function helpCommand(sock, jid, message) {
  //typing state
  await sock.sendPresenceUpdate('composing', jid)

  // send message
  await sock.sendMessage(jid, {
    text: `🤖 *iboT — Command Me*

🤖 *.info* - Learn more about me.
📖 *.help* - Show this command menu.

🎓 *.department* - Select your department and level.
📚 *.schedule* - View your full weekly timetable.
🗓️ *.today* - View your classes for today.
🗓️ *.tomorrow* - View your classes for tomorrow.

🔔 *.reminder on* - Turn class reminders on.
🔕 *.reminder off* - Turn class reminders off.
🔔 *.reminder status* - Check your reminder settings.

📄 *.documents* - View all available documents.
📄 *.send <document name>* - Request a document from my storage.
🗑️ *.remove <document name>* - Delete a document from my storage.
    `},
    {quoted: message}
  );
}