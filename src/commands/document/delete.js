import {deleteDocument} from "./documentStore.js";

export default async function deleteCommand(sock, jid,message, args){
    const documentName = args.join(" ").trim();

    if (!documentName){
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(jid,
            {text:`📚*Document Deletion Error*
Tell me which document you want to delete with: .delete <document name>

Example: .delete SEN 202`},
            {quoted: message}
        );
        return;
    }

    const deleted = deleteDocument(documentName);

    if (!deleted) {
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text: `❌ I couldn't find *${documentName}* in my document storage.`
            },
            { quoted: message }
        );

        return;
    }
    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    await sock.sendMessage(
        jid,
        {
            text: `🗑️ *${documentName.toUpperCase()}* has been deleted from my records.`
        },
        { quoted: message }
    );
}