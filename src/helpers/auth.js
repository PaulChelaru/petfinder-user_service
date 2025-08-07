import { codes, InvalidTokenError } from "../errors/index.js";

const { INVALID_ACCESS_TOKEN } = codes;

async function authenticateApiKey(request) {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey || apiKey !== request.server.config.USER_SERVICE_API_KEY) {
        throw new InvalidTokenError(INVALID_ACCESS_TOKEN);
    }
    return true;
}

export {
    authenticateApiKey,
};