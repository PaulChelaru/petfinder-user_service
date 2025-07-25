import FastifyPlugin from "fastify-plugin";
import FastifyJwt from "@fastify/jwt";

import {
    InvalidTokenError,
    NotAuthorizedError,
    codes,
} from "../errors/index.js";

const {
    INVALID_AUTH_HEADER,
    INVALID_ACCESS_TOKEN,
} = codes;

async function authenticateApiKey(request) {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || apiKey !== request.server.config.USER_SERVICE_API_KEY) {
        throw new InvalidTokenError(INVALID_ACCESS_TOKEN);
    }
    return true;
}


async function authenticateUser(request) {
    try {
        await request.jwtVerify();

        console.log(request.user)
        // Map JWT payload fields to expected names
        if (request.user.uid) {
            request.user.userId = request.user.uid;
        }
        if (request.user.rol) {
            request.user.role = request.user.rol;
        }

        if (request.user.userId !== request.params.id && request.user.role !== "admin") {
            throw new NotAuthorizedError();
        }
    } catch {
        throw new InvalidTokenError(INVALID_AUTH_HEADER);
    }
}

async function authenticate(request) {
    if (request.headers["x-api-key"]) {
        return authenticateApiKey(request);
    } else if (request.headers.authorization) {
        return authenticateUser(request);
    } else {
        throw new InvalidTokenError(INVALID_AUTH_HEADER);
    }
}

async function jwtPlugin(fastify) {
    const options = {
        secret: fastify.config.JWT_SECRET,
        sign: {
            expiresIn: "1h", // Token expiration time
        },
    };
    fastify.register(FastifyJwt, options);

    fastify.decorate("authenticate", authenticate);
}

export default FastifyPlugin(jwtPlugin);
