import { updateUser } from "../../helpers/users.js";

import {
    ResourceNotFoundError,
} from "../../errors/client_errors.js";

export default async function handler(req) {
    const { id } = req.params;

    const user = await updateUser(id, req.body);
    if (!user) {
        throw new ResourceNotFoundError("User not found");
    }

    return user;
}
