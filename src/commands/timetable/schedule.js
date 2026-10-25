import { getDepartment, getLevel } from "../department/deptSettings.js";
import getSchedule from "./getSchedule.js";

const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];

const departmentNames = {
    softwareEngineering: "Software Engineering",
    statistics: "Statistics",
};

export default async function timetableCommand(sock, jid, message) {
    const department = getDepartment(jid);
    const level = getLevel(jid);

    if (!department) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `🎓 You haven't selected a department yet.

Please use:

*.department*

to select your department and Year.`
        }, { quoted: message });
        return;
    }

    if (!level) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `📚 You haven't selected your Year yet.

Please use *.department* to configure your department and Year.`
        }, { quoted: message });
        return;
    }

    const schedule = getSchedule(department, level);
    if (!schedule) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(jid, {
            text: `⚠️ I couldn't find a timetable for:

🎓 Department: ${departmentNames[department] || department}
📚 Year: ${level}

The timetable has not been added by yet.`
        }, { quoted: message });
        return;
    }

    let scheduleText = `📚 *FULL WEEKLY TIMETABLE*\n`;
    scheduleText += `🎓 Department: ${departmentNames[department] || department}\n`;
    scheduleText += `📚 Year: ${level}\n\n`;

    let hasClasses = false;

    for (const day of days) {
        const classes = schedule[day];

        scheduleText += `📅 *${day.toUpperCase()}*\n`;

        if (!classes || classes.length === 0) {
            scheduleText += "No classes scheduled.\n\n";
            continue;
        }

        hasClasses = true;
        for (const c of classes) {
            scheduleText +=
`• *${c.course}*
  🕒 ${c.time}
  🏢 ${c.venue}
`;
        }

        scheduleText += "\n";
    }

    if (!hasClasses) {
        scheduleText += "There are no classes scheduled for this week.";
    }

    await sock.sendPresenceUpdate("composing", jid);
    await sock.sendMessage(jid,
        { 
            text: scheduleText.trim() 
        },
        { quoted: message }
    );
}