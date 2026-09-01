# 🤖 iboT — WhatsApp Class Assistant

> **Your personal class assistant, right inside WhatsApp.**

iboT is a WhatsApp bot built with **Node.js and Baileys** to make managing my university schedule a little easier.

It can send class reminders, display your timetable, provide course documents, and respond to useful commands — all directly through WhatsApp.

---

## Features

* 📅 **Class Schedule** — View your weekly timetable.
* 🎓 **Next Class** — Find out what class is coming up next.
* 🔔 **Automatic Reminders** — Get notified before your classes.
  * ⏰ 1 hour 30 minutes before
  * ⏰ 30 minutes before
  * ⏰ 2 minutes before
* 🔕 **Reminder Controls** — Turn reminders on or off whenever you want.
* 📚 **Document System** — Request course documents directly from the bot.
* 💬 **WhatsApp Replies** — Bot responses can quote the message they're responding to.
* 🔄 **Automatic Reconnection** — Attempts to reconnect if WhatsApp disconnects.
* 💾 **Lightweight Storage** — Uses local files for settings instead of requiring a database.

---

## 🛠️ Tech Stack

* **Node.js**
* **JavaScript (ES Modules)**
* **Baileys** — WhatsApp Web API library
* **Pino** — Logging
* **QRCode Terminal** — Displays the WhatsApp login QR code
* **JSON** — Lightweight local settings storage

---

## 📁 Project Structure

```text
whatsapp-bot/
│
├── src/
│   ├── commands/
│   │   ├── reminder/
│   │   │   ├── reminder.js
│   │   │   ├── reminderService.js
│   │   │   ├── reminderSettings.js
│   │   │   └── reminderSettings.json
│   │   │
│   │   └── timetable/
│   │       ├── listofClass.js
│   │       └── ...
│   │
│   ├── handlers/
│   │   └── messageHandler.js
│   │
│   └── index.js
│
├── auth_info/
│   └── ...
│
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/TinEaglecodes/iboT.git
cd <project-folder>
```

## 2. Install dependencies

```bash
npm install
```

The project uses Baileys and other dependencies defined in `package.json`.

---

## 3. Start the bot

Run:

```bash
node src/index.js
```

You should see a QR code in your terminal.

Open WhatsApp and go to:

**Settings → Linked Devices → Link a Device**

Scan the QR code.

Once connected in the terminal you should see:

```text
---✅ iboT is connected!---
```

The bot is now ready.
---

# 🤖 Commands

Send:

```text
.help
```

to see the available commands.

### Available commands

| Command | Description |
| ------- | ----------- |
| `.ping` |             |
