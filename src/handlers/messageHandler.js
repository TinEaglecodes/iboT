import infoCommand from "../commands/info.js";
import pingCommand from "../commands/ping.js";
import helpCommand from "../commands/help.js";   
import timetableCommand from "../commands/timetable/schedule";
import reminderCommand from "../commands/reminder/reminder.js";



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
    if (text.startsWith(".reminder")) {
        const args = text
            .split(" ")
            .slice(1);

        await reminderCommand(
            sock,
            jid,
            message,
            args
    );
    }
    else if(text != ".info" && text != ". info" && text != ".ping" && text != ". ping" && text != ".help" && text != ". help" && text != ".schedule" && text != ". schedule" && !text.startsWith(".reminder")){
        //replies to non-commands with command guide
        await sock.sendMessage(jid,
            {text: `🤖ERROR, that's not part of my commands, try these instead:
🏓 *.ping* - Check if I’m active.
🤖 *.info* - Know more about me.
📖 *.help* - Show this command menu.
📚 *.reminder {on}/{off}* - See your next class.
🗓️ *.schedule* - View your class timetable.
📄 *.send <document name>* - Request a specific document from my storage.
`},
            {quoted: message}
        )
    }
}
    