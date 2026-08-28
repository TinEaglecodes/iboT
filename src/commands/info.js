export default async function infoCommand(sock, jid, message) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, 
      {text: `*Yo! I’m iboT* by *Afolabi Tobi*.
I can help you with:
📚 Keep you updated about your classes
🗓️ Send you your class schedule
📄 Help you find and receive course pdfs

I’m still under development 🛠️, so you might run into a few bugs.

But don’t worry tobi is getting smarter and better with every update so he'll probably fix me. 🚀
`},
      {quoted: message}
    );
  }