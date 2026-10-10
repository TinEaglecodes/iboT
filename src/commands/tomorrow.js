import {getDepartment} from "./department/deptSettings.js";
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

export default async function tomorrowCommand(sock, jid, message) {
    // Get this user's department
    const department = getDepartment(jid);

    if (!department) {
        //typing state
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

    // Get the timetable for this department
    const schedule = getSchedule(department);

    if (!schedule) {
        //typing state
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

    // Get tomorrow's day, including the Saturday-to-Sunday transition
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowName = days[tomorrow.getDay()];
    const tomorrowClasses = schedule[tomorrowName];

    // No classes tomorrow
    if (!tomorrowClasses || tomorrowClasses.length === 0) {
        //typing state
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

    // Build tomorrow's schedule message
    let scheduleText =
        `📅 *Classes Tomorrow (${tomorrowName.toUpperCase()}):*\n\n`;

    tomorrowClasses.forEach(c => {
        scheduleText +=
`*${c.course}*
🕒 Time: ${c.time}
🏢 Venue: ${c.venue}

`;
    });
    //typing state
    await sock.sendPresenceUpdate("composing", jid);
    await sock.sendMessage(
        jid,
        {
            text: scheduleText.trim()
        },
        { quoted: message }
    );
}