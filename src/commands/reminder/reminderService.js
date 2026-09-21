import { getReminderStatus, getAllReminderUsers } from "./reminderSettings.js";
import { getDepartment } from "../department/deptSettings.js";
import getSchedule from "../timetable/getSchedule.js";

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

    // Don't start another interval if one is already running
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


// Check everyone's timetable
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

    // Get all users who have reminder settings
    const users = getAllReminderUsers();

    if (users.length === 0) {
        
        // disable because it sends too much console.log("📭 No users registered for reminders.");
        return;
    }

    // Check each user's timetable separately
    for (const jid of users) {

        // Check whether reminders are enabled
        const enabled = getReminderStatus(jid);

        if (!enabled) {
            console.log(`🔕 Reminders OFF for ${jid}`);
            continue;
        }

        // Get user's department
        const department = getDepartment(jid);

        if (!department) {
            console.log(
                `⚠️ No department selected for ${jid}`
            );
            continue;
        }

        // Get timetable for user's department
        const schedule = getSchedule(department);

        if (!schedule) {
            console.log(
                `⚠️ No timetable found for department ${department}`
            );
            continue;
        }

        // Get today's classes
        const classesToday = schedule[today];

        if (!classesToday || classesToday.length === 0) {
            continue;
        }

        // Check each class
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
                reminder,
                jid
            );
        }
    }
}


// Send reminder to one specific user
async function sendReminder(classInfo, reminder, jid) {

    const today =
        new Date().toLocaleDateString("en-CA");

    // Include JID and class time so different users/classes
    // don't interfere with each other's reminders
    const reminderKey =
        `${today}-${jid}-${classInfo.course}-${classInfo.startHour}-${classInfo.startMinute}-${reminder.minutes}`;

    // Prevent duplicate reminders
    if (sentReminders.has(reminderKey)) {
        return;
    }

    const message = `
Your *${classInfo.course}* class

⏰ starts *${reminder.label}*.

🕐 ${classInfo.time}
📍 ${classInfo.venue}
`;

    try {

        await currentSock.sendPresenceUpdate(
            "composing",
            jid
        );

        await currentSock.sendPresenceUpdate(
            "available",
            jid
        );

        await currentSock.sendMessage(
            jid,
            {
                text: message
            }
        );

        console.log(
            `✅ ${reminder.label} reminder sent for ${classInfo.course} → ${jid}`
        );

        // Only mark as sent after successfully sending
        sentReminders.add(reminderKey);

    } catch (error) {

        console.error(
            `❌ Failed to send reminder to ${jid}:`,
            error
        );
    }
}