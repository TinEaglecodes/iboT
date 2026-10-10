import { getDepartment } from "../department/deptSettings.js";
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

export default async function timetableCommand(sock, jid, message) {
    const department = getDepartment(jid);

    if (!department) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `🎓 You haven't selected a department yet.

Please use:

*.department*

to select your department.`
            },
            { quoted: message }
        );
        return;
    }

    const schedule = getSchedule(department);

    if (!schedule) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: "⚠️ I couldn't find a timetable for your department."
            },
            { quoted: message }
        );
        return;
    }

    let scheduleText = `📚 *FULL WEEKLY TIMETABLE*\n`;
    scheduleText += `🎓 Department: ${department}\n\n`;

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
    await sock.sendMessage(
        jid,
        { text: scheduleText.trim() },
        { quoted: message }
    );
}