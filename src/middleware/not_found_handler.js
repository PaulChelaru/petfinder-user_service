import {PathNotImplementedError} from "../errors/index.js";

/**
 * Fastify not found handler. It throws a `PathNotImplementedError`.
 * @param {import("fastify").FastifyRequest} request
 * @throws {PathNotImplementedError}
 */
async function notImplementedHandler (request) {
    throw new PathNotImplementedError({path: request.raw.url});
}

export default notImplementedHandler;
