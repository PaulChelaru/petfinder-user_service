import { updateUser } from "../../helpers/users.js";
import { produceUserKafkaMessage } from "../../helpers/kafka.js";

import {
    NotAuthorizedError,
    ResourceNotFoundError,
} from "../../errors/client_errors.js";

export default async function handler(req) {
    const { id } = req.params;

    const user = await updateUser(id, req.body);
    if (!user) {
        throw new ResourceNotFoundError("User not found");
    }

    await produceUserKafkaMessage(req, "user_updated", user);
    return user;
}
