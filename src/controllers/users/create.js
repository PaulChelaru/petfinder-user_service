import { createUser }              from "../../helpers/users.js";
import { produceUserKafkaMessage } from "../../helpers/kafka.js";

export default async function handler(req) {
    const user = await createUser(req.body);
    await produceUserKafkaMessage(req, "user_created", user);

    return user.toObject();
}
