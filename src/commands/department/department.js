import { setDepartment } from "./deptSettings.js";

const departments={
    "1": {
        name: "SoftwareEngineering",
        value: "softwareEngineering"
    },
    "2": {
        name: "Statistics",
        value: "statistics"
    }
}

export default async function departmentCommand(sock, jid, message, args) {
    if(!args[0]){
        //typing state
        await sock.sendPresenceUpdate('composing', jid)
        await sock.sendMessage(jid, {
            text: `🎓 *Select your department*

Reply with the number:

1️⃣ Software Engineering
2️⃣ Computer Science

Example:
*.department 1*`
        }, { quoted: message })
        return
    }

    const selected = departments[args[0]];
    setDepartment(jid, selected.value);

    //typing state
    await sock.sendPresenceUpdate('composing', jid)
    await sock.sendMessage(
        jid, {
            text:`✅ *Department saved!*

Your department is now:
🎓 *${selected.name}*

Your timetable and class reminders will now use this department.`
        }, {quoted: message}
    )
}