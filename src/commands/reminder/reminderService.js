import schedule from "../timetable/listofClass.js";
import { getReminderStatus } from "./reminderSettings.js";

const REMINDER_TIMES = [
    {
        minutes: 90,
        label: "1 hour 30 minutes"
    },
    {
        minutes: 30,
        label: "30 minutes"
    },
    {
        minutes: 15,
        label: "15 minutes"
    },
    {
        minutes: 0,
        label: "Now",
    },  
];

// Users who should receive reminders
//Add numbers here for test
const REMINDER_USERS = [
    "2349069068239@s.whatsapp.net",
    "2347017106758@s.whatsapp.net",
];

// Prevent duplicate reminders
const sentReminders = new Set();

let reminderInterval = null;


export function startReminderService(sock) {

    // Prevent accidentally starting multiple schedulers
    if (reminderInterval) {
        console.log("⏰ Reminder service is already running.");
        return;
    }

    console.log("⏰ Reminder service started.");

    // Check immediately
    checkSchedule(sock);

    // Check every 10 seconds
    reminderInterval = setInterval(() => {
        checkSchedule(sock);
    }, 10 * 1000);
}


function checkSchedule(sock) {

    const now = new Date();

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    const today = days[now.getDay()];

    const classesToday = schedule[today];

    console.log(
        `⏰ Checking schedule: ${today} ${now.toLocaleTimeString()}`
    );

    if (!classesToday || classesToday.length === 0) {
        console.log("📭 No classes today.");
        return;
    }

    for (const classInfo of classesToday) {
        checkClass(sock, classInfo, now);
    }
}


function checkClass(sock, classInfo, now) {

    const classTime = new Date(now);

    classTime.setHours(
        classInfo.startHour,
        classInfo.startMinute || 0,
        0,
        0
    );

    const differenceMs = classTime.getTime() - now.getTime();

    const differenceMinutes = differenceMs / 60000;

    console.log(
        `📚 ${classInfo.course} starts in ${differenceMinutes.toFixed(2)} minutes`
    );

    for (const reminder of REMINDER_TIMES) {

        const reminderTime = reminder.minutes;

        /*
         * Instead of checking:
         *
         * differenceMinutes === 90
         *
         * we check whether we're inside the
         * 1-minute window around the reminder.
         */

        if (
            differenceMinutes <= reminderTime &&
            differenceMinutes > reminderTime - 1
        ) {

            sendReminder(
                sock,
                classInfo,
                reminder
            );
        }
    }
}


async function sendReminder(sock, classInfo, reminder) {

    const today = new Date().toLocaleDateString("en-CA");

    const reminderKey =
        `${today}-${classInfo.course}-${reminder.minutes}`;

    // Don't send the same reminder twice
    if (sentReminders.has(reminderKey)) {
        return;
    }

    sentReminders.add(reminderKey);

    const message =
`🔔 *CLASS REMINDER*

*${classInfo.course}*

⏰ Your class starts in *${reminder.label}*.

🕐 ${classInfo.time}
📍 ${classInfo.venue}
`;

    for (const jid of REMINDER_USERS) {

        // Check whether this user has reminders enabled
        const enabled = getReminderStatus(jid);

        if (!enabled) {
            console.log(`🔕 Reminders OFF for ${jid}`);
            continue;
        }

        try {

            await sock.sendMessage(jid, {
                text: message
            });

            console.log(
                `✅ ${reminder.label} reminder sent for ${classInfo.course} → ${jid}`
            );

        } catch (error) {

            console.error(
                `❌ Failed to send reminder to ${jid}:`,
                error
            );
        }
    }
}