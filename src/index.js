import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import P from "pino";
import handleMessage from "./handlers/messageHandler.js";
import { startReminderService } from "./commands/reminder/reminderService.js";
import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("iBot is running");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 HTTP server running on port ${PORT}`);
});

// let reminderStarted = false;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  });
  //save session
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("Scan this QR code with your WhatsApp to connect to iboT./n"+
        " Settings > linked devices > Link a device > scan QR code");

      //generate QR code to connect
      qrcode.generate(qr, { small: true });
    }


    //connection message
    if (connection === "open") {
      console.log("---✅ iboT is connected!---");
      startReminderService(sock)
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

       console.log('connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect)

      if (shouldReconnect) {
        console.log("---🔄 Reconnecting...---");
        startBot();
      }
      else{
        console.log("---Connection closed, Please reconnect!---")
      }     
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const message = messages[0];

    if (!message.message) return;
    if (message.key.fromMe) return;

    //import commands 
    await handleMessage(sock, message);
  })
}
startBot();