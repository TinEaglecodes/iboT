import { getDocument } from "./documentStore.js";

export default async function sendCommand(sock, jid, message, args){

    const documentName = args.join(" ").trim();

    // No document name
    if (!documentName) {
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`📚*Document Search Error*
Tell me which document you want with: 

.send <document name>

Example: .send SEN 202`
            },
            {quoted: message}
        );
        return;
    }

    // Find document
    const document = getDocument(documentName);

    if (!document) {
        //typing state
        sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`❌ I couldn't find *${documentName}*.

Make sure you typed the document name correctly`
            },
            {quoted: message}
        );
        return;
    }

    // Get original WhatsApp message
    const originalMessage = document.message;

    if (!originalMessage) {
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`⚠️ I found *${documentName}*, but I couldn't recover the original document message.`
            },
            {quoted: message}
        );
        return;
    }

    try {
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`📚 *Here's your ${document.name.toUpperCase()} document!*`
            },
            {quoted: originalMessage}
        );

    } catch (error) {
        console.error(
            "❌ Error sending document reference:",
            error
        );
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:`❌ I couldn't reply with *${document.name}* right now.`
            },
            {quoted: message}
        );
    }
}