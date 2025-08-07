import createController from "../controllers/users/create.js";
import readController from "../controllers/users/read.js";
import updateController from "../controllers/users/update.js";
import removeController from "../controllers/users/remove.js";

import {authenticateApiKey} from "../helpers/auth.js";

async function usersRoutes(fastify) {
    fastify
        .addHook("preHandler", fastify.authenticate)
        .get("/:id", readController)
        .put("/:id", updateController)
        .delete("/:id", removeController)
        .post("/", createController);
}

export default usersRoutes;
