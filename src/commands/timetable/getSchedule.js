import softwareEngineering200  from "../../department-schedule/softwareEngineering/200L.js";
import statistics200 from "../../department-schedule/statistics/200L.js";

const schedules = {
    softwareEngineering: {
        "200L": softwareEngineering200,
    },
    statistics: {
        "200L": statistics200,
    },
};

export default function getSchedule(department, level) {
    if (!department || !level) return null;

    return schedules[department]?.[level] || null;
}
