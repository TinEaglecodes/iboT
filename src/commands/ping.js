export default async function pingCommand(sock, jid) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    
    await sock.sendMessage(jid, {
      text: `Pong,  Yes I'm here!🤖`
    })
}
