
import { setDepartment, setLevel } from "./deptSettings.js";

const departments = {
    "1": {
        name: "Software Engineering",
        value: "softwareEngineering",
        levels: ["100", "200", "300", "400", "500"]
    },
    "2": {
        name: "Computer Science",
        value: "computerScience",
        levels: ["100", "200", "300", "400", "500"]
    }
};

export default async function departmentCommand(sock, jid, message, args) {
    // No department or level supplied: show departments
    if (!args[0]) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `🎓 *Select your department*

Reply with the number:

1️⃣ Software Engineering
2️⃣ Computer Science

Example:
*.department 1*`
        }, { quoted: message });
        return;
    }

    const selected = departments[args[0]];

    // Validate department
    if (!selected) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: "❌ Invalid department. Use *.department* to see the available options."
        }, { quoted: message });
        return;
    }

    // Department selected, but no Year supplied
    if (!args[1]) {
        setDepartment(jid, selected.value);
        
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `✅ *Department selected!*

🎓 Department: *${selected.name}*

Now select your Year:

${selected.levels.map((level, index) => `${index + 1}️⃣ ${level}`).join("\n")}

Example:
*.department ${args[0]} 2*

This example selects ${selected.levels[1]}.

Your timetable will use both your department and Year.`
        }, { quoted: message });
        return;
    }

    const levelIndex = Number(args[1]) - 1;
    const selectedLevel = selected.levels[levelIndex];

    // Validate level
    if (!selectedLevel || !Number.isInteger(Number(args[1]))) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `❌ Invalid Year.

Choose a number from 1 to ${selected.levels.length}.`
        }, { quoted: message });
        return;
    }

    setDepartment(jid, selected.value);
    setLevel(jid, selectedLevel);

    //typing state
    await sock.sendPresenceUpdate("composing", jid);
    await sock.sendMessage(jid, {
        text: `✅ *Department and Year saved!*

🎓 Department: *${selected.name}*
📚 Year: *${selectedLevel}*

Your timetable and class reminders will use these settings.`
    }, { quoted: message });
}
