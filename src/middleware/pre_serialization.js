/**
 * Fastify `onSend` hook, it can change (or replace) the payload before it is serialized
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @param {String} payload
 */
async function preSerialization (request, reply, payload) {
    const {
        data,
        status,
    } = payload;

    let new_payload = payload;
    if (data && status) {
        reply.statusCode = status;
        new_payload = data;
    }

    return new_payload;
}

export default preSerialization;
