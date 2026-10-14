
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

export default async function todayCommand(sock, jid, message) {
    const department = getDepartment(jid);
    const level = getLevel(jid);

    if (!department || !level) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `🎓 You haven't completed your department and level selection yet.

Please use:

*.department*

to configure your department and level.`
            },
            { quoted: message }
        );
        return;
    }

    const schedule = getSchedule(department, level);

    if (!schedule) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `⚠️ I couldn't find a timetable for:

🎓 Department: ${departmentNames[department] || department}
📚 Level: ${level}

This timetable may not have been added yet.`
            },
            { quoted: message }
        );
        return;
    }

    const todayName = days[new Date().getDay()];
    const todayClass = schedule[todayName];

    if (!todayClass || todayClass.length === 0) {
        //typing state
        await sock.sendPresenceUpdate("composing", jid);
        await sock.sendMessage(
            jid,
            {
                text: `📚 There are no classes scheduled today!`
            },
            { quoted: message }
        );
        return;
    }

    let scheduleText =
        `📚 *Classes Today (${todayName.toUpperCase()})*\n` +
        `🎓 ${departmentNames[department] || department} — ${level}\n\n`;

    todayClass.forEach(c => {
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
