import infoCommand from "../commands/info.js";
import pingCommand from "../commands/ping.js";
import helpCommand from "../commands/help.js";   

export default async function handleMessage(sock, message){
    const text = message.message.conversation || message.message.extendedTextMessage?.text || "";

    const jid = message.key.remoteJid;

    await sock.sendPresenceUpdate('available', jid)
    console.log(`📩 ${jid}: ${text}`);


    if(text===".info"){
        await infoCommand(sock, jid)
    }
    if(text===".ping"){
        await pingCommand(sock, jid)
    }
    if(text===".help"){
        await helpCommand(sock, jid)
    }
}
    