import Fastify from "fastify";
import * as uuid from "uuid";

// Middleware
import onRequestHook from "./middleware/on_request.js";
import notFoundHandlerHook from "./middleware/not_found_handler.js";
import onSendHook from "./middleware/on_send.js";
import onResponseHook from "./middleware/on_response.js";
import errorHandler from "./middleware/error_handler.js";

// Add error handling to plugin registration
async function build() {
    const app = Fastify({
        logger: {
            level: "info",
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                },
            },
        },
        genReqId: uuid.v4,
    });

    // Register env plugin first
    await app.register(import("./plugins/env.js"));


    // Then register other plugins that depend on env
    await app.register(import("./plugins/cors.js"));
    await app.register(import("./plugins/auth.js"));
    await app.register(import("./plugins/mongoose.js"));

    app.register(import("./routes/index.js"), { prefix: "/v1" });


    app.addHook("onRequest", onRequestHook);
    app.addHook("onSend", onSendHook);
    app.addHook("onResponse", onResponseHook);
    app.setErrorHandler(errorHandler);
    app.setNotFoundHandler(notFoundHandlerHook);

    return app;
}

build()
    .then(app => app.listen({ port: app.config.PORT }))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
