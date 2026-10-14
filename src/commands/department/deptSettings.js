
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.join(__dirname, "deptSettings.json");

function loadSettings() {
    try {
        const data = fs.readFileSync(FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

function saveSettings(settings) {
    fs.writeFileSync(FILE, JSON.stringify(settings, null, 2));
}

// Save a user's department
export function setDepartment(jid, department) {
    const settings = loadSettings();

    // Preserve an existing level if one has been selected
    const current = settings[jid];

    settings[jid] = {
        department,
        level:
            typeof current === "object" && current !== null
                ? current.level || null
                : null
    };

    saveSettings(settings);
}

// Get a user's department
export function getDepartment(jid) {
    const settings = loadSettings();
    const user = settings[jid];

    // Backward compatibility with the old settings format
    if (typeof user === "string") {
        return user;
    }

    return user?.department || null;
}

// Save a user's level
export function setLevel(jid, level) {
    const settings = loadSettings();
    const current = settings[jid];

    settings[jid] = {
        department:
            typeof current === "string"
                ? current
                : current?.department || null,
        level
    };

    saveSettings(settings);
}

// Get a user's level
export function getLevel(jid) {
    const settings = loadSettings();
    const user = settings[jid];

    if (typeof user === "string" || !user) {
        return null;
    }

    return user.level || null;
}

// Check if user has selected a department
export function hasDepartment(jid) {
    return Boolean(getDepartment(jid));
}

// Check if user has selected a level
export function hasLevel(jid) {
    return Boolean(getLevel(jid));
}
