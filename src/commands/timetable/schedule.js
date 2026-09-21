import { getDepartment } from "../department/deptSettings.js";
import getSchedule from "./getSchedule.js";

const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];

export default async function timetableCommand(sock, jid, message) {
    // Get this user's department
    const department = getDepartment(jid);

    // User hasn't selected a department
    if (!department) {
        await sock.sendMessage(
            jid,
            {text:
`🎓 You haven't selected a department yet.

Please use:

*.department*

to select your department.`
            },
            { quoted: message }
        );
        return;
    }

    // Get the timetable for this department
    const schedule = getSchedule(department);

    // Safety check
    if (!schedule) {
        await sock.sendMessage(
            jid,
            {
                text: "⚠️ I couldn't find a timetable for your department."
            },
            { quoted: message }
        );

        return;
    }

    // Typing state
    await sock.sendPresenceUpdate("composing", jid);

    // Get today's day
    const todayName = days[new Date().getDay()];

    // Get today's classes
    const todayClass = schedule[todayName];

    // No classes today
    if (!todayClass || todayClass.length === 0) {
        await sock.sendMessage(
            jid,
            {
                text: `📚 There are no classes scheduled today!`
            },
            { quoted: message }
        );
        return;
    }

    // Build schedule message
    let scheduleText =
        `*Classes Today (${todayName.toUpperCase()}):*\n\n`;

    todayClass.forEach(c => {
        scheduleText +=
`*${c.course}*
🕒 Time: ${c.time}
🏢 Venue: ${c.venue}

`;
    });
     //typing state
    await sock.sendPresenceUpdate('composing', jid)

    await sock.sendMessage(
        jid,
        {
            text: scheduleText.trim()
        },
        { quoted: message }
    );
}
