export default async function infoCommand(sock, jid, message) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, 
      {text: `Hi! I’m *iboT* by tobi 👋

I’m your school assistant. I can:

🗓️ Show your class timetable based on your department and level.
🔔 Remind you about upcoming classes.
📄 Keep track of documents you send me.

🎓 Use *.department* to select your department and level.

Just type *.help* to see everything I can do!

I’m still under development — Tobi is still teaching me new tricks 🛠️, so you might encounter a weird sh*t. But I’m getting smarter with every update (I think) 😌.
`},
      {quoted: message}
    );
  }