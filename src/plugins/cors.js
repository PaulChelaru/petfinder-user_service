import FastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

async function corsPlugin(fastify) {
    await fastify.register(fastifyCors, {
        origin: [
            "http://localhost:3000",
            "http://localhost:3002",
            "http://localhost:3003",
            "https://app.exemplu.com",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });
}

export default FastifyPlugin(corsPlugin, {
    name: "cors-plugin",
});
