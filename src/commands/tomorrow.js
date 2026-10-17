import { getDepartment, getLevel } from "./department/deptSettings.js";
import getSchedule from "./timetable/getSchedule.js";

const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];

const departmentNames = {
    softwareEngineering: "Software Engineering",
    statistics: "Statistics",
};

export default async function tomorrowCommand(sock, jid, message) {
    const department = getDepartment(jid);
    const level = getLevel(jid);

    if (!department || !level) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `🎓 You haven't completed your department and Year selection yet.

Please use:

*.department*

to configure your department and Year.`
            },
            { quoted: message }
        );
        return;
    }

    const schedule = getSchedule(department, level);

    if (!schedule) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `⚠️ I couldn't find a timetable for:

🎓 Department: ${departmentNames[department] || department}
📚 Year: ${level}

This timetable may not have been added yet.`
            },
            { quoted: message }
        );
        return;
    }

    // Calculate tomorrow's day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowName = days[tomorrow.getDay()];
    const tomorrowClasses = schedule[tomorrowName];

    if (!tomorrowClasses || tomorrowClasses.length === 0) {
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `📚 You have no classes scheduled for tomorrow (${tomorrowName.toUpperCase()})!`
            },
            { quoted: message }
        );
        return;
    }

    let scheduleText =
        `📅 *Classes Tomorrow (${tomorrowName.toUpperCase()})*\n` +
        `🎓 ${departmentNames[department] || department} — ${level}\n\n`;

    tomorrowClasses.forEach(c => {
        scheduleText +=
`*${c.course}*
🕒 Time: ${c.time}
🏢 Venue: ${c.venue}

`;
    });

    await sock.sendPresenceUpdate("composing", jid);
    await sock.sendMessage(
        jid,
        {
            text: scheduleText.trim()
        },
        { quoted: message }
    );
}