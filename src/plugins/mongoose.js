import FastifyPlugin from "fastify-plugin";
import mongoose from "mongoose";

async function mongoosePlugin(fastify) {
    try {
        await mongoose.connect(fastify.config.MONGO_URI);
        fastify.log.info("MongoDB connected");

        fastify.addHook("onClose", async () => {
            await mongoose.connection.close();
        });
    } catch (error) {
        fastify.log.error("MongoDB connection error:", error);
        throw error;
    }
}

export default FastifyPlugin(mongoosePlugin);
