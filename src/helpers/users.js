import User from "../models/User.js";

import {ServerError} from "../errors/index.js";

/**
 * Creates a new user document in the database
 * @async
 * @param {Object} userData - The data for the new user
 * @returns {Promise<Object>} The created user document as a plain JavaScript object
 * @throws {ServerError} If there's an error during the creation operation
 */
async function createUser(userData) {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw new ServerError(error);
    }
}

/**
 * Finds a user by their UUID in the database
 * @param {string} userId - The UUID of the user to find
 * @returns {Promise<Object>} A Promise that resolves to the user document as a plain JavaScript object
 * @throws {ServerError} If there's an error during the database operation
 */
async function findUserById(userId) {
    try {
        return await User.findOne({ userId }).lean();
    } catch (error) {
        throw new ServerError(error);
    }
}

/**
 * Updates a user document with the provided data
 *
 * @async
 * @param {string} userId - The UUID of the user to update
 * @param {Object} updateData - Object containing the fields to update
 * @returns {Promise<Object>} The updated user document as a plain JavaScript object
 * @throws {ServerError} If there's an error during the update operation
 */
async function updateUser(userId, updateData) {
    const payload = {
            ...updateData,
            updatedAt: new Date(),
        },
        options = {
            new: true,
            runValidators: true,
        };

    try {
        return await User.findOneAndUpdate({ userId }, payload, options).lean();
    } catch (error) {
        throw new ServerError(error);
    }
}

/**
 * Deletes a user from the database by their UUID
 * @param {string} userId - The UUID of the user to delete
 * @returns {Promise<Object>} The deleted user document
 * @throws {ServerError} If an error occurs during deletion
 */
async function deleteUser(userId) {
    try {
        return await User.findOneAndDelete({ userId });
    } catch (error) {
        throw new ServerError(error);
    }
}

export {
    createUser,
    findUserById,
    updateUser,
    deleteUser,
};
