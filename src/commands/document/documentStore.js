import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.join(__dirname, "documents.json");

function serialize(key, value) {
    if (Buffer.isBuffer(value)) {
        return {
            __type: "Buffer",
            data: Array.from(value)
        };
    }

    if (value instanceof Uint8Array) {
        return {
            __type: "Uint8Array",
            data: Array.from(value)
        };
    }
    return value;
}


function deserialize(key, value) {
    if (value?.__type === "Buffer") {
        return Buffer.from(value.data);
    }

    if (value?.__type === "Uint8Array") {
        return new Uint8Array(value.data);
    }

    return value;
}


function loadDocuments() {
    try {
        const data = fs.readFileSync(FILE, "utf8");

        return JSON.parse(data, deserialize);

    } catch (error) {
        return {};
    }
}


function saveDocuments(documents) {
    fs.writeFileSync(
        FILE,
        JSON.stringify(documents, serialize, 2)
    );
}


function cleanName(name) {
    return name
        .replace(/\.[^/.]+$/, "")
        .trim()
        .toLowerCase();
}


export function saveDocument(name, message) {

    const documents = loadDocuments();

    const documentName = cleanName(name);

    documents[documentName] = {
        name: documentName,
        jid: message.key.remoteJid,
        messageId: message.key.id,

        // Save the original WhatsApp message
        message: message
    };

    saveDocuments(documents);

    console.log(`📄 Document saved: ${documentName}`);
}


export function getDocument(name) {

    const documents = loadDocuments();

    const documentName = cleanName(name);

    return documents[documentName] || null;
}


export function getAllDocuments() {

    return loadDocuments();
}