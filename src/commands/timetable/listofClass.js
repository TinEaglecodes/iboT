const schedule = {
    //an empty object signifies a free day
    //startHour: the time a class is meant to start
    //startMinute: the minute a class is meant to start
    "monday": [
        { course: "SEN 202", time: "08:00 AM - 10:00 AM", venue: "SOC LT II", startHour: 8, startMinute: 0},
        { course: "CSC 202", time: "02:00 PM - 04:00 PM", venue: "FBN", startHour: 14, startMinute: 0},
    ],
    "tuesday": [
        { course: "CSC 202 Practical", time: "10:00 AM - 11:00 AM", venue: "SOC Lab", startHour: 10, startMinute: 0 },
        { course: "ECN 214", time: "11:00 AM - 01:00 PM", venue: "3-IN-1 B (near SPS)", startHour: 11, startMinute: 0 },
        { course: "CSC 204", time: "02:00 PM - 04:00 PM", venue: "SOC 3-IN-1 B", startHour: 14, startMinute: 0 }
    ],
    "wednesday": [
        { course: "SEN 208 practicals", time: "08:00 AM - 10:00 AM", venue: "OLd SOC middle room", startHour: 8, startMinute: 0 },
        { course: "CSC 206", time: "02:00 PM - 04:00 PM", venue: "3-IN-1 LT2", startHour: 14, startMinute: 0 }
    ],
    "thursday": [
        { course: "SEN 208", time: "08:00 AM - 10:00 AM", venue: "3-IN-1 LT2", startHour: 8, startMinute: 0 },
        { course: "SEN 204", time: "10:00 AM - 12:00 PM", venue: "SOC 3-IN-1 LT", startHour: 10, startMinute: 0 },
        { course: "SEN 206", time: "04:00 PM - 06:00 PM", venue: "LT II", startHour: 16, startMinute: 0 }
    ],
    "friday": [],
    "saturday": [
        { course: "CSP 210", time: "07:00 AM", venue: "May vary", startHour: 7, startMinute: 0 }
    ],
    "sunday": []
    }
export default schedule;