import { getAllDocuments } from "./documentStore.js"

export  default async function listCommand(sock, jid, message) {
    const documents = getAllDocuments();
    const documentList = Object.values(documents).map(doc => `- ${doc.name}`);

    const documentListText= `
📚 Documents:\n${documentList.join('\n')}

To request a document, use the command:
.send <document name>`

    if(documentList.length ===0){
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(jid, { text: `There are currently no documents available.` },
            {quoted: message});
        return
    }

    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    await sock.sendMessage(jid, { text: documentListText }, {quoted: message});
}