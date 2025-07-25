import { getVolunteerStats } from "../../helpers/stats.js";

export default async function handler(req) {
    const days = parseInt(req.query.days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const statistics = await getVolunteerStats(startDate);

    const histogram = statistics.map(stat => ({
        date: stat.date.toISOString().split("T")[0],
        newVolunteers: stat.newVolunteers,
        activeVolunteers: stat.activeVolunteers,
    }));

    const totals = {
        totalNewVolunteers: statistics.reduce((sum, stat) => sum + stat.newVolunteers, 0),
        totalActiveVolunteers: statistics.reduce((sum, stat) => sum + stat.activeVolunteers, 0),
    };

    return { histogram, totals };
}
