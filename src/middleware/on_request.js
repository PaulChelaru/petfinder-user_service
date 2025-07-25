/**
 * Seeting the start_date of the request
 * @param {import("fastify").FastifyRequest} request
 */
async function onRequestHook (request) {
    request.startAt = process.hrtime();
}

export default onRequestHook;
