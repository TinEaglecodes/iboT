import { getReminderStatus, getAllReminderUsers } from "./reminderSettings.js";
import { getDepartment, getLevel } from "../department/deptSettings.js";
import getSchedule from "../timetable/getSchedule.js";

// Reminder times are in minutes before class starts
const reminderTimes = [
    {
        minutes: 90,
        label: "in 1 hour 30 minutes"
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

const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];

// Start the reminder service
export function startReminderService(sock) {
    currentSock = sock;

    if (reminderInterval) {
        console.log("⏰ Reminder service already running — socket updated.");
        return;
    }

    console.log("⏰ Reminder service started.");
    checkSchedule();

    reminderInterval = setInterval(() => {
        checkSchedule();
    }, 30 * 1000);
}

// Check every user's timetable
function checkSchedule() {
    if (!currentSock) {
        console.log("⚠️ No WhatsApp socket available.");
        return;
    }

    const now = new Date();
    const today = days[now.getDay()];
    const users = getAllReminderUsers();

    if (users.length === 0) {
        return;
    }

    for (const jid of users) {
        if (!getReminderStatus(jid)) {
            continue;
        }

        // Get this user's department AND level
        const department = getDepartment(jid);
        const level = getLevel(jid);

        if (!department || !level) {
            console.log(
                `⚠️ Department or level not selected for ${jid}`
            );
            continue;
        }

        // Retrieve the timetable for this specific combination
        const schedule = getSchedule(department, level);

        if (!schedule) {
            console.log(
                `⚠️ No timetable found for ${department}, ${level}`
            );
            continue;
        }

        const classesToday = schedule[today];

        if (!classesToday || classesToday.length === 0) {
            continue;
        }

        for (const classInfo of classesToday) {
            checkClass(classInfo, jid, now);
        }
    }
}

// Check whether a class needs a reminder
function checkClass(classInfo, jid, now) {
    const classTime = new Date(now);

    classTime.setHours(
        classInfo.startHour,
        classInfo.startMinute || 0,
        0,
        0
    );

    const differenceMs = classTime.getTime() - now.getTime();
    const differenceMinutes = differenceMs / 60000;

    for (const reminder of reminderTimes) {
        if (
            differenceMinutes <= reminder.minutes &&
            differenceMinutes > reminder.minutes - 1
        ) {
            sendReminder(classInfo, reminder, jid);
        }
    }
}

// Send a reminder to one user
async function sendReminder(classInfo, reminder, jid) {
    const today = new Date().toLocaleDateString("en-CA");

    const reminderKey =
        `${today}-${jid}-${classInfo.course}-${classInfo.startHour}-${classInfo.startMinute}-${reminder.minutes}`;

    if (sentReminders.has(reminderKey)) {
        return;
    }

    // Reserve the key immediately to prevent concurrent duplicates
    sentReminders.add(reminderKey);

    const message =
`📚 *Class Reminder*

Your *${classInfo.course}* class ${reminder.minutes === 0
        ? "starts *now*!"
        : `starts *${reminder.label}*.`}

🕐 ${classInfo.time}
📍 ${classInfo.venue}`;

    try {
        await currentSock.sendPresenceUpdate("composing", jid);

        await currentSock.sendMessage(jid, {
            text: message
        });

        console.log(
            `✅ ${reminder.label} reminder sent for ${classInfo.course} → ${jid}`
        );
    } catch (error) {
        // Allow retry if sending fails
        sentReminders.delete(reminderKey);

        console.error(
            `❌ Failed to send reminder to ${jid}:`,
            error
        );
    }
}