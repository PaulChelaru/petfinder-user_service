import FastifyPlugin from "fastify-plugin";
import FastifyEnv from "@fastify/env";

const schema = {
    type: "object",
    required: [
        "PORT", "MONGO_URI", "JWT_SECRET",
        "USER_SERVICE_API_KEY", "KAFKA_BROKERS",
        "KAFKA_USERNAME", "KAFKA_PASSWORD",
    ],
    properties: {
        PORT: { type: "integer", default: 3101 },
        MONGO_URI: { type: "string" },
        JWT_SECRET: { type: "string" },
        USER_SERVICE_API_KEY: { type: "string" },
        KAFKA_BROKERS: { type: "string" },
        KAFKA_USERNAME: { type: "string" },
        KAFKA_PASSWORD: { type: "string" },
    },
};

async function env(fastify) {
    const options = {
        schema,
        dotenv: true,
        data: process.env,
    };
    await fastify.register(FastifyEnv, options);

    if (!fastify.hasDecorator("config")) {
        fastify.decorate("config", fastify.env);
    }
}

export default FastifyPlugin(env);
