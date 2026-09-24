import infoCommand from "../commands/info.js";
import helpCommand from "../commands/help.js";   
import timetableCommand from "../commands/timetable/schedule.js";
import reminderCommand from "../commands/reminder/reminder.js";
import sendCommand from "../commands/document/send.js";
import {saveDocument} from "../commands/document/documentStore.js";
import listCommand from "../commands/document/documents.js";
import deleteCommand from "../commands/document/delete.js";
import departmentCommand from "../commands/department/department.js";
import { getDepartment } from "../commands/department/deptSettings.js";

//list of all commands
const exactCommands = new Set([
    ".info",
    ". info",
    ".help",
    ". help",
    ".schedule",
    ". schedule",
    ".documents",
    ". documents",
    ".department",
    ". department",
]);

const prefixCommands = [
    ".reminder",
    ". reminder",
    ".send",
    ". send",
    ".remove",
    ". remove"
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
    const department= getDepartment(jid)

    await sock.readMessages([message.key]); // Mark message as read
    await sock.sendPresenceUpdate('available', jid);  //Show online state
    console.log(`📩 ${jid}: ${text}`);

    // department command
    if (text === ".department" || text === ". department" || text.startsWith(".department ") || text.startsWith(". department ")
    ){
        const args = text
            .replace(/^\. ?department\s*/, "")
            .split(/\s+/)
            .filter(Boolean);

        await departmentCommand(sock,jid,message, args);
        return;
    }

    if (!department) {
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    await sock.sendMessage(
        jid,
        {
            text:
`👋 *Hey There I'm iboT*

Before we start, I need to know your department.

🎓What department are you in:

1️⃣ Software Engineering
2️⃣ Computer Science

Reply with: *.department <number>

For Example: .department 1*
`
        },
        { quoted: message }
    );
    return;
}

    // Document saving
    const documentMessage =
        message.message?.documentMessage;

    if (documentMessage) {
        const caption = documentMessage.caption?.trim();
        const fileName = documentMessage.fileName?.trim();
        const documentName = caption || fileName;

        if (!documentName) {
            //typing state
            await sock.sendPresenceUpdate('composing', jid) 
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
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
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

    if (text.startsWith(".remove") || text.startsWith(". remove")
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
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(jid,
            {text:
`*ERROR*

Sorry, That's not part of my commands.

Try *.help* to see what I can do.`
            },
            {quoted: message}
        );
    }
}