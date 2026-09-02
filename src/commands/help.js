export default async function helpCommand(sock, jid, message) {
  //typing state
  await sock.sendPresenceUpdate('composing', jid)

  // send message
  await sock.sendMessage(jid, {
    text: `🤖 *iboT — Command Me*

🏓 *.ping* - Check if I’m active.
🤖 *.info* - Know more about me.
📖 *.help* - Show this command menu.
📚 *.reminder {on}/{off}* - See your next class.
🗓️ *.schedule* - View your class timetable.
📄 *.send <document name>* - Request a specific document from my storage.
📄*.documents* - View all available documents in my records.
🗑️ *.delete <document name>* - Delete a specific document from my records.
    `},
    {quoted: message}
  );
}