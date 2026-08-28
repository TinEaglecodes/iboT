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


    if(text===".info" || text===". info"){
        await infoCommand(sock, jid, message)
    }
    if(text===".ping" || text===". ping"){
        await pingCommand(sock, jid, message)
    }
    if(text===".help" || text===". help"){
        await helpCommand(sock, jid, message)
    }
    if(text===".schedule"|| text===". schedule"){
        await timetableCommand(sock, jid, message)
    }
    else{
        //**edge case, replies to non-commands with guide
        await sock.sendMessage(jid,
            {text: `🤖ERROR, that's not part of my commands, try these instead:`},
            {quoted: message}
        )
        await helpCommand(sock, jid)
    }
}
    