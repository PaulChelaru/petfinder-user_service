import {
    deleteUser,
    findUserById,
} from "../../helpers/users.js";
import {
    produceUserKafkaMessage,
} from "../../helpers/kafka.js";
import {
    NotAuthorizedError,
    ResourceNotFoundError,
} from "../../errors/client_errors.js";

export default async function handler(req) {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
        throw new ResourceNotFoundError("User not found");
    }

    // Check authorization: admin only
    if (req.user.role !== "admin") {
        throw new NotAuthorizedError();
    }

    await deleteUser(id);
    await produceUserKafkaMessage(req, "user_deleted", user);
}
