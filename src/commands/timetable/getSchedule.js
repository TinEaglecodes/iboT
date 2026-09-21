import softwareEngineering from "./department timetable/softwareEngineering.js";
import statistics from "./department timetable/statistics.js";

const schedules = {
    softwareEngineering,
    statistics,
};

export default function getSchedule(department) {
    return schedules[department] || null;
}