import infoCommand from "../commands/info.js";
import pingCommand from "../commands/ping.js";
import helpCommand from "../commands/help.js";   
import timetableCommand from "../commands/timetable/schedule";
import reminderCommand from "../commands/reminder/reminder.js";
import sendCommand from "../commands/document/send.js";
import {saveDocument} from "../commands/document/documentStore.js";

export default async function handleMessage(sock, message){
    const input = message.message.conversation || message.message.extendedTextMessage?.text || "";

    const text = input.toLowerCase()

    const jid = message.key.remoteJid;

    //Mark message as read
    const key = message.key
    await sock.readMessages([key])

    await sock.sendPresenceUpdate('available', jid)
    console.log(`📩 ${jid}: ${text}`);

    const documentMessage = message.message?.documentMessage;

    if (documentMessage) {
    const caption = documentMessage.caption?.trim();
    const fileName = documentMessage.fileName?.trim();
    
    const documentName = caption ||fileName;

    saveDocument(
        documentName,
        message
    );

    await sock.sendMessage(
        jid,
        {
            text:
    `📚 *${documentName}* saved!

    You can request it later with:
    `},{quoted: message}
    );
    await sock.sendMessage(jid, 
        {text:`.send ${documentName}`}
    );
    return;
    }
    
    //info command
    if(text===".info" || text===". info"){
        await infoCommand(sock, jid, message)
    }
    //ping command
    if(text===".ping" || text===". ping"){
        await pingCommand(sock, jid, message)
    }
    //help command
    if(text===".help" || text===". help"){
        await helpCommand(sock, jid, message)
    }
    //schedule command
    if(text===".schedule"|| text===". schedule"){
        await timetableCommand(sock, jid, message)
    }
    //reminder command
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
    //send command
    if (text.startsWith(".send")) {

    const args = text
        .split(" ")
        .slice(1);

    await sendCommand(
        sock,
        jid,
        message,
        args
    );

    return;
    }

    else if(text != ".info" && text != ". info" && text != ".ping" && text != ". ping" && text != ".help" && text != ". help" && text != ".schedule" && text != ". schedule" && !text.startsWith(".reminder") && !text.startsWith(".send")){
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