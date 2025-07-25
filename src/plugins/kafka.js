import FastifyPlugin from "fastify-plugin";
import { Kafka } from "kafkajs";

async function kafkaPlugin(fastify) {
    const kafka = new Kafka({
        clientId: "user-service",
        brokers: fastify.config.KAFKA_BROKERS.split(","),
        sasl: {
            mechanism: "plain",
            username: fastify.config.KAFKA_USERNAME,
            password: fastify.config.KAFKA_PASSWORD,
        },
    });

    const producer = kafka.producer();
    await producer.connect();

    fastify.decorate("kafkaProducer", producer);
    fastify.log.info("Kafka producer connected");

    fastify.addHook("onClose", async () => {
        await producer.disconnect();
    });
}

export default FastifyPlugin(kafkaPlugin);
