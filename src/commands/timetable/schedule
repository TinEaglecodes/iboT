import schedule from "./listofClass.js";

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//get day of the week
const todayName= days[new Date().getDay()]
const todayClass= schedule[todayName];


export default async function timetableCommand(sock, jid,message){
    //typing state
    await sock.sendPresenceUpdate('composing', jid);
    
    if(!todayClass || todayClass.length === 0){

         //send message
        await sock.sendMessage(jid,
            {text: `There are no classes scheduled today! {randomAdvice} *add random advice generator`},
            {quoted: message}
        )
    }
    let scheduleText = `*Classes Today (${todayName.toUpperCase()}):* \n\n`;
            todayClass.forEach(c => {
                scheduleText += `*${c.course}*
                \n🕒 Time: ${c.time}
                \n🏢 Venue: ${c.venue}\n\n`;
    })
    await sock.sendMessage(jid,
        {text: scheduleText.trim()},
        {quoted: message}
    )
}