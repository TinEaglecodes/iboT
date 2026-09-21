import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
    fs.writeFileSync(
        FILE,
        JSON.stringify(settings, null, 2)
    );
}

// Save a user's department
export function setDepartment(jid, department) {
    const settings = loadSettings();
    settings[jid] = department;
    saveSettings(settings);
}

// Get a user's department
export function getDepartment(jid) {
    const settings = loadSettings();
    return settings[jid] || null;
}

// Check if user has selected a department
export function hasDepartment(jid) {
    const settings = loadSettings();
    return Boolean(settings[jid]);
}