import schedule from "../timetable/listofClass.js";
import {getReminderStatus, getAllReminderUsers} from "./reminderSettings.js";

//edit reminder times here
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
        label: "Now",
    },  
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

    // Check every 30 seconds
    reminderInterval = setInterval(() => {
        checkSchedule(sock);
    }, 30 * 1000);
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

    //Test to make sure the schedule is being checked correctly
    // console.log(
    //     `⏰ Checking schedule: ${today} ${now.toLocaleTimeString()}`
    // );

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

    /*test to check if the difference in minutes is being calculated correctly
    * console.log(
    *   `📚 ${classInfo.course} starts in ${differenceMinutes.toFixed(2)} minutes`
    );
    */

    for (const reminder of reminderTimes) {
        
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

    // Prevent duplicate reminders
    if (sentReminders.has(reminderKey)) {
        return;
    }

    const users = getAllReminderUsers();

    if (users.length === 0) {
        console.log("📭 No users registered for reminders.");
        return;
    }

    const message =`
Your *${classInfo.course}* class

⏰starts *${reminder.label}*.

🕐 ${classInfo.time}
📍 ${classInfo.venue}
`;

    for (const jid of users) {
        const enabled = getReminderStatus(jid);

        if (!enabled) {

            console.log(
                `🔕 Reminders OFF for ${jid}`
            );

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
    // Mark reminder as processed
    sentReminders.add(reminderKey);
}