/* istanbul ignore file */
"use strict";

import usersRoutes from "./users.js";
import statsRoutes from "./stats.js";

/**
 * Registers the exposed routes in the fastify app
 * @param {import("fastify").FastifyInstance} fastify
 */
async function routesV1 (fastify) {
    fastify
        .register(usersRoutes, {prefix: "/users"})
        .register(statsRoutes, {prefix: "/statistics"});
}
export default routesV1;