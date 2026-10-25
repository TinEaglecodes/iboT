export default async function infoCommand(sock, jid, message) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, 
      {text: `Hi! I’m *iboT* by tobi 👋

I’m your school assistant. I can:

🗓️ Show your class timetable based on your department and Year.
🔔 Remind you about upcoming classes.
📄 Keep track of documents you send me.

🎓 Use *.department* to select your department and Year.

Just type *.help* to see everything I can do!
`},
      {quoted: message}
    );
  }