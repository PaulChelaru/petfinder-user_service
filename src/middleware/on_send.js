/**
 * Fastify `onSend` hook. If a handler is returning an empty string as response,
 * here it is replaced by `{status: 0}`.
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @param {String} payload
 */
async function onSendHook (request, reply, payload) {
    if (reply.statusCode === 200) {
        if (!payload) {
            reply.header("content-type", "application/json");
            return JSON.stringify({status: 0});
        } else {
            reply.header("x-request-id", request.id);
            return payload;
        }
    }
    return payload;
}

export default onSendHook;
