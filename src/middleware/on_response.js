/**
 * Logging the request.
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
async function onResponseHook (request, reply) {
    if (reply.statusCode !== 200) {
        return;
    }
    const request_data = {
        url: request.raw.url,
        route: request.routeOptions.url,
        params: request.params,
        body: request.body,
        query: request.query,
        response: reply.body,
    };
    const logMessage = `Logging activity on url ${request.raw.url}, IP ${request.ip}`;
    request.log.info(request_data, logMessage);
}

export default onResponseHook;
