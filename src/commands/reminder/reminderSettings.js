import fs from "fs";

const FILE = "./reminderSettings.json";

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


export function setReminderStatus(jid, enabled) {

    const settings = loadSettings();

    settings[jid] = {
        enabled
    };

    saveSettings(settings);
}


export function getReminderStatus(jid) {

    const settings = loadSettings();

    // Default = ON
    if (!settings[jid]) {
        return true;
    }

    return settings[jid].enabled;
}