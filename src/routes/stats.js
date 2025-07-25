import statsVolunteersController from "../controllers/statistics/stats_volunteers.js";

async function statsRoutes(fastify) {

    fastify
        .addHook("onRequest", fastify.authenticate)
        .get("/", statsVolunteersController);
}

export default statsRoutes;
