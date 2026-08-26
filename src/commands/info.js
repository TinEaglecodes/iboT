export default async function infoCommand(sock, jid) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    //Send message
    await sock.sendMessage(jid, {
      text: `Hi I'm bootleg tobi :), a bot made by Afolabi Tobi. I am your personal class assistant. I notify you about classes, send you your schedule and also send you documents. I am still in development so expect some bugs. Do not worry the bugs will be fixed in due time.`
    });
  }