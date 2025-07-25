import DailyVolunteerStats from "../models/DailyVolunteerStats.js";
import { ServerError } from "../errors/server_errors.js";

/**
 * Retrieves all volunteer statistics from the database sorted by date in ascending order.
 *
 * @async
 * @function getVolunteerStats
 * @returns {Promise<Array>} A promise that resolves to an array of volunteer statistics objects.
 * @throws {ServerError} If there is an error retrieving the statistics from the database.
 */
async function getVolunteerStats(startDate) {
    try {
        const query = startDate ? { date: { $gte: startDate } } : {},
            sort = { date: 1 };
        const stats = await DailyVolunteerStats.find(query).sort(sort).lean();
        return stats;
    } catch (error) {
        throw new ServerError(error);
    }
}

export {
    getVolunteerStats,
};
