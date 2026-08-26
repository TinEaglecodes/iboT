import infoCommand from "../commands/info.js";
import pingCommand from "../commands/ping.js";
import helpCommand from "../commands/help.js";   
import timetableCommand from "../commands/timetable/schedule";

export default async function handleMessage(sock, message){
    const input = message.message.conversation || message.message.extendedTextMessage?.text || "";

    const text = input.toLowerCase()

    const jid = message.key.remoteJid;
    const key = message.key

    await sock.readMessages([key])

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
    if(text===".schedule"){
        await timetableCommand(sock, jid)
    }
    else{
        await sock.sendMessage(jid, {
            text: `🤖ERROR, that's not part of my commands, try these instead:`
        })
        await helpCommand(sock, jid)
    }
}
    