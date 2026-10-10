export default async function infoCommand(sock, jid, message) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, 
      {text: `Hi! I’m *iboT* by tobi 👋

I’m your personal school assistant. I can:

🗓️ Show your class schedule
🔔 Remind you about upcoming classes
📄 Keep track of Documents you send me

Just type *.help* to see what I can do.

I’m still under development, Tobi is still teaching me new tricks🛠️, so you might find a few bugs. But I’m getting smarter with every update (I think)😌.
`},
      {quoted: message}
    );
  }