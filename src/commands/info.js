export default async function infoCommand(sock, jid, message) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, 
      {text: `*Hi! I’m iboT* by *Afolabi Oluwatobi*. I'm your school assistant. I don't do anything crazy but
I can help you to:
📚 Keep you updated about your classes.
🗓️ Send you your class schedule. 
📄 Help you find your course pdfs (that you sent to me)

I’m still under development 🛠️, so you might run into a few bugs.

But don’t worry tobi is hopefully getting smarter and better with every update so he'll probably fix the bugs.
`},
      {quoted: message}
    );
  }