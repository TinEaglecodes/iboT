# 🤖 iboT — WhatsApp Class Assistant

iboT is a WhatsApp bot built with **Node.js and Baileys** to make managing my university schedule a little easier.

It can send class reminders, display your timetable, provide course documents, and respond to useful commands directly through WhatsApp.

---

## Features

* 📅 **Class Schedule** — View your weekly timetable.
* 🔔 **Automatic Reminders** — Get notified before your classes.
  * ⏰ 1 hour 30 minutes before
  * ⏰ 30 minutes before
  * ⏰ 2 minutes before
* 🔕 **Reminder Controls** — Turn reminders on or off whenever you want.
* 📚 **Document System** — Request course documents directly from the bot.
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

# Getting Started

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
npm start
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

# Commands
Send:

```text
.help
```
to see all the available commands.

# NOTE

> **The Bot is still under development and some of the features, so you may encounter some bugs.**
> **Don't forget to leave a star and follow me as this helps me alot thank you**