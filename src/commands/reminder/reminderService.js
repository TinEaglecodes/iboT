import schedule from "../timetable/listofClass.js";
import {getReminderStatus,getAllReminderUsers} from "./reminderSettings.js";

// Edit reminder times here
const reminderTimes = [
    {
        minutes: 60,
        label: "in 1 hour"
    },
    {
        minutes: 30,
        label: "in 30 minutes"
    },
    {
        minutes: 15,
        label: "in 15 minutes"
    },
    {
        minutes: 0,
        label: "Now"
    }
];

// Prevent duplicate reminders
const sentReminders = new Set();

let reminderInterval = null;
let currentSock = null;


// Start the reminder service
export function startReminderService(sock) {

    // Always use the newest WhatsApp socket
    currentSock = sock;

    // If the scheduler is already running,
    // we don't need another interval.
    if (reminderInterval) {
        console.log("⏰ Reminder service already running — socket updated.");
        return;
    }

    console.log("⏰ Reminder service started.");

    // Check immediately
    checkSchedule();

    // Check every 30 seconds
    reminderInterval = setInterval(() => {
        checkSchedule();
    }, 30 * 1000);
}


function checkSchedule() {
    // No active WhatsApp connection
    if (!currentSock) {
        console.log("⚠️ No WhatsApp socket available.");
        return;
    }

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

    if (!classesToday || classesToday.length === 0) {
        console.log("📭 No classes today.");
        return;
    }

    for (const classInfo of classesToday) {
        checkClass(classInfo, now);
    }
}

function checkClass(classInfo, now) {

    const classTime = new Date(now);

    classTime.setHours(
        classInfo.startHour,
        classInfo.startMinute || 0,
        0,
        0
    );

    const differenceMs =
        classTime.getTime() - now.getTime();

    const differenceMinutes =
        differenceMs / 60000;

    for (const reminder of reminderTimes) {

        const reminderTime = reminder.minutes;

        if (
            differenceMinutes <= reminderTime &&
            differenceMinutes > reminderTime - 1
        ) {

            sendReminder(
                classInfo,
                reminder
            );
        }
    }
}


async function sendReminder(classInfo, reminder) {

    const today =
        new Date().toLocaleDateString("en-CA");

    const reminderKey =
        `${today}-${classInfo.course}-${reminder.minutes}`;

    // Prevent duplicate reminders
    if (sentReminders.has(reminderKey)) {
        return;
    }

    const users = getAllReminderUsers();

    if (users.length === 0) {
        console.log("📭 No users registered for reminders.");
        return;
    }

    const message = `
Your *${classInfo.course}* class

⏰ starts *${reminder.label}*.

🕐 ${classInfo.time}
📍 ${classInfo.venue}
`;

    for (const jid of users) {
        const enabled =
            getReminderStatus(jid);

        if (!enabled) {
            console.log(
                `🔕 Reminders OFF for ${jid}`
            );
            continue;
        }

        try {

            await currentSock.sendPresenceUpdate(
                "composing",
                jid
            );
            //typing state
            await currentSock.sendPresenceUpdate("available",jid);
            await currentSock.sendMessage(
                jid,
                {
                    text: message
                }
            );

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
    // Mark reminder as processed
    sentReminders.add(reminderKey);
}