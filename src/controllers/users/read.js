import { findUserById } from "../../helpers/users.js";
import {
    ResourceNotFoundError,
    NotAuthorizedError,
} from "../../errors/client_errors.js";

export default async function handler(req) {
    const { id } = req.params;

    const user = await findUserById(id);

    if (!user) {
        throw new ResourceNotFoundError("User not found");
    }

    return user;
}
