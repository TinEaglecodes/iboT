import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.join(__dirname, "reminderSettings.json");

function loadSettings() {
    try {
        const data = fs.readFileSync(FILE, "utf8");

        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

function saveSettings(settings) {
    fs.writeFileSync(
        FILE,
        JSON.stringify(settings, null, 2)
    );
}


// Turn reminders ON/OFF for a user
export function setReminderStatus(jid, enabled) {

    const settings = loadSettings();

    settings[jid] = {
        enabled: enabled
    };
    saveSettings(settings);
}


// Check whether a user's reminders are enabled
export function getReminderStatus(jid) {

    const settings = loadSettings();

    // New users are ON by default
    if (!settings[jid]) {
        return true;
    }
    return settings[jid].enabled;
}

// Get every user who has a reminder setting
export function getAllReminderUsers() {

    const settings = loadSettings();

    return Object.keys(settings);
}