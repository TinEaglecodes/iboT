import infoCommand from "../commands/info.js";
import pingCommand from "../commands/ping.js";
import helpCommand from "../commands/help.js";   
import timetableCommand from "../commands/timetable/schedule.js";
import reminderCommand from "../commands/reminder/reminder.js";
import sendCommand from "../commands/document/send.js";
import {saveDocument} from "../commands/document/documentStore.js";
import listCommand from "../commands/document/documents.js";
import deleteCommand from "../commands/document/delete.js";

//list of all commands
const exactCommands = new Set([
    ".info",
    ". info",
    ".ping",
    ". ping",
    ".help",
    ". help",
    ".schedule",
    ". schedule",
    ".documents",
    ". documents"
]);

const prefixCommands = [
    ".reminder",
    ". reminder",
    ".send",
    ". send",
    ".delete",
    ". delete"
];

function isCommand(text) {
    if (exactCommands.has(text)) {
        return true;
    }
    return prefixCommands.some(command =>
        text.startsWith(command)
    );
}


export default async function handleMessage(sock, message) {
    const input =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        "";

    const text = input.toLowerCase().trim();
    const jid = message.key.remoteJid;

    // Mark message as read
    await sock.readMessages([message.key]);
    //Show online state
    await sock.sendPresenceUpdate("available",jid);

    console.log(`📩 ${jid}: ${text}`);

    // Document saving
    const documentMessage =
        message.message?.documentMessage;

    if (documentMessage) {
        const caption = documentMessage.caption?.trim();
        const fileName = documentMessage.fileName?.trim();
        const documentName = caption || fileName;

        if (!documentName) {
            await sock.sendMessage(jid,
                {text:
`⚠️ I couldn't determine the name of this document.

Please send it again with a caption.

Example:
*SEN 202*`
                },
                {quoted: message}
            );
            return;
        }
        saveDocument(documentName,message);

        await sock.sendMessage(jid,
            {
                text:
`📚 *${documentName}* saved!

You can request it later with:
.send ${documentName}`
            },
            {quoted: message}
        );
        return;
    }

    //info command
    if (text === ".info" || text === ". info"
    ) {
        await infoCommand(sock,jid,message);
        return;
    }

    //Ping command 
    if (text === ".ping" || text === ". ping"
    ) {
        await pingCommand(sock,jid,message);
        return;
    }

    // Help command
    if (text === ".help" || text === ". help"
    ){
        await helpCommand(sock,jid,message);
        return;
    }

    // Schedule command

    if (text === ".schedule" || text === ". schedule"
    ){
        await timetableCommand(sock,jid,message);
        return;
    }

    // list Document command
    if ( text === ".documents" || text === ". documents"
    ) {
        await listCommand(sock,jid,message);
        return;
    }

    // Reminder command

    if (text.startsWith(".reminder") || text.startsWith(". reminder")
    ) {
        const args = text
            .replace(/^\. ?reminder\s*/, "")
            .split(/\s+/)
            .filter(Boolean);

        await reminderCommand(sock,jid,message,args);
        return;
    }

    // Send Document command
    if (text.startsWith(".send") || text.startsWith(". send")
    ) {
        const args = text
            .replace(/^\. ?send\s*/, "")
            .split(/\s+/)
            .filter(Boolean);

        await sendCommand(sock,jid,message,args);
        return;
    }

    if (text.startsWith(".delete") || text.startsWith(". delete")
    ) {
        const args = text
            .replace(/^\. ?delete\s*/, "")
            .split(/\s+/)
            .filter(Boolean);

        await deleteCommand(sock,jid,message,args);
        return;
    }

    // non-command input
    if (!isCommand(text)) {
        await sock.sendMessage(jid,
            {text:
`🤖 *ERROR*

That's not part of my commands.

Try *.help* to see what I can do.`
            },
            {quoted: message}
        );
    }
}