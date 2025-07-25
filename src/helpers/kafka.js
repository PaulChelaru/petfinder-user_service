import {ServerError} from "../errors/index.js";

/**
 * Computes a Kafka message payload based on the specified topic and user object.
 *
 * @param {Object} payload - The request payload containing updated fields (for user_updated topic)
 * @param {string} topic - The Kafka topic ('user-created', 'user-updated', or 'user-deleted')
 * @param {Object} user - The user object containing user information
 * @returns {Object} The formatted Kafka message payload with relevant user data and timestamp
 * @throws {ServerError} If the provided topic is not recognized
 */
function computeUserKafkaMessage (payload, topic, user) {
    switch (topic) {
    case "user_created": {
        return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
            city: user.city,
            notifyByEmail: user.notifyByEmail,
            notifyBySms: user.notifyBySms,
            createdAt: user.createdAt,
            timestamp: new Date().toISOString(),
        };
    }
    case "user_updated": {
        // Start with userId and timestamp
        const updatedMessage = {
            userId: user.userId,
            timestamp: new Date().toISOString(),
        };

        // Add only the fields that were actually updated
        const updatableFields = [
            "firstName", "lastName", "username", "email", "city", "phoneNumber",
            "role", "notifyByEmail", "notifyBySms",
        ];

        updatableFields.forEach(field => {
            if (payload && Object.prototype.hasOwnProperty.call(payload, field)) {
                updatedMessage[field] = payload[field];
            }
        });

        return updatedMessage;
    }
    case "user_deleted": {
        return {
            userId: user.userId,
            timestamp: new Date().toISOString(),
        };
    }
    default:
        throw new ServerError(`Unknown topic: ${topic}`);
    }
}



/**
 * Produces and sends a message to a Kafka topic with user data
 * @async
 * @function produceKafkaMessage
 * @param {Object} fastify - The Fastify instance containing the Kafka producer
 * @param {Object} user - The user object whose data will be sent
 * @throws {ServerError} When the Kafka message production fails
 * @returns {Promise<void>} A promise that resolves when the message is sent
 */
async function produceUserKafkaMessage(fastify, topic, user) {
    const payload = computeUserKafkaMessage(fastify.body, topic, user),
        message = {
            topic,
            messages: [{value: JSON.stringify(payload)}],
        };

    try {
        await fastify.server.kafkaProducer.send(message);
        fastify.log.info(`Kafka message sent for ${topic}`, { userId: user._id });
    } catch (error) {
        // Log the error but don't fail the request - Kafka is not critical for user creation
        fastify.log.error(`Failed to send Kafka message for ${topic}`, {
            userId: user._id,
            error: error.message,
            kafkaHealthy: false,
        });
        // Don't throw error to prevent blocking user creation
    }
}

export {
    produceUserKafkaMessage,
};

