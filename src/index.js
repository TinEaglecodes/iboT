import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import P from "pino";

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
      console.log("Scan this QR code with your WhatsApp to connect to bootleg t0_0biii. /n Settings > linked devices > Link a device > scan QR code");

      //generate QR code to connect
      qrcode.generate(qr, { small: true });
    }


    //connection message
    if (connection === "open") {
      console.log("--WhatsApp bot connected succesfullly!--");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

       console.log('connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect)

      if (shouldReconnect) {
        console.log("---Reconnecting...---");
        startBot();
      }
      else{
        console.log("---Connection closed, Please reconnect!---")
      }
      
    }
  });

  // sock.ev.on("messages.upsert", async ({ messages }) => {
  //   const message = messages[0];

  //   if (!message.message) return;
  //   if (message.key.fromMe) return;

  //   console.log("📩 New message:", message.message);
  // });

  sock.ev.on("messages.upsert", async ({ messages }) => {
  const message = messages[0];

  if (!message.message) return;
  if (message.key.fromMe) return;

  const text =
    message.message.conversation ||
    message.message.extendedTextMessage?.text ||
    "";

  const jid = message.key.remoteJid;

  console.log(`📩 ${jid}: ${text}`);

  //commands 
  if (text === ".info") {
    await sock.sendMessage(jid, {
      text: `Hi I'm bootleg tobi :), a bot made by Afolabi Tobi. I am your personal class assistant. I notify you about classes, send you your schedule and also send you documents. I am still in development so expect some bugs. Do not worry the bugs will be fixed in due time.`
    });
  }
  
  if (text === ".ping") {
    await sock.sendMessage(jid, {
      text: `Pong,  Bootleg tobi is online and ready to assist!`
    })
  }

  if (text === ".help") {
    await sock.sendMessage(jid, {
      text: `🤖 Available commands:

    .ping - Check if the bot is alive and active
    .info- Display information about this bot
    .help - Show this menu
    .nextclass - Display your next class
    .schedule - Display Your Schedule
    .send <document name> - Send a specific document from the bot's storage
      `
    });
  }
});

}


startBot();
