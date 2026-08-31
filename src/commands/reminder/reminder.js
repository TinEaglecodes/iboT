import { getReminderStatus, setReminderStatus} from "./reminderSettings.js";

export default async function reminderCommand(
    sock,
    jid,
    message,
    args
) {

    const option = args[0]?.toLowerCase();

    // TURN ON
    if (option === "on") {

        setReminderStatus(jid, true);
        //typing state
        await sock.sendPresenceUpdate('composing', jid)

        await sock.sendMessage(
            jid,
            {
                text:
`🔔 *Reminders ON*

I'll remind you:
⏰ 1h 30m before class
⏰ 30m before class
⏰ 15m before class
⏰ when the class starts

You can turn them off with: ".reminder off"
`
            },
            {
                quoted: message
            }
        );

        return;
    }


    // TURN OFF
    if (option === "off") {

        setReminderStatus(jid, false);
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`🔕 *Reminders OFF*
You can turn them back on anytime with: ".reminder on"
`},
            {
                quoted: message
            }
        );

        return;
    }

    // STATUS
    if (option === "status") {

        const enabled = getReminderStatus(jid);
        
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(
            jid,
            {
                text:
`🔔 *Reminder Status*

Status: ${enabled ? "🟢 ON" : "🔴 OFF"}

⏰ 1 hour 30 minutes
⏰ 30 minutes
⏰ 15m before class
⏰ now`
            },
            {
                quoted: message
            }
        );

        return;
    }


    // INVALID COMMAND

    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    await sock.sendMessage(
        jid,
        {
            text:
`🤖 *Reminder Settings*

.reminder on
Turn reminders ON

.reminder off
Turn reminders OFF

.reminder status
Check your reminder settings`
        },
        {
            quoted: message
        }
    );
}