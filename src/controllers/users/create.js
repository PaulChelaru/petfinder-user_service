import { createUser } from "../../helpers/users.js";

export default async function handler(req) {
    const user = await createUser(req.body);
    return user.toObject();
}
